import os

import requests


TOKEN_URL = "https://api.twitter.com/2/oauth2/token"
ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")


def _refresh_access_token(client_id, client_secret, refresh_token):
    """Exchange a refresh token for a new access token."""
    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": client_id,
        },
        auth=(client_id, client_secret),
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["access_token"], data.get("refresh_token", refresh_token)


def _update_env_tokens(access_token, refresh_token):
    """Update tokens in the .env file so they persist across restarts."""
    if not os.path.exists(ENV_PATH):
        return

    with open(ENV_PATH, "r") as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        if line.startswith("TWITTER_ACCESS_TOKEN="):
            new_lines.append(f"TWITTER_ACCESS_TOKEN={access_token}\n")
        elif line.startswith("TWITTER_REFRESH_TOKEN="):
            new_lines.append(f"TWITTER_REFRESH_TOKEN={refresh_token}\n")
        else:
            new_lines.append(line)

    with open(ENV_PATH, "w") as f:
        f.writelines(new_lines)


def create_client():
    """Create an authenticated Twitter API v2 client using OAuth 2.0."""
    required = {
        "TWITTER_CLIENT_ID": os.getenv("TWITTER_CLIENT_ID"),
        "TWITTER_CLIENT_SECRET": os.getenv("TWITTER_CLIENT_SECRET"),
        "TWITTER_ACCESS_TOKEN": os.getenv("TWITTER_ACCESS_TOKEN"),
        "TWITTER_REFRESH_TOKEN": os.getenv("TWITTER_REFRESH_TOKEN"),
    }
    missing = [k for k, v in required.items() if not v]
    if missing:
        raise ValueError(f"Missing Twitter env vars: {', '.join(missing)}")

    return {
        "client_id": required["TWITTER_CLIENT_ID"],
        "client_secret": required["TWITTER_CLIENT_SECRET"],
        "access_token": required["TWITTER_ACCESS_TOKEN"],
        "refresh_token": required["TWITTER_REFRESH_TOKEN"],
    }


def post_tweet(client_ctx, text):
    """Post a tweet using OAuth 2.0 user context. Auto-refreshes on 401."""
    access_token = client_ctx["access_token"]

    for attempt in range(2):
        resp = requests.post(
            "https://api.twitter.com/2/tweets",
            json={"text": text},
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=15,
        )

        if resp.status_code in (200, 201):
            return resp.json()["data"]["id"]

        if resp.status_code == 401 and attempt == 0:
            # Token expired — try refreshing
            access_token, new_refresh = _refresh_access_token(
                client_ctx["client_id"],
                client_ctx["client_secret"],
                client_ctx["refresh_token"],
            )
            client_ctx["access_token"] = access_token
            client_ctx["refresh_token"] = new_refresh
            os.environ["TWITTER_ACCESS_TOKEN"] = access_token
            os.environ["TWITTER_REFRESH_TOKEN"] = new_refresh
            _update_env_tokens(access_token, new_refresh)
            continue

        resp.raise_for_status()

    raise RuntimeError("Failed to post tweet after token refresh")
