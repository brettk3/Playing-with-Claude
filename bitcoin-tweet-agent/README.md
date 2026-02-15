# Bitcoin Tweet Agent

An automated agent that tweets about Bitcoin 5 times per day using AI-generated content.

- **Tweet generation**: Groq API (Llama 3.3 70B) generates unique, varied tweets
- **Posting**: Twitter/X API v2 via OAuth 2.0 (PKCE)
- **Scheduling**: Configurable times, defaults to 8am, 11am, 2pm, 5pm, 8pm
- **Deduplication**: Recent tweet history fed into prompts to avoid repetition

## Getting Twitter API Credentials (OAuth 2.0)

1. Go to https://developer.x.com/en/portal/dashboard
2. Sign up for a developer account if you don't have one.
   - The **Free** tier is sufficient (allows 1,500 tweets/month).
3. Create a **Project** and an **App** inside it.
4. In your App settings, go to **"User authentication settings"**:
   - Enable **OAuth 2.0**
   - App permissions: **Read and Write**
   - Type of App: **Web App, Automated App or Bot**
   - Callback URL: `http://127.0.0.1:3000/callback`
5. Note your **Client ID** and **Client Secret** from the "Keys and tokens" tab.

## Getting a Groq API Key

1. Go to https://console.groq.com/keys
2. Create an API key
3. Copy the key into your `.env` file

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
# Edit .env with your TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, and GROQ_API_KEY

# 4. Run the OAuth 2.0 authorization flow (one-time setup)
python3 authorize.py
# Follow the prompts: open the URL, authorize, paste the callback URL
# Copy the printed tokens into your .env file

# 5. Test your credentials
python3 test_credentials.py

# 6. Run the agent
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
| `GROQ_API_KEY` | Yes | — | Your Groq API key |
| `TWITTER_CLIENT_ID` | Yes | — | Twitter OAuth 2.0 Client ID |
| `TWITTER_CLIENT_SECRET` | Yes | — | Twitter OAuth 2.0 Client Secret |
| `TWITTER_ACCESS_TOKEN` | Yes | — | OAuth 2.0 access token (from authorize.py) |
| `TWITTER_REFRESH_TOKEN` | Yes | — | OAuth 2.0 refresh token (from authorize.py) |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model to use |
| `TWEET_TIMES` | No | `08:00,11:00,14:00,17:00,20:00` | Comma-separated 24h times |
| `HISTORY_SIZE` | No | `100` | Max tweets stored in history |

## Token Refresh

OAuth 2.0 access tokens expire after ~2 hours. The agent automatically refreshes tokens using the refresh token and updates the `.env` file so tokens persist across restarts.

If the refresh token itself expires, re-run `python3 authorize.py` to get new tokens.

## Logs

- **stdout**: Real-time log output
- **agent.log**: Persistent log file in the agent directory
