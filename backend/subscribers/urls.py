from django.urls import path
from . import views

urlpatterns = [
    path('', views.SubscribeView.as_view(), name='subscribe'),
    path('unsubscribe/<uuid:token>/', views.unsubscribe, name='unsubscribe'),
    path('webhook/brevo/', views.brevo_webhook, name='brevo_webhook'),
    path('trigger-queue/', views.trigger_email_queue, name='trigger_email_queue'),
]
