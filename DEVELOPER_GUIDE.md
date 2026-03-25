# Q-Shaastra Developer Guide

## 👨‍💻 Development Setup

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd Q-Shaastra_Docker_Production_19thMarch26

# 2. Create virtual environment
python3.11 -m venv myenv
source myenv/bin/activate  # Linux/Mac or myenv\Scripts\activate (Windows)

# 3. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env  # If exists, otherwise review existing .env
```

### Run with Docker
```bash
docker compose build
docker compose up -d
docker compose logs -f web
```

---

## 📁 Project Structure

```
Q-Shaastra/
├── simulator/                 # Django Project Settings
│   ├── settings.py           # Django configuration
│   ├── urls.py               # Main URL routing
│   ├── wsgi.py               # WSGI application
│   ├── asgi.py               # ASGI application
│   ├── celery.py             # Celery configuration
│   └── templatetags/         # Custom Django template tags
│
├── home/                      # User Management App
│   ├── models.py             # User models
│   ├── views.py              # View logic
│   ├── urls.py               # App-specific URLs
│   ├── forms.py              # Django forms
│   ├── admin.py              # Django admin configuration
│   ├── tests.py              # Unit tests
│   ├── middleware.py         # Custom middleware
│   └── migrations/           # Database migrations
│
├── quantum_research/         # Research Module
│   ├── models.py             # Research data models
│   ├── mongo_models.py       # MongoDB models
│   ├── news_fetcher.py       # ArXiv news integration
│   ├── tasks.py              # Celery background tasks
│   ├── views.py              # API views
│   ├── utils/                # Utility functions
│   ├── adapters/             # External service adapters
│   └── migrations/           # Database migrations
│
├── config/                    # Configuration
│   └── mongo.py              # MongoDB connection config
│
├── static/                    # Static Assets (Development)
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   │   ├── Simulator.js      # Quantum simulator UI
│   │   ├── circuitSimulator.js
│   │   ├── codeGenerator.js
│   │   ├── matrix.js
│   │   └── ...
│   └── images/               # Images
│
├── templates/                # HTML Templates
│   ├── base.html            # Base template
│   ├── simulator.html       # Simulator page
│   ├── dashboard.html       # User dashboard
│   ├── quantum_news.html    # News page
│   ├── profile.html         # User profile
│   └── ...
│
├── manage.py                 # Django management script
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image definition
├── requirements.txt          # Python dependencies
└── .env                      # Environment variables

```

---

## 🗄️ Database Models

### Django Models (home/models.py)
```python
# User-related models
- User (extended Django User)
- UserProfile
- Dashboard
```

### MongoDB Models (quantum_research/mongo_models.py)
```python
# Research-related documents
- ArXivPaper
- QuantumNews
- ResearchData
```

---

## 🚀 Key Features Development

### 1. Adding New Django App

```bash
# Create app
docker compose exec web python manage.py startapp new_app

# Add to INSTALLED_APPS in settings.py
INSTALLED_APPS = [
    ...
    'new_app',
]

# Create models, views, urls
# Make migrations
docker compose exec web python manage.py makemigrations new_app
docker compose exec web python manage.py migrate
```

### 2. Creating Database Models

**SQLite/PostgreSQL Models** (home/models.py):
```python
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    quantum_level = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
```

**MongoDB Models** (quantum_research/mongo_models.py):
```python
from mongoengine import Document, StringField, DateTimeField

class ArXivPaper(Document):
    title = StringField(required=True)
    abstract = StringField()
    arxiv_id = StringField(unique=True)
    published_date = DateTimeField()
    
    meta = {'collection': 'arxiv_papers'}
```

### 3. Creating Views

**Class-Based Views** (quantum_research/views.py):
```python
from django.views import View
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

class SimulatorView(View):
    def get(self, request):
        # Logic for GET request
        return JsonResponse({'status': 'success'})
    
    def post(self, request):
        # Logic for POST request
        return JsonResponse({'status': 'created'})
```

**Function-Based Views**:
```python
from django.shortcuts import render
from django.http import HttpResponse

def quantum_news(request):
    news = get_quantum_news()
    return render(request, 'quantum_news.html', {'news': news})
```

### 4. Creating API Endpoints

**URL Configuration** (quantum_research/urls.py):
```python
from django.urls import path
from . import views

urlpatterns = [
    path('api/news/', views.NewsListView.as_view(), name='news-list'),
    path('api/simulator/', views.SimulatorView.as_view(), name='simulator'),
    path('api/arxiv/<str:arxiv_id>/', views.ArXivDetailView.as_view(), name='arxiv-detail'),
]
```

### 5. Background Tasks with Celery

**Define Task** (quantum_research/tasks.py):
```python
from celery import shared_task
from .news_fetcher import fetch_arxiv_papers

@shared_task
def update_arxiv_papers():
    """Fetch latest ArXiv papers every hour"""
    fetch_arxiv_papers()
    return "ArXiv papers updated"

@shared_task
def send_email_notification(email, subject):
    """Send notification email"""
    # Email logic here
    return f"Email sent to {email}"
```

**Schedule Task** (simulator/celery.py):
```python
app.conf.beat_schedule = {
    'update-arxiv-every-hour': {
        'task': 'quantum_research.tasks.update_arxiv_papers',
        'schedule': crontab(minute=0),  # Every hour
    },
}
```

**Run Task**:
```python
# In views or other code
from quantum_research.tasks import update_arxiv_papers

# Execute immediately
update_arxiv_papers.delay()

# Schedule for later
update_arxiv_papers.apply_async(countdown=3600)  # 1 hour from now
```

### 6. External API Integration

**News Fetcher** (quantum_research/news_fetcher.py):
```python
import requests
from django.conf import settings

def fetch_quantum_news():
    api_key = settings.QUANTUM_NEWS_API_KEY
    url = f"https://newsapi.org/v2/everything"
    
    params = {
        'q': 'quantum computing',
        'apiKey': api_key,
        'sortBy': 'publishedAt',
    }
    
    response = requests.get(url, params=params)
    return response.json()

def fetch_arxiv_papers():
    url = "http://export.arxiv.org/api/query"
    params = {
        'search_query': 'cat:quant-ph',
        'max_results': 50,
    }
    
    response = requests.get(url, params=params)
    # Parse and save to MongoDB
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
docker compose exec web python manage.py test

# Run specific app tests
docker compose exec web python manage.py test home

# Run specific test class
docker compose exec web python manage.py test home.tests.UserTestCase

# Run with verbosity
docker compose exec web python manage.py test --verbosity=2

# Run with coverage
docker compose exec web coverage run --source='.' manage.py test
docker compose exec web coverage report
```

### Sample Test File (home/tests.py)
```python
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@test.com', 'password')
        self.profile = UserProfile.objects.create(user=self.user, quantum_level='beginner')
    
    def test_profile_creation(self):
        self.assertEqual(self.profile.quantum_level, 'beginner')
    
    def test_profile_string_representation(self):
        self.assertEqual(str(self.profile), "testuser's Profile")
```

---

## 📝 Code Conventions

### Django Best Practices

1. **Models**
   ```python
   class Article(models.Model):
       title = models.CharField(max_length=200)
       content = models.TextField()
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       class Meta:
           ordering = ['-created_at']
           verbose_name_plural = "Articles"
       
       def __str__(self):
           return self.title
   ```

2. **Views** - Use class-based views when possible
   ```python
   from django.views.generic import ListView, DetailView
   
   class ArticleListView(ListView):
       model = Article
       template_name = 'article_list.html'
       context_object_name = 'articles'
       paginate_by = 10
   ```

3. **URLs** - Use descriptive names
   ```python
   urlpatterns = [
       path('articles/', ArticleListView.as_view(), name='article-list'),
       path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
   ]
   ```

4. **Templates** - Use template inheritance
   ```html
   {% extends "base.html" %}
   
   {% block title %}Article List{% endblock %}
   
   {% block content %}
       <div class="articles">
           {% for article in articles %}
               <article>
                   <h2>{{ article.title }}</h2>
                   <p>{{ article.content }}</p>
               </article>
           {% endfor %}
       </div>
   {% endblock %}
   ```

### Python Style Guide (PEP 8)

```python
# Use 4 spaces for indentation
# Max line length: 79 characters

# Good variable names
user_email = "user@example.com"
posts_per_page = 10

# Use descriptive function names
def get_user_quantum_level(user):
    return user.profile.quantum_level

# Add docstrings
def fetch_papers(query, limit=50):
    """
    Fetch academic papers from ArXiv.
    
    Args:
        query (str): Search query
        limit (int): Max results to return
    
    Returns:
        list: List of paper dictionaries
    """
    pass
```

---

## 🔧 Common Development Tasks

### Add New Field to Model

```bash
# 1. Edit model (home/models.py)
# Add new field

# 2. Create migration
docker compose exec web python manage.py makemigrations

# 3. Apply migration
docker compose exec web python manage.py migrate

# 4. Verify changes
docker compose exec web python manage.py shell
>>> from home.models import UserProfile
>>> UserProfile._meta.fields
```

### Create Django Admin Interface

```python
# home/admin.py
from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'quantum_level', 'created_at')
    list_filter = ('quantum_level',)
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at',)
```

### Add Static Files

```bash
# 1. Place files in static/ directory
# static/css/custom.css
# static/js/custom.js

# 2. Reference in template
{% load static %}
<link rel="stylesheet" href="{% static 'css/custom.css' %}">
<script src="{% static 'js/custom.js' %}"></script>

# 3. Collect static files
docker compose exec web python manage.py collectstatic --noinput
```

### Debug Mode

```python
# In settings.py (development only)
DEBUG = True

# Then in views:
from django.shortcuts import render

def my_view(request):
    context = {'data': some_data}
    # Use Django Debug Toolbar to inspect
    return render(request, 'template.html', context)
```

### Access Django Shell

```bash
docker compose exec web python manage.py shell

# Then in shell:
>>> from home.models import UserProfile
>>> UserProfile.objects.all()
>>> user = UserProfile.objects.get(pk=1)
>>> user.quantum_level = 'advanced'
>>> user.save()
>>> exit()
```

---

## 🐛 Debugging

### Print Debugging

```python
# In views or models
import logging

logger = logging.getLogger(__name__)

def my_view(request):
    logger.info(f"Request received: {request.user}")
    logger.error(f"Error occurred: {error_message}")
    return render(request, 'template.html')
```

### Check Logs

```bash
# Web service logs
docker compose logs web -f

# Celery worker logs
docker compose logs celery_worker -f

# Get last 100 lines
docker compose logs --tail=100 web
```

### Database Inspection

```bash
# Access Django shell
docker compose exec web python manage.py shell

# Query database
>>> from home.models import User
>>> User.objects.count()
>>> User.objects.filter(username='admin').first()
```

### MongoDB Inspection

```bash
# Access mongo shell
docker compose exec mongo mongosh

# List databases
> show dbs

# Use database
> use quantum_shaastra_prod

# List collections
> show collections

# Query collection
> db.arxiv_papers.find().limit(5)
```

---

## 📚 Documentation

### Docstring Format

```python
def calculate_quantum_state(qubits, gates):
    """
    Calculate the quantum state after applying gates.
    
    Args:
        qubits (int): Number of qubits
        gates (list): List of quantum gates to apply
    
    Returns:
        ndarray: Quantum state vector
    
    Raises:
        ValueError: If number of qubits is invalid
    
    Example:
        >>> state = calculate_quantum_state(3, ['H', 'CNOT'])
        >>> print(state.shape)
        (8, 1)
    """
    pass
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Import errors | Ensure app in INSTALLED_APPS and `__init__.py` exists |
| Migration conflicts | Delete migration file and recreate: `makemigrations --name migration_name` |
| Static files not loading | Run `collectstatic --noinput --clear` |
| Celery tasks not running | Check Redis connection: `docker compose logs redis` |
| Model changes not applied | Run `makemigrations` then `migrate` |
| Template not found | Check `TEMPLATES` setting and template directory path |

---

## 🔗 Useful Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Python PEP 8](https://www.python.org/dev/peps/pep-0008/)
- [Git Documentation](https://git-scm.com/doc)

---

## 📞 Development Support

For development questions or issues:
1. Check existing code for similar implementations
2. Review Django and framework documentation
3. Check application logs: `docker compose logs`
4. Use Django shell for testing: `python manage.py shell`

---

**Last Updated**: March 19, 2026
**Version**: 1.0
**Maintained By**: Q-Shaastra Development Team

