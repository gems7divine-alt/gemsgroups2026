

import json
import logging
import re
from collections import Counter
from pathlib import Path

import pdfplumber
from langchain_core.documents import Document
from pdfplumber.page import Page

from config.settings_config import settings

logger = logging.getLogger(__name__)

# Word draws table cells as shaded rectangles inset from the borders. Without this
# tolerance, pdfplumber reads the gaps as extra columns and splits rows apart.
TABLE_SETTINGS = {"snap_tolerance": 6, "join_tolerance": 6}
# Matches footer lines such as "Page 1 of 4" so they can be removed.
PAGE_FOOTER = re.compile(r"^Page \d+ of \d+$", re.IGNORECASE)


def table_to_markdown(rows: list[list[str | None]]) -> str:
    """Convert a table from the PDF into Markdown text."""
    # Clean each cell: remove extra spaces and line breaks.
    cleaned = [
        [" ".join((cell or "").split()).replace("|", "\\|") for cell in row]
        for row in rows
    ]
    # Remove rows that are completely empty.
    cleaned = [row for row in cleaned if any(row)]
    if not cleaned:
        return ""

    # Remove columns that are completely empty.
    filled_columns = [i for i in range(len(cleaned[0])) if any(row[i] for row in cleaned)]
    cleaned = [[row[i] for i in filled_columns] for row in cleaned]

    # Build the Markdown table: header row, separator row, then data rows.
    separator = ["---"] * len(filled_columns)
    return "\n".join(
        f"| {' | '.join(row)} |" for row in [cleaned[0], separator, *cleaned[1:]]
    )


def extract_page_lines(page: Page) -> list[str]:
    """Get the text lines and tables of one page, in reading order."""
    # Find the tables on the page and where each one is located.
    tables = page.find_tables(TABLE_SETTINGS)
    table_boxes = [table.bbox for table in tables]

    def is_outside_tables(obj: dict) -> bool:
        """Check that an item on the page is not inside a table."""
        # Only letters are checked; lines and shapes are always kept.
        if obj["object_type"] != "char":
            return True
        # Use the centre point of the letter to find where it sits.
        x = (obj["x0"] + obj["x1"]) / 2
        y = (obj["top"] + obj["bottom"]) / 2
        return not any(
            x0 <= x <= x1 and top <= y <= bottom
            for x0, top, x1, bottom in table_boxes
        )

    # Read the normal text outside the tables and skip the page footer.
    # Each block stores its position on the page along with its text.
    blocks = [
        (line["top"], line["text"])
        for line in page.filter(is_outside_tables).extract_text_lines()
        if not PAGE_FOOTER.match(line["text"].strip())
    ]
    # Add each table as one Markdown block.
    for table in tables:
        markdown = table_to_markdown(table.extract())
        if markdown:
            blocks.append((table.bbox[1], markdown))

    # Sort the blocks from the top of the page to the bottom and return the text.
    return [text for _, text in sorted(blocks, key=lambda block: block[0])]


def remove_repeated_headers(pages: list[list[str]]) -> list[list[str]]:
    """Remove a header line that repeats at the top of most pages."""
    # With fewer than 3 pages, a repeated header cannot be detected reliably.
    if len(pages) < 3:
        return pages

    # Count how many times each first line appears across the pages.
    first_lines = Counter(lines[0] for lines in pages if lines)
    if not first_lines:
        return pages

    # Keep the pages unchanged if no first line appears on more than half of them.
    header, count = first_lines.most_common(1)[0]
    if count <= len(pages) / 2:
        return pages
    # Remove the header line from every page that starts with it.
    return [lines[1:] if lines and lines[0] == header else lines for lines in pages]


def load_pdf(pdf_path: Path) -> list[Document]:
    """Load one PDF and create one Document for each page that has text."""
    # Open the PDF, read every page, and remove the repeated header.
    with pdfplumber.open(pdf_path) as pdf:
        pages = remove_repeated_headers([extract_page_lines(page) for page in pdf.pages])

    documents = []
    for number, lines in enumerate(pages, start=1):
        # Skip pages with no text, such as blank or scanned pages.
        if not lines:
            logger.warning("Skipping %s page %d: no extractable text", pdf_path.name, number)
            continue
        # Create a Document with the page text, file name and page number.
        documents.append(
            Document(
                page_content="\n".join(lines),
                metadata={"source": pdf_path.name, "page": number},
            )
        )
    return documents


def load_raw_docs(source_dir: Path = settings.pdf_source_dir) -> list[Document]:
    """Load all PDFs from the raw folder into one list of Documents."""
    # Find all PDF files, and stop with an error if there are none.
    pdf_paths = sorted(source_dir.glob("*.pdf"))
    if not pdf_paths:
        raise FileNotFoundError(f"No PDF files found in {source_dir}")

    # Load each PDF and add its pages to one combined list.
    raw_docs = []
    for pdf_path in pdf_paths:
        documents = load_pdf(pdf_path)
        logger.info("Loaded %s: %d pages", pdf_path.name, len(documents))
        raw_docs.extend(documents)
    return raw_docs


def save_docs(
    raw_docs: list[Document],
    output_dir: Path = settings.processed_data_dir,
) -> list[Path]:
    """Save the Documents as JSON files in the processed data folder."""
    # Create the output folder if it does not exist.
    output_dir.mkdir(parents=True, exist_ok=True)

    # Group the pages by the PDF they came from.
    docs_by_source: dict[str, list[dict]] = {}
    for doc in raw_docs:
        docs_by_source.setdefault(doc.metadata["source"], []).append(
            {"page_content": doc.page_content, "metadata": doc.metadata}
        )

    # Write one JSON file for each PDF.
    output_paths = []
    for source, records in docs_by_source.items():
        output_path = output_dir / f"{Path(source).stem}.json"
        output_path.write_text(
            json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        logger.info("Saved %s", output_path)
        output_paths.append(output_path)
    return output_paths


# Runs only when this file is started directly: load the PDFs, then save them.
if __name__ == "__main__":
    logging.basicConfig(level=settings.log_level, format="%(levelname)s: %(message)s")
    raw_docs = load_raw_docs()
    save_docs(raw_docs)
    logger.info("Done: %d Documents saved", len(raw_docs))
