import logging
from datetime import datetime, timezone
import hashlib
from celery import shared_task # type: ignore
from django.core.cache import cache
from mongoengine.errors import NotUniqueError # type: ignore

from quantum_research.mongo_models import ResearchArticle, IngestionCursor
from quantum_research.news_fetcher import fetch_articles


from quantum_research.utils.summerizer import generate_summary
from quantum_research.utils.content_extractor import fetch_full_content
import re


logger = logging.getLogger(__name__)

def clean_arxiv_text(text):
    """
    Remove LaTeX expressions from arXiv abstracts before summarization.
    """
    text = re.sub(r'\$.*?\$', '', text)          # remove $math$
    text = re.sub(r'\\[a-zA-Z]+', '', text)      # remove \alpha \beta etc
    text = re.sub(r'\s+', ' ', text)             # normalize whitespace
    return text.strip()

def ensure_aware_utc(dt):
    """
    Always return a timezone-aware UTC datetime.
    Fixes 'offset-naive and offset-aware' comparison errors.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=60,
    retry_kwargs={"max_retries": 3},
)
def ingest_news(self, category: str, provider: str = "newsapi"):

    category_norm = (category or "").strip().lower()
    provider_norm = (provider or "newsapi").strip().lower()

    if not category_norm:
        return "Invalid category"

    # LOCKING (avoid parallel ingestion same category)
   
    raw_lock = f"{provider_norm}|{category_norm}"
    lock_key = "lock:ingest:" + hashlib.md5(raw_lock.encode()).hexdigest()
    lock_ttl = 25 * 60

    if not cache.add(lock_key, "1", timeout=lock_ttl):
        msg = f"Skip ingestion: already running for {provider_norm}::{category_norm}"
        logger.warning(msg)
        return msg

    try:
        logger.info(f"[INGEST] Starting ingestion for {provider_norm}::{category_norm}")

        # CURSOR
        cursor = IngestionCursor.objects(
                provider=provider_norm,
                category=category_norm
            ).modify(
                upsert=True,
                new=True,
                set_on_insert__provider=provider_norm,
                set_on_insert__category=category_norm,
            )



        last_dt = ensure_aware_utc(cursor.last_published_at)
        latest_published = last_dt

        # FETCH ARTICLES
        articles = fetch_articles(
            category=category_norm,
            provider= provider_norm,
            published_after=last_dt,
        )

        if not articles:
            logger.info(f"[INGEST] No new articles for {category_norm}")
            return f"No new articles for {category_norm}"

        inserted = 0
        skipped_duplicates = 0
        errors = 0

        for idx, item in enumerate(articles, start=1):
            try:
                title = (item.get("title") or "").strip()
                url = item.get("url")
                raw_pub = item.get("published_at")

                logger.info(f"[INGEST] ({idx}/{len(articles)}) {title[:80]}")

                if not url or not raw_pub:
                    logger.warning("[INGEST] Skipping: missing url or published_at")
                    continue

                pub_dt = ensure_aware_utc(raw_pub)


                # ----------- CONTENT EXTRACTION -----------

                if provider_norm == "arxiv":
                    # arXiv already provides abstract via API
                    full_content = item.get("content") or item.get("description") or ""
                    logger.info("[CONTENT] Using arXiv abstract from API")

                else:
                    # Only scrape real news websites
                    full_content = fetch_full_content(url)

                    if full_content:
                        logger.info(f"[CONTENT] Extracted {len(full_content)} chars")
                    else:
                        full_content = item.get("content") or item.get("description") or ""
                        logger.warning("[CONTENT] Extraction failed, using API snippet")

         # BACKGROUND SUMMARY GENERATION

                summary = None
                if full_content and len(full_content) > 50:

                    # Clean LaTeX from arXiv abstracts
                    if provider_norm == "arxiv":
                        full_content = clean_arxiv_text(full_content)

                    summary = generate_summary(full_content)
                    logger.info("[INGEST] Summary generated")

                else:
                    logger.warning("[INGEST] Content too short for summary")
                    summary = "[Summary unavailable: insufficient content]"

                # DETERMINE CONTENT TYPE (SCALABLE APPROACH)
               
                if provider_norm == "arxiv":
                    content_type = "research"
                else:
                    content_type = "news"        
               
                # SAVE TO MONGODB       
                        
                logger.info("[INGEST] Creating MongoDB document...")

                doc = ResearchArticle(
                    title=title,
                    url=url,
                    urlToImage=item.get("urlToImage"),
                    description=item.get("description") or "",
                    content=full_content,
                    summary=summary,
                    category=category_norm,
                    country=item.get("country", "Global"),
                    published_at=pub_dt,
                    source=item.get("source", "NewsAPI"),
                    provider=provider_norm,
                    content_type=content_type, 
                )

                doc.save()
                logger.info(f"[DB] Saved article: {doc.title}")

                inserted += 1
                logger.info("[INGEST] Inserted successfully ")

                # update latest timestamp
                if latest_published is None or pub_dt > latest_published:
                    latest_published = pub_dt

                logger.info("[INGEST] Inserted successfully")

            except NotUniqueError:
                skipped_duplicates += 1
                logger.info("[INGEST] Duplicate skipped")
                continue

            except Exception as e:
                errors += 1
                logger.exception(f"[INGEST] Error saving article: {e}")
                continue
            logger.info(f"[RESULT] inserted={inserted}, duplicates={skipped_duplicates}, errors={errors}")

            # UPDATE CURSOR

        if latest_published and (last_dt is None or latest_published > last_dt):
            cursor.last_published_at = latest_published
            cursor.updated_at = datetime.now(timezone.utc)
            cursor.save()

        msg = (
            f"Ingestion done: inserted={inserted}, "
            f"duplicates={skipped_duplicates}, errors={errors}, "
            f"provider={provider_norm}, category={category_norm}"
        )

        logger.info(f"[INGEST] {msg}")
        return msg

    finally:
        cache.delete(lock_key)
