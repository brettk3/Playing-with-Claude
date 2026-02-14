import os

import tweepy


def create_client():
    """Create an authenticated tweepy v2 Client."""
    required = {
        "TWITTER_API_KEY": os.getenv("TWITTER_API_KEY"),
        "TWITTER_API_SECRET": os.getenv("TWITTER_API_SECRET"),
        "TWITTER_ACCESS_TOKEN": os.getenv("TWITTER_ACCESS_TOKEN"),
        "TWITTER_ACCESS_TOKEN_SECRET": os.getenv("TWITTER_ACCESS_TOKEN_SECRET"),
    }
    missing = [k for k, v in required.items() if not v]
    if missing:
        raise ValueError(f"Missing Twitter env vars: {', '.join(missing)}")

    return tweepy.Client(
        consumer_key=required["TWITTER_API_KEY"],
        consumer_secret=required["TWITTER_API_SECRET"],
        access_token=required["TWITTER_ACCESS_TOKEN"],
        access_token_secret=required["TWITTER_ACCESS_TOKEN_SECRET"],
    )


def post_tweet(client, text):
    """Post a tweet and return the tweet ID."""
    response = client.create_tweet(text=text)
    return response.data["id"]
