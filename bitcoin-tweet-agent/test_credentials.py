"""Quick credential validation for the Bitcoin Tweet Agent.

Run:  python3 test_credentials.py
"""

import os
import sys

import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))


def test_twitter():
    print("=== Twitter API (OAuth 2.0) ===")
    client_id = os.getenv("TWITTER_CLIENT_ID", "")
    client_secret = os.getenv("TWITTER_CLIENT_SECRET", "")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN", "")
    refresh_token = os.getenv("TWITTER_REFRESH_TOKEN", "")

    keys = {
        "TWITTER_CLIENT_ID": client_id,
        "TWITTER_CLIENT_SECRET": client_secret,
        "TWITTER_ACCESS_TOKEN": access_token,
        "TWITTER_REFRESH_TOKEN": refresh_token,
    }

    missing = [k for k, v in keys.items() if not v]
    if missing:
        print(f"  FAIL: Missing env vars: {', '.join(missing)}")
        return False

    for k, v in keys.items():
        print(f"  {k}: {v[:5]}...{v[-5:]}")

    print("\n  Attempting to post a test tweet...")
    resp = requests.post(
        "https://api.twitter.com/2/tweets",
        json={"text": "Test tweet - will be deleted immediately"},
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )

    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")

    if resp.status_code in (200, 201):
        tweet_id = resp.json()["data"]["id"]
        print(f"  OK: Tweet posted (ID: {tweet_id}). Deleting...")
        del_resp = requests.delete(
            f"https://api.twitter.com/2/tweets/{tweet_id}",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=15,
        )
        print(f"  Delete status: {del_resp.status_code}")
        return True
    elif resp.status_code == 401:
        print("  Token may be expired. Try refreshing with authorize.py or check your tokens.")
        return False
    else:
        print("  FAIL: Could not post tweet.")
        return False


def test_groq():
    print("\n=== Groq API ===")
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("  FAIL: GROQ_API_KEY not set.")
        return False

    print("  GROQ_API_KEY is set.")

    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    resp = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"model": model, "messages": [{"role": "user", "content": "Say hi"}], "max_tokens": 5},
        timeout=15,
    )

    if resp.status_code == 200:
        text = resp.json()["choices"][0]["message"]["content"].strip()
        print(f"  OK: Groq responded with: {text}")
        return True
    else:
        print(f"  FAIL: {resp.status_code} {resp.text[:200]}")
        return False


if __name__ == "__main__":
    tw = test_twitter()
    gr = test_groq()

    print("\n=== Summary ===")
    print(f"  Twitter: {'PASS' if tw else 'FAIL'}")
    print(f"  Groq:    {'PASS' if gr else 'FAIL'}")

    if not (tw and gr):
        sys.exit(1)
