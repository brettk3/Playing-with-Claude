# Bitcoin Tweet Agent

An automated agent that tweets about Bitcoin 5 times per day using AI-generated content.

- **Tweet generation**: Google Gemini API (free tier) generates unique, varied tweets
- **Posting**: Twitter/X API v2 via tweepy
- **Scheduling**: Configurable times, defaults to 8am, 11am, 2pm, 5pm, 8pm
- **Deduplication**: Recent tweet history fed into prompts to avoid repetition

## Getting a Free Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key into your `.env` file

The free tier includes 15 requests per minute — more than enough for 5 tweets per day.

## Getting Twitter API Credentials

1. Go to https://developer.x.com/en/portal/dashboard
2. Sign up for a developer account if you don't have one.
   - The **Free** tier is sufficient (allows 1,500 tweets/month).
   - You must have a phone number verified on your X account.
3. Create a **Project** and an **App** inside it:
   - Project name: anything (e.g., "Bitcoin Bot")
   - App name: anything (e.g., "btc-tweet-agent")
4. In your App settings, go to **"Keys and tokens"**:
   - Under **Consumer Keys**, click "Regenerate" to get your API Key and API Secret. Save them immediately.
   - Under **Authentication Tokens**, generate an Access Token and Secret with **Read and Write** permissions. Save them immediately.
5. Under **"User authentication settings"**, make sure:
   - App permissions are set to **Read and Write**
   - Type of App is **Web App, Automated App or Bot**
   - Callback URL can be anything (e.g., `https://example.com`)
6. Copy all four values into your `.env` file.

> **Troubleshooting**: If you get a 403 Forbidden error when posting, your Access Token was generated before you set Read+Write permissions. Regenerate the Access Token after changing permissions.

## Quick Start

```bash
# 1. Navigate to the agent directory
cd bitcoin-tweet-agent

# 2. Create a virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Set up your environment variables
cp .env.example .env
# Edit .env with your real API keys

# 4. Test tweet generation (optional, only needs GEMINI_API_KEY)
python3 -c "
from dotenv import load_dotenv; load_dotenv('.env')
from tweet_generator import generate_tweet, load_history
print(generate_tweet(load_history()))
"

# 5. Run the agent
python3 main.py
```

## Running in the Background

```bash
# Option 1: nohup
nohup python3 main.py > /dev/null 2>&1 &

# Option 2: tmux (recommended for monitoring)
tmux new -s btc-bot
python3 main.py
# Press Ctrl+B then D to detach
# Reattach later with: tmux attach -t btc-bot
```

## Configuration

All configuration is via environment variables in `.env`:

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | — | Your Google Gemini API key (free) |
| `TWITTER_API_KEY` | Yes | — | Twitter OAuth consumer key |
| `TWITTER_API_SECRET` | Yes | — | Twitter OAuth consumer secret |
| `TWITTER_ACCESS_TOKEN` | Yes | — | Twitter OAuth access token |
| `TWITTER_ACCESS_TOKEN_SECRET` | Yes | — | Twitter OAuth access token secret |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model to use |
| `TWEET_TIMES` | No | `08:00,11:00,14:00,17:00,20:00` | Comma-separated 24h times |
| `HISTORY_SIZE` | No | `100` | Max tweets stored in history |

## Logs

- **stdout**: Real-time log output
- **agent.log**: Persistent log file in the agent directory
