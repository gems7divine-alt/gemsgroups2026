import logging
import re
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated, Literal

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from pydantic import BaseModel, Field, StringConstraints

from config.settings_config import settings
from llm_chain.chain import RAGPipeline

logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# Finds list lines such as "- Item", "* Item" or "1. Item".
LIST_ITEM = re.compile(r"^\s*(?:[-*•]|\d+[.)])\s+(.+)$")
MAX_POINT_TITLE_LENGTH = 40


class HistoryMessage(BaseModel):
    """One earlier message of the conversation, sent by the frontend."""

    role: Literal["user", "assistant"]
    content: Annotated[str, StringConstraints(max_length=10000)]


class ChatRequest(BaseModel):
    """A new question and the conversation so far."""

    question: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=1000)
    ]
    history: list[HistoryMessage] = Field(default_factory=list)


class Source(BaseModel):
    """A document page that was used to find the answer."""

    source: str
    page: int


class Point(BaseModel):
    """One list item of an answer. The title is empty if the item has no label."""

    title: str
    detail: str


class ChatResponse(BaseModel):
    """The structured answer, its sources, and whether the cache supplied it."""

    summary: str
    points: list[Point]
    answer: str
    sources: list[Source]
    cached: bool


def structure_answer(answer: str) -> dict:
    """Split the answer text into a summary and a list of points."""
    summary_lines = []
    points = []
    for line in answer.replace("**", "").splitlines():
        match = LIST_ITEM.match(line)
        if match:
            title, separator, detail = match.group(1).partition(": ")
            # Only a short start is a label; a longer one is part of a sentence.
            if separator and len(title) <= MAX_POINT_TITLE_LENGTH:
                points.append(Point(title=title, detail=detail))
            else:
                points.append(Point(title="", detail=match.group(1)))
        elif line.strip():
            summary_lines.append(line.strip())
    return {"summary": "\n".join(summary_lines), "points": points}


def to_chat_history(history: list[HistoryMessage]) -> list[BaseMessage]:
    """Keep the most recent messages and convert them for the prompt."""
    # A negative slice with 0 would keep everything, so handle that case first.
    limit = settings.chat_history_max_messages
    recent = history[-limit:] if limit > 0 else []
    return [
        HumanMessage(message.content)
        if message.role == "user"
        else AIMessage(message.content)
        for message in recent
    ]


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Load the RAG pipeline once when the server starts."""
    app.state.pipeline = RAGPipeline()
    logger.info("RAG pipeline is ready")
    yield


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


# A plain "def" makes FastAPI run this in a worker thread, because the pipeline
# blocks while it waits for the embedding and LLM calls.
@app.post("/chat")
def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    """Answer a question from the Gems Groups documents."""
    try:
        result = request.app.state.pipeline.ask(
            payload.question, to_chat_history(payload.history)
        )
    except Exception as error:
        # Log the details here and keep provider errors out of the public response.
        logger.exception("Could not answer the question")
        raise HTTPException(
            status_code=503, detail="The assistant is unavailable right now."
        ) from error
    return ChatResponse(**result, **structure_answer(result["answer"]))


# Runs only when this file is started directly: python main.py
if __name__ == "__main__":
    uvicorn.run(
        "main:app", host=settings.api_host, port=settings.api_port, reload=settings.debug
    )
