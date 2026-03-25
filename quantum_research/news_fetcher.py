
import os
import requests # type: ignore
from datetime import datetime
from quantum_research.adapters.arxiv_adapter import fetch_arxiv_papers


NEWS_API_URL = os.getenv("NEWS_API_URL")


def fetch_news_from_api(category: str, published_after=None):

    api_key = os.getenv("NEWS_API_KEY") or os.getenv("QUANTUM_NEWS_API_KEY")
    if not api_key:
        raise RuntimeError("NEWS_API_KEY not found in .env")

    params = {
        "q": category,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 10,
        "apiKey": api_key,
    }

    if published_after:
        params["from"] = published_after.isoformat()

    response = requests.get(NEWS_API_URL, params=params, timeout=15)
    response.raise_for_status()

    payload = response.json()

    if payload.get("status") != "ok":
        raise RuntimeError(f"NewsAPI error: {payload}")

    results = []

    for a in payload.get("articles", []):

        url = a.get("url")
        published_str = a.get("publishedAt")

        if not url or not published_str:
            continue

        try:
            published_at = datetime.fromisoformat(
                published_str.replace("Z", "+00:00")
            )
        except Exception:
            continue

        results.append({
            "title": (a.get("title") or "").strip(),
            "url": url.strip(),
            "urlToImage": a.get("urlToImage"),
            "description": a.get("description") or "",
            "content": a.get("content"),
            "published_at": published_at,
            "source": a.get("source", {}).get("name", "NewsAPI"),
            "country": "Global",
        })

    return results


# Dispatcher
def fetch_articles(category: str, provider: str, published_after=None):

    provider = provider.lower()

    if provider == "newsapi":
        return fetch_news_from_api(category, published_after)

    elif provider == "arxiv":
        return fetch_arxiv_papers(category, published_after)

    else:
        raise ValueError(f"Unsupported provider: {provider}")

