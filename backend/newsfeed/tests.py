from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import FeedItem
from django.utils import timezone

class NewsfeedModelTests(TestCase):
    def test_feeditem_str(self):
        item = FeedItem.objects.create(
            title="AI takes over", url="http://test.com", source="TechCrunch", published_at=timezone.now()
        )
        self.assertEqual(str(item), "[TechCrunch] AI takes over")

class NewsfeedAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item = FeedItem.objects.create(
            title="News 1", url="http://news.com", source="Twitter", published_at=timezone.now()
        )

    def test_get_feed_items(self):
        response = self.client.get('/api/newsfeed/items/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "News 1")
