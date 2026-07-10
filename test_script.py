from blog.models import Post
from blog.signals import send_batch_emails_thread
import requests

post = Post.objects.filter(is_published=True).last()
if post:
    print(f"Testing with post: {post.title}")
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
