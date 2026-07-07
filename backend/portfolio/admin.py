from django.contrib import admin
from .models import Skill, Project, Experience

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'icon')
    search_fields = ('name', 'category')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'order')
    list_filter = ('tech_stack',)
    search_fields = ('title', 'description')

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'start_date', 'end_date')
    search_fields = ('company', 'role')
