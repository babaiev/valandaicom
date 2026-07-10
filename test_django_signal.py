import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from blog.models import Post
from blog.signals import send_batch_emails_thread

post = Post.objects.filter(is_published=True).last()
if post:
    print(f"Testing with post: {post.title}")
    import requests
    # Monkey patch requests to see what it sends and what it receives
    original_post = requests.post
    def mock_post(*args, **kwargs):
        print("URL:", args[0] if args else kwargs.get('url'))
        print("Headers:", kwargs.get('headers'))
        print("JSON:", kwargs.get('json'))
        resp = original_post(*args, **kwargs)
        print("Response Code:", resp.status_code)
        print("Response Text:", resp.text)
        return resp
    requests.post = mock_post
    
    try:
        send_batch_emails_thread(post.pk)
    except Exception as e:
        import traceback
        traceback.print_exc()
else:
    print("No published post found.")
