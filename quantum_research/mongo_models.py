import hashlib
from datetime import datetime, timezone

from mongoengine import ( # type: ignore
    Document,
    StringField,
    DateTimeField,
    DictField,
    BooleanField,
    URLField,
    signals,
)


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


class ResearchArticle(Document):
    """
    MongoDB-native model for quantum research content.
    Used for news articles, AI summaries, and future datasets.
    """

    # Core identity
    title = StringField(required=True, max_length=512)

    url = URLField(required=True, unique=True)
    url_hash = StringField(required=True, unique=True)

    urlToImage = URLField(null=True)
    # Content
    description = StringField(default="")
    content = StringField(null=True)
    summary = StringField(null=True)

    # Classification
    provider = StringField(required=True)  # newsapi / arxiv / ieee / blog
    content_type = StringField(required=True)  # news / research / blog
   
    # Domain metadata
    category = StringField(default="quantum computing")
    country = StringField(default="Global")
    source = StringField(default="NewsAPI")
    

    # Research enrichment (AI future use)
    classification = DictField(default=dict)
    reliability = DictField(default=dict)
    meta_info = DictField(default=dict)

   
    # Lifecycle
    published_at = DateTimeField(required=True)
    is_active = BooleanField(default=True)

    created_at = DateTimeField()
    updated_at = DateTimeField()

    
    # MongoDB config
    meta = {
        "collection": "quantum_research_articles",
        "indexes": [
            "url_hash",
            "category",
            "provider",
            "-published_at",
        ],
        "ordering": ["-published_at"],
        "strict": True,
    }

    def __str__(self):
        return self.title

    
    # Normalization & timestamps
    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        if document.url:
            normalized_url = document.url.strip().lower()
            document.url = normalized_url
            document.url_hash = sha256_hex(normalized_url)

        if document.category:
            document.category = document.category.strip().lower()

        if document.provider:
            document.provider = document.provider.strip().lower()

        if document.content_type:
            document.content_type = document.content_type.strip().lower()


        now = datetime.utcnow()
        if not document.created_at:
            document.created_at = now
        document.updated_at = now


signals.pre_save.connect(ResearchArticle.pre_save, sender=ResearchArticle)





class IngestionCursor(Document):
    """
    Tracks ingestion progress per provider + category.
    """

    provider = StringField(required=True)
    category = StringField(required=True)  

    last_published_at = DateTimeField(null=True)
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        "collection": "quantum_research_ingestion_cursor",
        "indexes": [
            {"fields": ["provider", "category"], "unique": True}
        ],
        "strict": True,
    }
