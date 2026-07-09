from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from blog.models import Post
from subscribers.models import Subscriber
from django.template.loader import render_to_string
import requests
import os
import threading

SENDER_API_KEY = os.environ.get('SENDER_API_KEY', '')
SENDER_URL = 'https://api.sender.net/v2/message/send'

@receiver(pre_save, sender=Post)
def capture_previous_published_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            previous = Post.objects.get(pk=instance.pk)
            instance._was_published = previous.is_published
        except Post.DoesNotExist:
            instance._was_published = False
    else:
        instance._was_published = False

def send_batch_emails_thread(post_id):
    try:
        post = Post.objects.get(pk=post_id)
        active_subscribers = list(Subscriber.objects.filter(is_active=True))
        
        if not active_subscribers or not SENDER_API_KEY:
            return

        site_url = os.environ.get('SITE_URL', 'https://val3r11.com')
        post_url = f"{site_url}/blog/{post.slug}/"
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {SENDER_API_KEY}"
        }
        
        # Use a session for faster sequential requests
        with requests.Session() as session:
            session.headers.update(headers)
            
            for sub in active_subscribers:
                unsubscribe_url = f"{site_url}/api/subscribers/unsubscribe/{sub.unsubscribe_token}/"
                
                context = {
                    'post_title': post.title,
                    'post_snippet': post.content[:150] + '...',
                    'post_url': post_url,
                    'post_image_url': f"{site_url}{post.cover_image.url}" if post.cover_image else None,
                    'unsubscribe_url': unsubscribe_url
                }
                
                html_content = render_to_string('emails/new_post.html', context)
                
                payload = {
                    "from": {"name": "VAL3R11", "email": "info@val3r11.com"},
                    "to": {"email": sub.email},
                    "subject": f"New Post: {post.title}",
                    "html": html_content
                }
                
                session.post(SENDER_URL, json=payload)
    except Exception as e:
        pass # Optionally log the error

@receiver(post_save, sender=Post)
def trigger_batch_emails(sender, instance, created, **kwargs):
    if instance.is_published and not getattr(instance, '_was_published', False):
        threading.Thread(target=send_batch_emails_thread, args=(instance.pk,)).start()
