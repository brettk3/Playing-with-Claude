import logging
import os
import time

import schedule
from dotenv import load_dotenv

# Load .env from the same directory as this script
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from tweet_generator import add_to_history, generate_tweet, load_history
from twitter_client import create_client, post_tweet

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "agent.log")
        ),
    ],
)
log = logging.getLogger(__name__)

MAX_RETRIES = 3
RETRY_DELAY = 60  # seconds


def tweet_job():
    """Generate and post one Bitcoin tweet."""
    log.info("Starting tweet job...")

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            history = load_history()
            tweet_text = generate_tweet(history)
            log.info(f"Generated tweet ({len(tweet_text)} chars): {tweet_text}")

            client = create_client()
            tweet_id = post_tweet(client, tweet_text)
            log.info(f"Posted successfully. Tweet ID: {tweet_id}")

            add_to_history(tweet_text)
            return

        except Exception as e:
            log.error(f"Attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                log.info(f"Retrying in {RETRY_DELAY}s...")
                time.sleep(RETRY_DELAY)
            else:
                log.error("All retries exhausted. Skipping this tweet slot.")


def main():
    times_str = os.getenv("TWEET_TIMES", "08:00,11:00,14:00,17:00,20:00")
    tweet_times = [t.strip() for t in times_str.split(",")]

    for t in tweet_times:
        schedule.every().day.at(t).do(tweet_job)
        log.info(f"Scheduled tweet at {t}")

    log.info(f"Agent running. {len(tweet_times)} tweets/day. Ctrl+C to stop.")

    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    main()
