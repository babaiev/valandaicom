from rest_framework import serializers
from .models import AINewsItem

class AINewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AINewsItem
        fields = '__all__'
