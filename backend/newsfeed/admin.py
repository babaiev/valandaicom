from django.contrib import admin
from .models import AINewsItem

@admin.register(AINewsItem)
class AINewsItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'source_name', 'published_at')
    list_filter = ('source_name',)
    search_fields = ('title', 'summary', 'source_name')
