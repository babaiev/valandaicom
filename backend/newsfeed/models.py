from django.db import models

class FeedItem(models.Model):
    title = models.CharField(max_length=200)
    url = models.URLField(max_length=500)
    source = models.CharField(max_length=100, help_text="e.g., TechCrunch, Twitter")
    summary = models.TextField(blank=True, null=True)
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return f"[{self.source}] {self.title}"
