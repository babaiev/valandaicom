from django.contrib import admin
from .models import FeedItem

@admin.register(FeedItem)
class FeedItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'source', 'published_at', 'created_at')
    list_filter = ('source',)
    search_fields = ('title', 'summary', 'source')
