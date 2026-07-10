import os
import re

directories = [
    'frontend/src',
    'frontend/public',
    'frontend/index.html',
    'backend/blog/signals.py',
    'backend/subscribers/templates',
    'test_mailersend.py',
    'fix_tests.py'
]

replacements = [
    (r'VAL3R11', 'ValAndAI'),
    (r'/VAL3R11/i', '/ValAndAI/i'),
    (r'/val3r11/i', '/ValAndAI/i'),
    (r'VAL<span>3</span>R<span>11</span>', 'ValAndAI'),
    (r'Virtual Autonomous Leader', 'ValAndAI'),
    (r'Virtual Autonomous Leader, 3rd generation, Remote only, One-to-One with AI.', 'ValAndAI.'),
    (r'3rd Generation, Remote Only, One-to-One with AI.', '')
]

def process_file(filepath):
    if not filepath.endswith(('.html', '.js', '.jsx', '.py', '.txt', '.xml', 'CNAME')):
        return
        
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception:
        return

    new_content = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for target in directories:
    if os.path.isfile(target):
        process_file(target)
    else:
        for root, dirs, files in os.walk(target):
            for file in files:
                filepath = os.path.join(root, file)
                process_file(filepath)
