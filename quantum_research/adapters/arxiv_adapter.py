import hashlib
import logging
from datetime import datetime, timezone
from typing import List, Dict, Optional
from urllib.parse import quote_plus
import os
import re
import requests # type: ignore

import feedparser  # type: ignore
from rake_nltk import Rake  # type: ignore

logger = logging.getLogger(__name__)

ARXIV_BASE = os.getenv("ARXIV_BASE", "http://export.arxiv.org/api/query")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

IMAGE_QUERY_CACHE = {}

# Lazily initialize RAKE to avoid NLTK data errors at import time
_rake_instance = None

def _get_rake():
    """Get or create the RAKE instance (lazy initialization)."""
    global _rake_instance
    if _rake_instance is None:
        _rake_instance = Rake()
    return _rake_instance

# -----------------------------
# arXiv Subject Mapping
# -----------------------------
ARXIV_CATEGORY_MAP = {
    "quantum computing": [
        "quant-ph",
        "cs.ET",
        "cs.CR",
        "cs.IT",
    ],
    "quantum materials": [
        "cond-mat.mtrl-sci",
        "cond-mat.str-el",
        "cond-mat.supr-con",
        "cond-mat.quant-gas",
    ],
    "quantum sensing": [
        "quant-ph",
        "physics.optics",
        "physics.atom-ph",
        "physics.ins-det",
    ],
    "quantum communication": [
        "quant-ph",
        "cs.IT",
        "cs.CR",
        "physics.optics",
    ],
}


# -----------------------------
# Helpers
# -----------------------------
def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def parse_arxiv_time(s: str) -> datetime:
    dt = datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ")
    return dt.replace(tzinfo=timezone.utc)


def build_arxiv_query(category: str) -> str:
    """
    Build arXiv category query using subject classes.
    Prevents irrelevant ML papers.
    """
    subjects = ARXIV_CATEGORY_MAP.get(category.lower(), ["quant-ph"])

    parts = [f"cat:{s}" for s in subjects]

    return " OR ".join(parts)


# -----------------------------
# Image Fetching
# -----------------------------
def fetch_research_image(query: str):

    try:
        headers = {"Authorization": PEXELS_API_KEY}

        params = {
            "query": query,
            "per_page": 1,
        }

        url = "https://api.pexels.com/v1/search"

        response = requests.get(url, headers=headers, params=params, timeout=15)

        if response.status_code != 200:
            return None

        data = response.json()

        if data.get("photos"):
            return data["photos"][0]["src"]["large"]

        return None

    except Exception as e:
        logger.exception(f"Image fetch failed: {e}")
        return None


# -----------------------------
# Keyword Extraction
# -----------------------------
def extract_meaningful_keyword(title: str, abstract: str):

    try:
        text = f"{title}. {abstract[:300]}"

        _get_rake().extract_keywords_from_text(text)

        phrases = _get_rake().get_ranked_phrases()

        if not phrases:
            return None

        for phrase in phrases:
            words = phrase.lower().split()

            if words[0] in {"display", "show", "using", "investigate", "analyze"}:
                continue

            if 2 <= len(words) <= 4:
                return phrase.lower()

        return phrases[0].lower()

    except Exception as e:
        logger.exception(f"RAKE error: {e}")
        return None


# -----------------------------
# Main Fetch Function
# -----------------------------
def fetch_arxiv_papers(
    category: str,
    published_after: Optional[datetime] = None,
    limit: int = 30,
) -> List[Dict]:

    search_query = build_arxiv_query(category)

    encoded_query = quote_plus(search_query)

    url = (
        f"{ARXIV_BASE}"
        f"?search_query={encoded_query}"
        f"&start=0"
        f"&max_results={limit}"
        f"&sortBy=submittedDate"
        f"&sortOrder=descending"
    )

    logger.info(f"[arXiv] Fetching: {url}")

    feed = feedparser.parse(url)

    papers = []

    for entry in feed.entries:

        try:
            published_at = parse_arxiv_time(entry.published)

            if published_after and published_at <= published_after:
                continue

            paper_url = entry.link
            title = (entry.title or "").strip().replace("\n", " ")
            abstract = (entry.summary or "").strip().replace("\n", " ")

            arxiv_id = entry.id.split("/")[-1] if entry.id else None

            # Keyword extraction
            keyword = extract_meaningful_keyword(title, abstract)

            if keyword:
                image_query = f"{keyword} scientific physics laboratory equipment"
            else:
                image_query = f"{category} quantum physics experiment"

            # Cache image queries
            if image_query in IMAGE_QUERY_CACHE:
                image_url = IMAGE_QUERY_CACHE[image_query]
            else:
                image_url = fetch_research_image(image_query)

                if image_url:
                    IMAGE_QUERY_CACHE[image_query] = image_url

            if not image_url:
                image_url = None

            papers.append(
                {
                    "title": title,
                    "url": paper_url,
                    "url_hash": sha256_hex(paper_url.strip().lower()),
                    "urlToImage": image_url,
                    "description": abstract[:300],
                    "content": abstract,
                    "summary": None,
                    "published_at": published_at,
                    "source": "arXiv",
                    "provider": "arxiv",
                    "country": "Global",
                    "meta": {
                        "authors": [a.name for a in getattr(entry, "authors", [])],
                        "arxiv_id": arxiv_id,
                        "tags": [
                            t.term for t in getattr(entry, "tags", [])
                        ] if hasattr(entry, "tags") else [],
                    },
                }
            )

        except Exception as e:
            logger.exception(f"[arXiv] Failed to parse entry: {e}")
            continue

    return papers



import requests # type: ignore
import os

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")


def fetch_research_image(query: str):
    try:
        headers = {
            "Authorization": PEXELS_API_KEY
        }

        url = "https://api.pexels.com/v1/search"

        params = {
            "query": query,
            "per_page": 1
        }

        response = requests.get(url, headers=headers, params=params, timeout=15)

        if response.status_code != 200:
            return None

        data = response.json()

        if data["photos"]:
            return data["photos"][0]["src"]["large"]
        logger.info(f"Calling Pexels API with query: {query}")

        return None

    except Exception as e:
        logger.exception(f"Image fetch failed: {e}")
        return None
    
import re

def extract_meaningful_keyword(title: str, abstract: str):
    try:
        text = f"{title}. {abstract[:300]}"
        _get_rake().extract_keywords_from_text(text)
        phrases = _get_rake().get_ranked_phrases()

        if not phrases:
            return None

        for phrase in phrases:
            words = phrase.lower().split()

            # Skip phrases starting with verbs like display, show, use
            if words[0] in {"display", "show", "using", "investigate", "analyze"}:
                continue

            # Prefer phrases between 2 and 4 words
            if 2 <= len(words) <= 4:
                return phrase.lower()

        # Fallback: return first phrase
        return phrases[0].lower()

    except Exception as e:
        print("RAKE ERROR:", e)
        return None