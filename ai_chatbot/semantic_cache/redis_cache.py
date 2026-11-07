import logging

import redis
from redisvl.extensions.cache.llm import SemanticCache
from redisvl.utils.vectorize import CustomVectorizer

from config.settings_config import settings
from embeddings.embedder import get_embedding_model

logger = logging.getLogger(__name__)

# Stop waiting quickly if Redis goes down, so the chatbot can use the LLM instead.
REDIS_TIMEOUT_SECONDS = 2


class RedisSemanticCache:
    """Save answers in Redis and find them again for the same or a similar question."""

    def __init__(self) -> None:
        """Connect to Redis and create the cache index if it does not exist."""
        client = redis.Redis.from_url(
            settings.redis_url,
            password=settings.redis_password.get_secret_value() or None,
            socket_connect_timeout=REDIS_TIMEOUT_SECONDS,
            socket_timeout=REDIS_TIMEOUT_SECONDS,
        )
        self.cache = SemanticCache(
            name=settings.semantic_cache_name,
            distance_threshold=settings.semantic_cache_distance_threshold,
            ttl=settings.semantic_cache_ttl_seconds,
            vectorizer=CustomVectorizer(embed=get_embedding_model().embed_query),
            redis_client=client,
        )

    def lookup(self, question: str) -> dict | None:
        """Return the saved answer and sources, or None when there is no match."""
        # A cache problem must never stop the chatbot, so treat it as a miss.
        try:
            matches = self.cache.check(prompt=question, num_results=1)
        except Exception:
            logger.warning("Cache lookup failed, using the LLM", exc_info=True)
            return None

        if not matches:
            logger.info("Cache miss: %s", question)
            return None

        match = matches[0]
        logger.info(
            "Cache hit: %s (matched: %s, distance: %s)",
            question,
            match["prompt"],
            match["vector_distance"],
        )
        return {
            "answer": match["response"],
            "sources": match.get("metadata", {}).get("sources", []),
        }

    def save(self, question: str, answer: str, sources: list[dict]) -> None:
        """Save an answer so the next matching question can skip the LLM."""
        try:
            self.cache.store(
                prompt=question, response=answer, metadata={"sources": sources}
            )
        except Exception:
            logger.warning("Could not save the answer to the cache", exc_info=True)


def get_semantic_cache() -> RedisSemanticCache | None:
    """Create the cache, or return None so the chatbot runs without it."""
    if not settings.semantic_cache_enabled:
        logger.info("Semantic cache is turned off")
        return None

    try:
        return RedisSemanticCache()
    except Exception:
        logger.warning(
            "Semantic cache is unavailable, every question will use the LLM",
            exc_info=True,
        )
        return None
