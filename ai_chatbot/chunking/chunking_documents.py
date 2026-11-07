import json
import logging
from pathlib import Path

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config.settings_config import settings

logger = logging.getLogger(__name__)

# Split at the most natural point available: paragraph, line, sentence, then word.
SEPARATORS = ["\n\n", "\n", ". ", " ", ""]


def load_processed_docs(
    processed_dir: Path = settings.processed_data_dir,
) -> list[Document]:
    """Read all JSON files from the processed data folder into Documents."""
    # Find all JSON files, and stop with an error if there are none.
    json_paths = sorted(processed_dir.glob("*.json"))
    if not json_paths:
        raise FileNotFoundError(
            f"No JSON files found in {processed_dir}. "
            "Run python -m Data_ingestion.data_loading first."
        )

    # Turn every saved page into a Document with its text and metadata.
    documents = []
    for json_path in json_paths:
        records = json.loads(json_path.read_text(encoding="utf-8"))
        documents.extend(
            Document(page_content=record["page_content"], metadata=record["metadata"])
            for record in records
        )
        logger.info("Read %s: %d pages", json_path.name, len(records))
    return documents


def chunk_documents(
    documents: list[Document],
    chunk_size: int = settings.chunk_size,
    chunk_overlap: int = settings.chunk_overlap,
) -> list[Document]:
    """Split the Documents into smaller chunks that keep their metadata."""
    # chunk_size is the maximum characters in a chunk.
    # chunk_overlap is the text repeated between neighbouring chunks.
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=SEPARATORS,
    )
    # Each chunk automatically copies the source and page of its Document.
    return splitter.split_documents(documents)


# Runs only when this file is started directly: read the files, then chunk them.
if __name__ == "__main__":
    logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
    documents = load_processed_docs()
    chunks = chunk_documents(documents)
    logger.info("Done: %d pages split into %d chunks", len(documents), len(chunks))
