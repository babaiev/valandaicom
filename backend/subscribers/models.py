import uuid
from django.db import models

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True, help_text="False if user unsubscribed or bounced")
    is_bounced = models.BooleanField(default=False)
    is_spam_complaint = models.BooleanField(default=False)
    unsubscribe_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return f"{self.email} ({'Active' if self.is_active else 'Inactive'})"


