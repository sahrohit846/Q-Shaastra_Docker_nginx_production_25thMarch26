import logging
from newspaper import Article # type: ignore


logger = logging.getLogger(__name__)


def fetch_full_content(article_url: str) -> str:
    """
    Extract full article text using newspaper3k.
    Returns empty string if extraction fails.
    """
    try:
        article = Article(article_url, language="en", request_timeout=10)
        article.download()
        article.parse()

        text = article.text.strip()

        if len(text) < 100:
            logger.warning(f"[CONTENT] Extracted text too short: {article_url}")
            return ""

        logger.info(f"[CONTENT] Extracted {len(text)} chars")
        return text

    except Exception as e:
        logger.warning(f"[CONTENT] Extraction failed: {article_url} | {e}")
        return ""
