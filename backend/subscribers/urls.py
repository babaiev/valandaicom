from django.urls import path
from . import views

urlpatterns = [
    path('', views.SubscribeView.as_view(), name='subscribe'),
    path('unsubscribe/<uuid:token>/', views.unsubscribe, name='unsubscribe'),
    path('webhook/sender/', views.sender_webhook, name='sender_webhook'),
]
