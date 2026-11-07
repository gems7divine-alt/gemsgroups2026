import logging

from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from chunking.chunking_documents import chunk_documents, load_processed_docs
from config.settings_config import settings

logger = logging.getLogger(__name__)


def get_embedding_model() -> GoogleGenerativeAIEmbeddings:
    """Create the Google embedding model using the values from .env."""
    return GoogleGenerativeAIEmbeddings(
        model=settings.embedding_model,
        google_api_key=settings.google_api_key.get_secret_value(),
        output_dimensionality=settings.embedding_dimension,
    )


def embed_chunks(
    chunks: list[Document],
    embedding_model: GoogleGenerativeAIEmbeddings | None = None,
) -> list[list[float]]:
    """Turn each chunk's text into one embedding vector, in the same order."""
    # Stop early if there is nothing to embed.
    if not chunks:
        raise ValueError("No chunks to embed")

    # Create the model only if one was not passed in.
    embedding_model = embedding_model or get_embedding_model()

    # Send the chunk text to Google in batches and get one vector per chunk.
    texts = [chunk.page_content for chunk in chunks]
    return embedding_model.embed_documents(
        texts, batch_size=settings.embedding_batch_size
    )


# Runs only when this file is started directly: read, chunk, then embed the data.
if __name__ == "__main__":
    logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
    chunks = chunk_documents(load_processed_docs())
    embeddings = embed_chunks(chunks)
    logger.info(
        "Done: %d chunks embedded, each vector has %d numbers",
        len(embeddings),
        len(embeddings[0]),
    )
