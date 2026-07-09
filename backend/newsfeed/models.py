from django.db import models

class AINewsItem(models.Model):
    title = models.CharField(max_length=300)
    source_name = models.CharField(max_length=100)
    link = models.URLField(max_length=500, unique=True)
    published_at = models.DateTimeField()
    summary = models.TextField()
    image_url = models.URLField(max_length=1000, blank=True, null=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return f"[{self.source_name}] {self.title}"
