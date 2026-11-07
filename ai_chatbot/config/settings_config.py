

from pathlib import Path
from typing import Annotated, Literal

from dotenv import load_dotenv
from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

# Settings below are only available through the `settings` object. LangSmith and
# other libraries read os.environ directly, so the file is exported there as well.
load_dotenv(ENV_FILE)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "gems-groups-rag-chatbot"
    app_env: str = "development"
    debug: bool = False
    log_level: str = "INFO"

    # API server
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: Annotated[list[str], NoDecode] = []

    # API keys
    google_api_key: SecretStr
    groq_api_key: SecretStr

    # LLM
    llm_provider: Literal["google", "groq"] = "google"
    llm_fallback_provider: Literal["google", "groq"] = "groq"
    google_llm_model: str = "gemini-2.5-flash"
    groq_llm_model: str = "qwen/qwen3.8-27b"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 2048
    llm_timeout_seconds: int = 60
    llm_max_retries: int = 2

    # Embeddings
    embedding_provider: str = "google"
    embedding_model: str = "gemini-embedding-001"
    embedding_dimension: int = 768
    embedding_batch_size: int = 50

    # Vector database (Chroma)
    chroma_persist_dir: Path = Path("data/chroma_db")
    chroma_collection_name: str = "gems_groups_docs"
    chroma_distance_metric: str = "cosine"

    # Redis / RedisVL
    redis_url: str = "redis://localhost:6379/0"
    redis_password: SecretStr = SecretStr("")

    # Semantic cache
    semantic_cache_enabled: bool = True
    semantic_cache_name: str = "gems_rag_cache"
    semantic_cache_distance_threshold: float = 0.1
    semantic_cache_ttl_seconds: int = 3600

    # Chat history
    chat_history_index_name: str = "gems_chat_history"
    chat_history_ttl_seconds: int = 86400
    chat_history_max_messages: int = 10

    # Data ingestion
    pdf_source_dir: Path = Path("data/raw_pdf")
    processed_data_dir: Path = Path("data/processed_data")
    chunk_size: int = 600
    chunk_overlap: int = 200

    # Retrieval
    retriever_top_k: int = 5
    retriever_score_threshold: float = 0.3

    # LangSmith tracing
    langsmith_tracing: bool = False
    langsmith_api_key: SecretStr = SecretStr("")
    langsmith_project: str = "gems-groups-rag-chatbot"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: str | list[str]) -> list[str]:
        """Turn the comma-separated CORS_ORIGINS value into a list."""
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator(
        "chroma_persist_dir", "pdf_source_dir", "processed_data_dir", mode="after"
    )
    @classmethod
    def resolve_from_project_root(cls, value: Path) -> Path:
        """Make relative paths work no matter where the app is started from."""
        return value if value.is_absolute() else (BASE_DIR / value).resolve()


settings = Settings()
