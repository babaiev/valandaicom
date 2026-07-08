from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
