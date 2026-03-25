
import os
from celery import Celery
from celery.schedules import crontab # type: ignore

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "simulator.settings")

app = Celery("simulator")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {

    # NEWSAPI (every 30 min)
    
    "newsapi-quantum-computing": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="*/30"),
        "args": ("quantum computing", "newsapi"),
    },
    "newsapi-quantum-sensing": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="*/30"),
        "args": ("quantum sensing", "newsapi"),
    },
    "newsapi-quantum-materials": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="*/30"),
        "args": ("quantum materials", "newsapi"),
    },
    "newsapi-quantum-communication": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="*/30"),
        "args": ("quantum communication", "newsapi"),
    },

    # ARXIV (every 30 min but offset by 5 minutes)
    
    
    "arxiv-quantum-computing": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="5,35"),
        "args": ("quantum computing", "arxiv"),
    },
    "arxiv-quantum-sensing": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="5,35"),
        "args": ("quantum sensing", "arxiv"),
    },
    "arxiv-quantum-materials": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="5,35"),
        "args": ("quantum materials", "arxiv"),
    },
    "arxiv-quantum-communication": {
        "task": "quantum_research.tasks.ingest_news",
        "schedule": crontab(minute="5,35"),
        "args": ("quantum communication", "arxiv"),
    },
}
