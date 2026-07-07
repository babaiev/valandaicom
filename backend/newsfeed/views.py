from rest_framework import viewsets
from .models import FeedItem
from .serializers import FeedItemSerializer

class FeedItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FeedItem.objects.all()
    serializer_class = FeedItemSerializer
