import json
import os
import random
import time

import requests

HISTORY_FILE = os.path.join(os.path.dirname(__file__), "tweet_history.json")

TOPICS = [
    "Bitcoin price action or market sentiment",
    "Bitcoin adoption news or milestones",
    "Bitcoin vs traditional finance",
    "Bitcoin mining or halving cycles",
    "Bitcoin technology (Lightning Network, Taproot, etc.)",
    "A common Bitcoin misconception, debunked",
    "Bitcoin and inflation or macroeconomics",
    "A historical Bitcoin fact or anniversary",
    "Bitcoin self-custody and sovereignty",
    "Bitcoin's fixed supply and scarcity",
]


def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)


def save_history(history):
    max_size = int(os.getenv("HISTORY_SIZE", "100"))
    trimmed = history[-max_size:]
    with open(HISTORY_FILE, "w") as f:
        json.dump(trimmed, f, indent=2)


def add_to_history(tweet):
    history = load_history()
    history.append(tweet)
    save_history(history)


def generate_tweet(history):
    """Generate a unique Bitcoin tweet using the Groq API (Llama 3.3 70B)."""
    api_key = os.getenv("GROQ_API_KEY")
    model_name = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    topic = random.choice(TOPICS)

    recent = history[-20:] if history else []
    history_block = "\n".join(f"- {t}" for t in recent) if recent else "(none yet)"

    prompt = f"""Generate exactly one tweet about Bitcoin.

Topic angle: {topic}

Rules:
- Maximum 280 characters
- No hashtags
- Sound like a knowledgeable, witty human — not a corporate account or a bot
- Vary tone: sometimes insightful, sometimes funny, sometimes provocative
- Be specific and opinionated, not generic
- Do NOT repeat or closely paraphrase any of these recent tweets:

{history_block}

Return ONLY the tweet text, nothing else."""

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 100,
    }

    max_retries = 4
    backoff = 5
    for attempt in range(max_retries + 1):
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        if resp.status_code == 429 and attempt < max_retries:
            wait = backoff * (2 ** attempt)
            print(f"Rate limited (429). Retrying in {wait}s... (attempt {attempt + 1}/{max_retries})")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        break
    data = resp.json()

    tweet_text = data["choices"][0]["message"]["content"].strip().strip('"')

    # Truncate if over 280 characters
    return tweet_text[:280]
