import logging
import re

from langchain_core.documents import Document
from rank_bm25 import BM25Okapi

from config.settings_config import settings
from vectordb.vector_store import get_vector_store

logger = logging.getLogger(__name__)

# How many extra results each search collects before they are combined.
CANDIDATE_MULTIPLIER = 4
# Standard Reciprocal Rank Fusion constant; it stops one top rank from dominating.
RRF_K = 60

# Finds words and keeps values such as "6,500" and "name@mail.com" in one piece.
TOKEN_PATTERN = re.compile(r"[a-z0-9]+(?:[.,@'-][a-z0-9]+)*")
# Common words that say nothing about the topic, so keyword search ignores them.
STOP_WORDS = frozenset(
    "a an and are as at be but by can do does for from has have how i if in is it "
    "me my of on or our so that the their them there these they this to us was we "
    "what when where which who why will with you your".split()
)


def tokenize(text: str) -> list[str]:
    """Split text into lowercase keywords and remove common words."""
    return [
        token for token in TOKEN_PATTERN.findall(text.lower())
        if token not in STOP_WORDS
    ]


class HybridRetriever:
    """Find chunks using both vector search and BM25 keyword search."""

    def __init__(self) -> None:
        """Open the vector store and build the keyword index from its chunks."""
        self.vector_store = get_vector_store()

        # Read the chunks from Chroma so both searches always use the same data.
        stored = self.vector_store.get(include=["documents", "metadatas"])
        if not stored["ids"]:
            raise ValueError(
                "The vector store is empty. Run python -m vectordb.vector_store first."
            )

        self.documents = [
            Document(id=chunk_id, page_content=text, metadata=metadata)
            for chunk_id, text, metadata in zip(
                stored["ids"], stored["documents"], stored["metadatas"]
            )
        ]
        self.bm25 = BM25Okapi([tokenize(doc.page_content) for doc in self.documents])

    def vector_search(
        self, query: str, limit: int, score_threshold: float
    ) -> list[Document]:
        """Find chunks with a similar meaning, keeping those above the threshold."""
        results = self.vector_store.similarity_search_with_relevance_scores(
            query, k=limit
        )
        return [doc for doc, score in results if score >= score_threshold]

    def keyword_search(self, query: str, limit: int) -> list[Document]:
        """Find chunks containing the query's keywords, best matches first."""
        tokens = set(tokenize(query))
        if not tokens:
            return []

        # Keep only chunks with a real keyword match, because BM25 scores can be 0.
        matches = [
            (score, doc)
            for score, doc in zip(self.bm25.get_scores(list(tokens)), self.documents)
            if tokens & set(tokenize(doc.page_content))
        ]
        matches.sort(key=lambda match: match[0], reverse=True)
        return [doc for _, doc in matches[:limit]]

    def search(
        self,
        query: str,
        top_k: int = settings.retriever_top_k,
        score_threshold: float = settings.retriever_score_threshold,
    ) -> list[Document]:
        """Run both searches and return the top chunks after combining them."""
        limit = top_k * CANDIDATE_MULTIPLIER
        ranked_lists = [
            self.vector_search(query, limit, score_threshold),
            self.keyword_search(query, limit),
        ]

        # Reciprocal Rank Fusion: a chunk earns more points the higher it ranks,
        # and a chunk found by both searches adds up points from each one.
        scores: dict[str, float] = {}
        documents_by_id: dict[str, Document] = {}
        for ranked_list in ranked_lists:
            for rank, doc in enumerate(ranked_list, start=1):
                scores[doc.id] = scores.get(doc.id, 0.0) + 1 / (RRF_K + rank)
                documents_by_id[doc.id] = doc

        # Return the chunks with the most points first.
        best_ids = sorted(scores, key=scores.get, reverse=True)[:top_k]
        return [documents_by_id[chunk_id] for chunk_id in best_ids]


# Runs only when this file is started directly: search with a sample question.
if __name__ == "__main__":
    logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
    sample_query = "What is the monthly service fee?"
    for result in HybridRetriever().search(sample_query):
        logger.info("%s | %s", result.metadata, result.page_content[:80])
