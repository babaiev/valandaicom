from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    # Only return published posts by default, annotate with comment_count
    queryset = Post.objects.filter(is_published=True).annotate(
        comment_count=Count('comments')
    )
    serializer_class = PostSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, slug=None):
        post = self.get_object()
        
        if request.method == 'GET':
            comments = post.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
            
        elif request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(post=post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def like(self, request, slug=None):
        post = self.get_object()
        post.likes += 1
        post.save(update_fields=['likes'])
        return Response({'status': 'liked', 'likes': post.likes})

    @action(detail=True, methods=['post'])
    def unlike(self, request, slug=None):
        post = self.get_object()
        if post.likes > 0:
            post.likes -= 1
            post.save(update_fields=['likes'])
        return Response({'status': 'unliked', 'likes': post.likes})

    @action(detail=True, methods=['post'])
    def dislike(self, request, slug=None):
        post = self.get_object()
        post.dislikes += 1
        post.save(update_fields=['dislikes'])
        return Response({'status': 'disliked', 'dislikes': post.dislikes})

    @action(detail=True, methods=['post'])
    def undislike(self, request, slug=None):
        post = self.get_object()
        if post.dislikes > 0:
            post.dislikes -= 1
            post.save(update_fields=['dislikes'])
        return Response({'status': 'undisliked', 'dislikes': post.dislikes})

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        post = self.get_object()
        post.view_count += 1
        post.save(update_fields=['view_count'])
        return Response({'status': 'viewed', 'view_count': post.view_count})
