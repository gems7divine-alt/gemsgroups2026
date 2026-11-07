import logging

import litellm
from langchain_core.messages import BaseMessage, convert_to_openai_messages
from langchain_core.prompt_values import PromptValue
from langchain_core.runnables import Runnable, RunnableLambda, RunnablePassthrough
from litellm import Router

from config.settings_config import settings
from prompts.prompt import (
    NO_INFORMATION_REPLY,
    OUT_OF_SCOPE_REPLY,
    RAG_PROMPT,
    REWRITE_PROMPT,
    format_context,
    format_conversation,
)
from retreival.retreiver import HybridRetriever
from semantic_cache.redis_cache import get_semantic_cache

logger = logging.getLogger(__name__)

# Hide LiteLLM's "Give Feedback" messages from the error output.
litellm.suppress_debug_info = True


def get_llm_router() -> Router:
    """Create the LiteLLM router that switches to the fallback model on failure."""
    # List both models. The names "google" and "groq" match LLM_PROVIDER in .env.
    model_list = [
        {
            "model_name": "google",
            "litellm_params": {
                "model": f"gemini/{settings.google_llm_model}",
                "api_key": settings.google_api_key.get_secret_value(),
            },
        },
        {
            "model_name": "groq",
            "litellm_params": {
                "model": f"groq/{settings.groq_llm_model}",
                "api_key": settings.groq_api_key.get_secret_value(),
            },
        },
    ]

    # A fallback only helps if it is a different provider from the main one.
    fallbacks = []
    if settings.llm_fallback_provider != settings.llm_provider:
        fallbacks = [{settings.llm_provider: [settings.llm_fallback_provider]}]

    return Router(
        model_list=model_list,
        fallbacks=fallbacks,
        num_retries=settings.llm_max_retries,
        timeout=settings.llm_timeout_seconds,
    )


def get_llm(temperature: float = settings.llm_temperature) -> Runnable:
    """Create the chain step that sends the prompt to the model through LiteLLM."""
    router = get_llm_router()

    def call_llm(prompt: PromptValue) -> str:
        """Send the prompt to the main model and return the answer text."""
        # LiteLLM tries the main model first, then the fallback if it keeps failing.
        response = router.completion(
            model=settings.llm_provider,
            messages=convert_to_openai_messages(prompt.to_messages()),
            temperature=temperature,
            max_tokens=settings.llm_max_tokens,
        )
        # Log the model that answered, so you can see when the fallback was used.
        logger.info("Answered by: %s", response.model)
        return response.choices[0].message.content or ""

    return RunnableLambda(call_llm)


def build_rag_chain(retriever: HybridRetriever) -> Runnable:
    """Connect the steps: retrieve chunks, build the context, then generate the answer."""
    answer_chain = RAG_PROMPT | get_llm()

    # Each step adds its result to the data passed along to the next step.
    return (
        RunnablePassthrough.assign(
            documents=lambda data: retriever.search(data["question"])
        )
        | RunnablePassthrough.assign(
            context=lambda data: format_context(data["documents"])
        )
        | RunnablePassthrough.assign(answer=answer_chain)
    )


class RAGPipeline:
    """Answer questions from the Gems Groups documents."""

    def __init__(self) -> None:
        """Prepare the retriever and the chain once, so each question runs quickly."""
        self.chain = build_rag_chain(HybridRetriever())
        # Temperature 0 so that the same follow-up is rewritten the same way each time.
        self.rewrite_chain = REWRITE_PROMPT | get_llm(temperature=0)
        self.cache = get_semantic_cache()

    def ask(
        self, question: str, chat_history: list[BaseMessage] | None = None
    ) -> dict:
        """Answer from the cache if possible, otherwise from the documents and LLM."""
        # Stop early if the question is empty.
        question = question.strip()
        if not question:
            raise ValueError("Question cannot be empty")

        # Turn a follow-up such as "tell me more" into a complete question. The cache,
        # search and answer then all work from it, so a saved answer never depends on
        # one user's conversation.
        if chat_history:
            rewritten = self.rewrite_chain.invoke(
                {
                    "question": question,
                    "conversation": format_conversation(chat_history),
                }
            ).strip()
            logger.info("Rewrote question: %s -> %s", question, rewritten)
            question = rewritten or question

        # A cache hit returns straight away, without searching or generating an answer.
        cached = self.cache.lookup(question) if self.cache else None
        if cached:
            return {**cached, "cached": True}

        result = self.chain.invoke({"question": question})
        answer = result["answer"].strip()

        # A refusal did not use the documents, so it should not show any sources.
        if answer in (OUT_OF_SCOPE_REPLY, NO_INFORMATION_REPLY):
            # Not saved: a wrong refusal would keep being repeated until it expires.
            return {"answer": answer, "sources": [], "cached": False}

        # List each file and page once, keeping the order of the search results.
        sources = list(
            dict.fromkeys(
                (doc.metadata["source"], doc.metadata["page"])
                for doc in result["documents"]
            )
        )
        sources = [{"source": source, "page": page} for source, page in sources]

        if self.cache:
            self.cache.save(question, answer, sources)

        return {"answer": answer, "sources": sources, "cached": False}


# Runs only when this file is started directly: ask a sample question.
if __name__ == "__main__":
    logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
    response = RAGPipeline().ask("What is the monthly service fee?")
    logger.info("Answer: %s", response["answer"])
    logger.info("Sources: %s", response["sources"])
