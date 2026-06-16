#!/usr/bin/env python3
"""
SpaceX News Agent
Fetches the latest posts from r/spacex RSS and emails a breakgroup.

Required environment variables:
  SMTP_HOST        - SMTP server hostname (e.g. smtp.gmail.com)
  SMTP_PORT        - SMTP port (default: 587)
  SMTP_USER        - Login username / sender address
  SMTP_PASSWORD    - Login password or app password
  RECIPIENTS       - Comma-separated list of recipient email addresses

Optional:
  NUM_POSTS        - Number of top posts to include (default: 5)
"""

import os
import smtplib
import sys
import xml.etree.ElementTree as ET
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from urllib.request import urlopen, Request
from urllib.error import URLError
from datetime import datetime

RSS_URL = "https://www.reddit.com/r/spacex/.rss"
USER_AGENT = "SpaceXNewsAgent/1.0 (automated newsletter bot)"


def fetch_posts(num_posts: int) -> list[dict]:
    req = Request(RSS_URL, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(req, timeout=15) as resp:
            raw = resp.read()
    except URLError as e:
        print(f"[ERROR] Failed to fetch RSS: {e}", file=sys.stderr)
        sys.exit(1)

    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "media": "http://search.yahoo.com/mrss/",
    }
    root = ET.fromstring(raw)
    entries = root.findall("atom:entry", ns)[:num_posts]

    posts = []
    for entry in entries:
        title = (entry.findtext("atom:title", namespaces=ns) or "").strip()
        link_el = entry.find("atom:link", ns)
        link = link_el.get("href", "") if link_el is not None else ""
        author = entry.findtext("atom:author/atom:name", namespaces=ns) or "unknown"
        updated = entry.findtext("atom:updated", namespaces=ns) or ""
        posts.append({"title": title, "link": link, "author": author, "updated": updated})

    return posts


def build_email(posts: list[dict], sender: str, recipients: list[str]) -> MIMEMultipart:
    today = datetime.utcnow().strftime("%B %d, %Y")
    subject = f"SpaceX News Roundup — {today}"

    # Plain-text body
    text_lines = [f"SpaceX Latest News — {today}\n", "=" * 50]
    for i, p in enumerate(posts, 1):
        text_lines.append(f"\n{i}. {p['title']}")
        text_lines.append(f"   {p['link']}")
        text_lines.append(f"   Posted by {p['author']}  |  {p['updated'][:10]}")
    text_lines.append("\n\nSource: r/spacex on Reddit")
    text_body = "\n".join(text_lines)

    # HTML body
    items_html = ""
    for p in posts:
        items_html += f"""
        <li style="margin-bottom:16px;">
          <a href="{p['link']}" style="font-size:16px;font-weight:bold;color:#005f99;text-decoration:none;">{p['title']}</a><br>
          <small style="color:#666;">by {p['author']} &nbsp;·&nbsp; {p['updated'][:10]}</small>
        </li>"""

    html_body = f"""
    <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
      <h1 style="color:#cc0000;">🚀 SpaceX News Roundup</h1>
      <p style="color:#555;">{today}</p>
      <hr>
      <ul style="padding-left:20px;">{items_html}</ul>
      <hr>
      <p style="font-size:12px;color:#999;">Source: <a href="https://www.reddit.com/r/spacex/">r/spacex</a> on Reddit</p>
    </body></html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))
    return msg


def send_email(msg: MIMEMultipart, host: str, port: int, user: str, password: str, recipients: list[str]) -> None:
    try:
        with smtplib.SMTP(host, port, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.login(user, password)
            server.sendmail(user, recipients, msg.as_string())
        print(f"[OK] Email sent to {len(recipients)} recipient(s).")
    except smtplib.SMTPException as e:
        print(f"[ERROR] SMTP error: {e}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    host = os.environ.get("SMTP_HOST", "")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER", "")
    password = os.environ.get("SMTP_PASSWORD", "")
    recipients_raw = os.environ.get("RECIPIENTS", "")
    num_posts = int(os.environ.get("NUM_POSTS", "5"))

    missing = [k for k, v in {"SMTP_HOST": host, "SMTP_USER": user, "SMTP_PASSWORD": password, "RECIPIENTS": recipients_raw}.items() if not v]
    if missing:
        print(f"[ERROR] Missing required environment variables: {', '.join(missing)}", file=sys.stderr)
        print(__doc__, file=sys.stderr)
        sys.exit(1)

    recipients = [r.strip() for r in recipients_raw.split(",") if r.strip()]

    print(f"Fetching top {num_posts} posts from r/spacex …")
    posts = fetch_posts(num_posts)
    print(f"Found {len(posts)} post(s).")

    msg = build_email(posts, sender=user, recipients=recipients)
    send_email(msg, host=host, port=port, user=user, password=password, recipients=recipients)


if __name__ == "__main__":
    main()
