from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AINewsItemViewSet, trigger_fetch

router = DefaultRouter()
router.register(r'items', AINewsItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('trigger-fetch/', trigger_fetch, name='trigger-fetch'),
]
