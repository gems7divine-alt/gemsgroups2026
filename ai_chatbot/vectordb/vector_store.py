import logging

import chromadb
from chromadb.config import Settings as ChromaSettings
from chromadb.errors import NotFoundError
from langchain_chroma import Chroma
from langchain_core.documents import Document

from chunking.chunking_documents import chunk_documents, load_processed_docs
from config.settings_config import settings
from embeddings.embedder import embed_chunks, get_embedding_model

logger = logging.getLogger(__name__)

# Tells Chroma how to measure the distance between vectors.
COLLECTION_CONFIGURATION = {"hnsw": {"space": settings.chroma_distance_metric}}


def get_chroma_client() -> chromadb.ClientAPI:
    """Open the Chroma database saved in the folder set in .env."""
    return chromadb.PersistentClient(
        path=str(settings.chroma_persist_dir),
        settings=ChromaSettings(anonymized_telemetry=False),
    )


def store_embeddings(chunks: list[Document], embeddings: list[list[float]]) -> int:
    """Replace the stored collection with these chunks and return the chunk count."""
    # Every chunk needs exactly one embedding, otherwise the data would be mismatched.
    if not chunks or len(chunks) != len(embeddings):
        raise ValueError(
            f"Expected one embedding per chunk: got {len(chunks)} chunks "
            f"and {len(embeddings)} embeddings"
        )

    client = get_chroma_client()

    # Delete the old collection so a rerun does not create duplicate chunks.
    try:
        client.delete_collection(settings.chroma_collection_name)
    except NotFoundError:
        logger.info("No existing collection to replace")

    collection = client.create_collection(
        name=settings.chroma_collection_name,
        configuration=COLLECTION_CONFIGURATION,
        embedding_function=None,
    )

    # Save each chunk's ID, vector, text and metadata together.
    collection.add(
        ids=[
            f"{chunk.metadata['source']}_p{chunk.metadata['page']}_c{index}"
            for index, chunk in enumerate(chunks)
        ],
        embeddings=embeddings,
        documents=[chunk.page_content for chunk in chunks],
        metadatas=[chunk.metadata for chunk in chunks],
    )
    return collection.count()


def get_vector_store() -> Chroma:
    """Open the stored collection so the chatbot can search it."""
    return Chroma(
        client=get_chroma_client(),
        collection_name=settings.chroma_collection_name,
        embedding_function=get_embedding_model(),
        collection_configuration=COLLECTION_CONFIGURATION,
    )


# Runs only when this file is started directly: read, chunk, embed, then store.
if __name__ == "__main__":
    logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
    chunks = chunk_documents(load_processed_docs())
    embeddings = embed_chunks(chunks)
    stored_count = store_embeddings(chunks, embeddings)
    logger.info("Done: %d chunks stored in %s", stored_count, settings.chroma_persist_dir)
