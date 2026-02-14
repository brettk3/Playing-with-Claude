import os

import tweepy


def create_client():
    """Create an authenticated tweepy v2 Client."""
    return tweepy.Client(
        consumer_key=os.getenv("TWITTER_API_KEY"),
        consumer_secret=os.getenv("TWITTER_API_SECRET"),
        access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
        access_token_secret=os.getenv("TWITTER_ACCESS_TOKEN_SECRET"),
    )


def post_tweet(client, text):
    """Post a tweet and return the tweet ID."""
    response = client.create_tweet(text=text)
    return response.data["id"]
