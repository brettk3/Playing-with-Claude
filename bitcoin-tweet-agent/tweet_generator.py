import json
import os
import random

import anthropic

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
    """Generate a unique Bitcoin tweet using the Claude API."""
    client = anthropic.Anthropic()

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

    message = client.messages.create(
        model=os.getenv("CLAUDE_MODEL", "claude-sonnet-4-20250514"),
        max_tokens=100,
        messages=[{"role": "user", "content": prompt}],
    )

    tweet_text = message.content[0].text.strip().strip('"')

    # Truncate if over 280 characters
    return tweet_text[:280]
