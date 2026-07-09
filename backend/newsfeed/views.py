import os
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.core.management import call_command
from .models import AINewsItem
from .serializers import AINewsItemSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class AINewsItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AINewsItem.objects.all()
    serializer_class = AINewsItemSerializer
    pagination_class = StandardResultsSetPagination

@api_view(['POST'])
def trigger_fetch(request):
    auth_header = request.headers.get('Authorization')
    cron_secret = os.getenv('CRON_SECRET_KEY')
    
    if not cron_secret:
        return Response({"error": "CRON_SECRET_KEY not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    expected_token = f"Bearer {cron_secret}"
    
    if auth_header != expected_token:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
    try:
        call_command('fetch_ai_news')
        return Response({"status": "Success", "message": "Feed parsing completed."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
