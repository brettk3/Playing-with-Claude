"""Quick credential validation for the Bitcoin Tweet Agent.

Run:  python3 test_credentials.py
"""

import os
import sys

import requests
from dotenv import load_dotenv
from requests_oauthlib import OAuth1

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))


def test_twitter():
    print("=== Twitter API ===")
    api_key = os.getenv("TWITTER_API_KEY", "")
    api_secret = os.getenv("TWITTER_API_SECRET", "")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN", "")
    access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET", "")

    keys = {
        "TWITTER_API_KEY": api_key,
        "TWITTER_API_SECRET": api_secret,
        "TWITTER_ACCESS_TOKEN": access_token,
        "TWITTER_ACCESS_TOKEN_SECRET": access_token_secret,
    }

    missing = [k for k, v in keys.items() if not v]
    if missing:
        print(f"  FAIL: Missing env vars: {', '.join(missing)}")
        return False

    for k, v in keys.items():
        print(f"  {k}: {v[:5]}...{v[-5:]}")

    # Use raw requests + OAuth1 to get the full error response
    auth = OAuth1(api_key, api_secret, access_token, access_token_secret)

    print("\n  Attempting to post a test tweet...")
    resp = requests.post(
        "https://api.twitter.com/2/tweets",
        json={"text": "Test tweet - will be deleted immediately"},
        auth=auth,
        timeout=15,
    )

    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")

    if resp.status_code in (200, 201):
        tweet_id = resp.json()["data"]["id"]
        print(f"  OK: Tweet posted (ID: {tweet_id}). Deleting...")
        del_resp = requests.delete(
            f"https://api.twitter.com/2/tweets/{tweet_id}",
            auth=auth,
            timeout=15,
        )
        print(f"  Delete status: {del_resp.status_code}")
        return True
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
