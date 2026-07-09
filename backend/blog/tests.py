from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post

class BlogModelTests(TestCase):
    def test_post_str(self):
        post = Post.objects.create(title="My First Post", slug="first", content="Hello")
        self.assertEqual(str(post), "My First Post")

class BlogAPITests(TestCase):
    def setUp(self):
        Post.objects.all().delete()
        self.client = APIClient()
        self.published_post = Post.objects.create(
            title="Published", slug="published", content="Content", is_published=True
        )
        self.draft_post = Post.objects.create(
            title="Draft", slug="draft", content="Draft Content", is_published=False
        )

    def test_get_posts_only_published(self):
        response = self.client.get('/api/blog/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Published")

    def test_get_post_detail(self):
        response = self.client.get('/api/blog/posts/published/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Published")

    def test_get_draft_post_detail_fails(self):
        response = self.client.get('/api/blog/posts/draft/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
