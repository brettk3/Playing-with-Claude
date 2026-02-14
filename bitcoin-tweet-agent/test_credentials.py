"""Quick credential validation for the Bitcoin Tweet Agent.

Run:  python test_credentials.py
"""

import os
import sys

import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))


def test_twitter():
    print("=== Twitter API ===")
    required = {
        "TWITTER_API_KEY": os.getenv("TWITTER_API_KEY"),
        "TWITTER_API_SECRET": os.getenv("TWITTER_API_SECRET"),
        "TWITTER_ACCESS_TOKEN": os.getenv("TWITTER_ACCESS_TOKEN"),
        "TWITTER_ACCESS_TOKEN_SECRET": os.getenv("TWITTER_ACCESS_TOKEN_SECRET"),
    }

    missing = [k for k, v in required.items() if not v]
    if missing:
        print(f"FAIL: Missing env vars: {', '.join(missing)}")
        return False

    print("  All 4 env vars are set.")

    # Note: The pay-per-use plan does NOT support read endpoints like get_me().
    # We test by posting a tweet and immediately deleting it.
    import tweepy

    client = tweepy.Client(
        consumer_key=required["TWITTER_API_KEY"],
        consumer_secret=required["TWITTER_API_SECRET"],
        access_token=required["TWITTER_ACCESS_TOKEN"],
        access_token_secret=required["TWITTER_ACCESS_TOKEN_SECRET"],
    )

    try:
        # Post a test tweet
        response = client.create_tweet(text="Test tweet - please ignore (will be deleted)")
        tweet_id = response.data["id"]
        print(f"  OK: Successfully posted test tweet (ID: {tweet_id})")

        # Immediately delete it
        client.delete_tweet(tweet_id)
        print(f"  OK: Deleted test tweet.")
        return True
    except tweepy.Unauthorized:
        print("  FAIL: 401 Unauthorized.")
        print("  -> Check that your API plan is active at developer.x.com -> Dashboard.")
        print("  -> Regenerate all 4 keys and update .env.")
        return False
    except tweepy.Forbidden:
        print("  FAIL: 403 Forbidden.")
        print("  -> Your app may lack Read/Write permissions.")
        print("  -> Check developer.x.com -> App Settings -> User authentication.")
        return False
    except Exception as e:
        print(f"  FAIL: {e}")
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
