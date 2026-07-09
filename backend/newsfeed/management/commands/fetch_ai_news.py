import feedparser
from datetime import datetime
from email.utils import parsedate_to_datetime
from django.core.management.base import BaseCommand
from django.utils.html import strip_tags
from django.utils import timezone
from newsfeed.models import AINewsItem

KEYWORDS = ['ai', 'artificial intelligence', 'machine learning', 'llm', 'chatgpt', 'gemini', 'openai']

FEEDS = [
    {
        'name': 'TechCrunch',
        'url': 'https://techcrunch.com/category/artificial-intelligence/feed/'
    },
    {
        'name': 'VentureBeat',
        'url': 'https://venturebeat.com/category/ai/feed/'
    },
    {
        'name': 'MarkTechPost',
        'url': 'https://www.marktechpost.com/category/artificial-intelligence/feed/'
    }
]

class Command(BaseCommand):
    help = 'Fetches AI news from specified RSS feeds'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting AI news fetch...")
        
        items_added = 0
        items_skipped = 0

        for feed_config in FEEDS:
            self.stdout.write(f"Fetching from {feed_config['name']}...")
            feed = feedparser.parse(feed_config['url'])
            
            for entry in feed.entries:
                title = entry.get('title', '')
                link = entry.get('link', '')
                summary_raw = entry.get('summary', '')
                summary = strip_tags(summary_raw).strip()
                
                # Check keywords in title or summary (case-insensitive)
                text_to_check = (title + " " + summary).lower()
                has_keyword = any(keyword in text_to_check for keyword in KEYWORDS)
                
                if not has_keyword:
                    items_skipped += 1
                    continue
                
                # Parse date
                published_at = timezone.now()
                if hasattr(entry, 'published'):
                    try:
                        published_at = parsedate_to_datetime(entry.published)
                    except Exception:
                        pass
                
                # Extract image (try media_content first, then check enclosures or summary)
                image_url = None
                if hasattr(entry, 'media_content') and len(entry.media_content) > 0:
                    image_url = entry.media_content[0].get('url')
                elif hasattr(entry, 'media_thumbnail') and len(entry.media_thumbnail) > 0:
                    image_url = entry.media_thumbnail[0].get('url')
                elif hasattr(entry, 'enclosures') and len(entry.enclosures) > 0:
                    image_url = entry.enclosures[0].get('href')

                # DB Write (update_or_create to avoid duplicates)
                obj, created = AINewsItem.objects.update_or_create(
                    link=link,
                    defaults={
                        'title': title,
                        'source_name': feed_config['name'],
                        'published_at': published_at,
                        'summary': summary,
                        'image_url': image_url
                    }
                )
                
                if created:
                    items_added += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully fetched news. Added: {items_added}. Skipped (no keywords): {items_skipped}"))
