from django.views.decorators.cache import never_cache
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.paginator import Paginator
from mongoengine.errors import DoesNotExist # type: ignore
import hashlib
import logging

from quantum_research.mongo_models import ResearchArticle

logger = logging.getLogger(__name__)

PAGE_SIZE = 18

QUANTUM_CATEGORIES = {
    "Quantum Computing": "quantum computing",
    "Quantum Sensing": "quantum sensing",
    "Quantum Materials": "quantum materials",
    "Quantum Communication": "quantum communication",
}


# Database Query Helper

def get_news(category, country):
    category_query = QUANTUM_CATEGORIES.get(category, "quantum computing")

    query = ResearchArticle.objects(category=category_query)

    if country:
        query = query.filter(country=country)

    return query.order_by("-published_at")


@never_cache
@login_required
def quantum_news(request):

    category = request.GET.get("category", "Quantum Computing")
    country = request.GET.get("country", "")
    # NEW FILTERS
    content_type_filter = request.GET.get("type", "all")       # news / research
    provider_filter = request.GET.get("provider", "all")       # newsapi / arxiv
    page = request.GET.get("page", 1)
    category_keyword = QUANTUM_CATEGORIES.get(category, "quantum computing")

    
    # CACHE KEY (include new filters)
    
    CACHE_TTL = 60 * 10

    raw_key = f"{category}|{country}|{content_type_filter}|{provider_filter}|{page}".lower()
    cache_key = "news:" + hashlib.md5(raw_key.encode()).hexdigest()

    cached_response = cache.get(cache_key)
    if cached_response:
        return cached_response

    # Trigger background ingestion safely

    try:
        from quantum_research.tasks import ingest_news

        article_count = ResearchArticle.objects(
            category=category_keyword
        ).count()

        if article_count < 5:
            logger.info(f"[VIEW] Triggering ingestion for {category_keyword}")
            ingest_news.delay(category_keyword, "newsapi")
            ingest_news.delay(category_keyword, "arxiv")

    except Exception:
        logger.exception("[VIEW] Failed to trigger ingestion")

    # Base Query
   
    query = ResearchArticle.objects(category=category_keyword)

    if country:
        query = query.filter(country=country)

   
    # NEW: Provider Filter
    if provider_filter != "all":
        query = query.filter(provider=provider_filter.lower())

  
    # NEW: Content Type Filter
   
    if content_type_filter != "all":
        query = query.filter(content_type=content_type_filter.lower())
   
    filter_message = None

    # Provider-based quick filters (clean future logic)
    if content_type_filter == "news":
        query = query.filter(provider__ne="arxiv")

    elif content_type_filter == "research":
        query = query.filter(provider="arxiv")
        filter_message = (
            "These are research papers sourced from arXiv. "
            "They contain technical abstracts and academic content."
        )

     # ordered query
    articles = query.order_by("-published_at")
   
    # Pagination
   
    paginator = Paginator(articles, PAGE_SIZE)
    page_obj = paginator.get_page(page)

    # Query for persist through the page
    query_params = request.GET.copy()
    if "page" in query_params:
        query_params.pop("page")

    encoded_filters = query_params.urlencode()   




    response = render(request, "quantum_news.html", {
        "news_articles": page_obj,
        "page_obj": page_obj,
        "categories": QUANTUM_CATEGORIES.keys(),
        "selected_category": category,
        "selected_country": country,
        "selected_type": content_type_filter,
        "selected_provider": provider_filter,
        "filter_message": filter_message,
        "encoded_filters" : encoded_filters, #
    })

    cache.set(cache_key, response, CACHE_TTL)
    return response

# Article Detail View

def article_detail(request, id):
    try:
        article = ResearchArticle.objects.get(id=id)
    except DoesNotExist:
        return render(request, "404.html", status=404)

    return render(request, "article_detail.html", {
        "article": {
            "title": article.title,
            "category": article.category,
            "published": article.published_at,
            "image_url": article.urlToImage,
            "summary": article.summary,
            "content": article.content,
            "source": article.source,
            "url": article.url,
        }
    })

