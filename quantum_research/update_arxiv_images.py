from quantum_research.mongo_models import ResearchArticle
from quantum_research.adapters.arxiv_adapter import (
    extract_meaningful_keyword,
    fetch_research_image
)

def update_existing_arxiv_images(limit=None):
    """
    Regenerate images for existing arXiv articles using RAKE keywords.
    """

    queryset = ResearchArticle.objects(provider="arxiv")

    if limit:
        queryset = queryset.limit(limit)

    updated_count = 0

    for article in queryset:
        try:
            title = article.title or ""
            content = article.content or ""

            keyword = extract_meaningful_keyword(title, content)

            if not keyword:
                continue

            image_query = f"{keyword} physics laboratory research"
            image_url = fetch_research_image(image_query)

            if not image_url:
                continue

            article.update(set__urlToImage=image_url)
            updated_count += 1

            print(f"Updated: {title[:60]} → {keyword}")

        except Exception as e:
            print("Error updating:", article.id, e)

    print(f"\nTotal Updated: {updated_count}")