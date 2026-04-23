# Nelson's Bar

A personal, AI-powered cocktail bar app. Catalogs my bar, generates
drinks from what I have, and learns my taste over time.

**Live App:** https://nelsonhumberto.github.io/nelsons-bar/

## Features
- Smart bar inventory with volume tracking and ABV
- Photo recognition: snap a bottle (or a whole shelf), AI catalogs it
- Mood-based cocktail generation from your actual bar
- Drinks-made history with ratings and favorites
- Auto to-buy list when bottles run low
- Substitution AI ("I'm out of Lillet, what works?")
- Cross-device sync via Supabase (real-time)
- Installable PWA (Android, iOS, desktop)

## Setup (one-time)
Run [`nelsons_bar_setup.sql`](./nelsons_bar_setup.sql) in the Supabase
SQL Editor. The OpenAI proxy is already shared with Laura's Food.

## Tech
Single-file HTML + vanilla JS · Supabase Postgres + Realtime ·
OpenAI GPT-4o (proxied via SECURITY DEFINER Postgres function) ·
PWA · GitHub Pages.

## Local development
Just open `index.html` in a browser, or serve the folder with any static
file server (e.g. `python3 -m http.server 8000`). No build step.
