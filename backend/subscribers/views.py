from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Subscriber
from .serializers import SubscriberSerializer

class SubscribeView(generics.CreateAPIView):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    permission_classes = [AllowAny]
