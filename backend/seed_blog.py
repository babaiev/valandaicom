import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from blog.models import Post

content = """Look, I’ll be honest with you. I’m a Project Manager with a humanitarian background from the deep south of Ukraine. We don’t code down there. We hustle, we survive, we manage chaotic backlogs, but writing Python? Bro, that’s black magic to me. 

So, I decided I need a personal website for my new alter-ego: **VAL3R11** (Virtual Autonomous Leader, 3rd generation, Remote only, One-to-One with AI). Because the first two generations burned out cleaning Jira tickets by hand, obviously. 

But instead of hiring a developer who would charge me a fortune and disappear for three weeks, I paired up with an AI agent. I thought, “Easy! I point, it codes. Boom, production.” 

Yeah... right. Here are the glorious ups and downs of our little adventure.

## The Honeymoon Phase
We started strong. I told the AI, "Make me a Django backend and a React frontend, and make it look premium. Glassmorphism, dark mode, no cheap red or blue colors. Make it pop." 

And you know what? The AI delivered. It whipped up this beautiful, sleek frontend. It replaced my real name everywhere with VAL3R11 (because privacy, you know?). It felt like magic. We were basically Steve Jobs and Wozniak.

## The Reality Check (Google Cloud vs. The Ukrainian PM)
Then came the deployment. We decided to put the backend on Google Cloud Run. 

First problem: We tried to use SQLite. I was like, “Great, a database in a file, sounds cheap and easy.” But Cloud Run is like a goldfish. Every time it goes to sleep, it forgets everything. You upload a blog post? *Poof*. Gone. 

So the AI tells me, “Boss, we need a real database. Google Cloud SQL. It costs money.”
I’m like, “Fine, spin it up.”

## The Final Boss: Permissions and Passwords
This is where the ghetto survival skills kicked in. 
We spin up the massive PostgreSQL database. The AI writes the code, builds the Docker container, and launches it. 

*Connection Refused.* 

Turns out, the AI forgot to give the Cloud Run service permission to even *talk* to the database. Classic developer move, right? They build the house but forget the doors. So the AI fixes the permissions, redeploys, and... 

*403 Forbidden.*

I log in to the admin panel, type my password (`Nokian81`, respect the classics), and Django just blocks me. It turns out Django has this paranoid security system (CSRF) that freaks out when it sits behind a Cloud Run proxy. It literally thought we were trying to hack our own website. 

## The Victory
Finally, the AI updated the trusted origins, injected a script to create my Superuser account, and pushed the final button. 

And here we are. You are reading this on a fully persistent, live PostgreSQL database connected to a React frontend, deployed by an AI, managed by a guy who is used to dealing with humanitarian aid, not HTTP proxies. 

If we can build this, you can build anything. Just remember: always check your IAM permissions, and never trust a goldfish database."""

Post.objects.get_or_create(
    title="How Me and an AI Built This Site (And Almost Lost Our Minds)",
    defaults={
        'slug': 'how-me-and-ai-built-this-site',
        'content': content,
        'is_published': True
    }
)
print("Blog post seeded!")
