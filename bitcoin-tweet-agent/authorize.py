"""One-time OAuth 2.0 PKCE authorization flow for Twitter/X API.

Run this once to obtain your access token and refresh token:
    python3 authorize.py

Prerequisites:
    - TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET set in .env
    - OAuth 2.0 enabled in your Twitter Developer Portal
    - Callback URL set to: http://127.0.0.1:3000/callback
"""

import os
import sys

import tweepy
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

REDIRECT_URI = "http://127.0.0.1:3000/callback"
SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access"]


def main():
    client_id = os.getenv("TWITTER_CLIENT_ID", "")
    client_secret = os.getenv("TWITTER_CLIENT_SECRET", "")

    if not client_id or not client_secret:
        print("ERROR: Set TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in .env first.")
        sys.exit(1)

    handler = tweepy.OAuth2UserHandler(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=REDIRECT_URI,
        scope=SCOPES,
    )

    auth_url = handler.get_authorization_url()
    print("1. Open this URL in your browser:\n")
    print(f"   {auth_url}\n")
    print("2. Authorize the app, then copy the FULL callback URL from your browser.")
    print("   (It will look like: http://127.0.0.1:3000/callback?state=...&code=...)\n")

    callback_url = input("Paste the callback URL here: ").strip()

    if not callback_url:
        print("ERROR: No URL provided.")
        sys.exit(1)

    token = handler.fetch_token(callback_url)
    access_token = token["access_token"]
    refresh_token = token.get("refresh_token", "")

    print("\n=== OAuth 2.0 Tokens ===")
    print(f"TWITTER_ACCESS_TOKEN={access_token}")
    if refresh_token:
        print(f"TWITTER_REFRESH_TOKEN={refresh_token}")
    else:
        print("WARNING: No refresh token received. Make sure 'offline.access' scope is enabled.")

    print("\nAdd these to your .env file. The access token expires in ~2 hours;")
    print("the agent will auto-refresh it using the refresh token.")


if __name__ == "__main__":
    main()
