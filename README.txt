SPORTZONE 1.1 — UPGRADED FRONT-END DEMO
=======================================

WHAT'S INCLUDED
- Cricket and football match centre with All / Cricket / Football filters.
- Player cards, search, sport filter, sample rankings and statistics.
- Sports news cards.
- Favourite teams and saved players.
- Fan registration and login demo.
- Admin dashboard with Matches, Players, News and Users tabs.
- Add/delete match, add/delete player, publish/delete news.
- Responsive layout for mobile, tablet and desktop.
- Local browser storage so demo edits remain on the same browser.
- Optional API read bridge for a backend you provide.

RUN THE WEBSITE
1. Extract SPORTZONE-1.0.zip.
2. Open the SPORTZONE-1.0 folder in VS Code.
3. Open index.html in a browser, or use the VS Code Live Server extension.

DEMO ADMIN LOGIN
Email: admin@sportzone.demo
Password: Admin@123

IMPORTANT LIMITATIONS / PRODUCTION CHECKLIST
This is a front-end demo, not a production-ready sports service.
- Match scores and player figures included in the project are sample/demo content.
  They are not live scores and should not be presented as verified current data.
- Live cricket/football scores and live news require licensed/current data providers,
  API keys, and a backend. Never put private API keys in browser JavaScript.
- The demo admin credential is visible in client-side JavaScript. It is only for
  previewing the admin interface. It is NOT secure authentication.
- Fan accounts and content are stored in the current browser using localStorage.
  Passwords for fan accounts are SHA-256 hashed for this demo, but a browser-only
  app is not a secure identity system. Production needs server-side password hashing
  (Argon2id/bcrypt), sessions, role checks, validation, rate limiting and HTTPS.
- Admin changes currently affect only this browser. A real multi-user admin panel
  needs a server API and database with authorization on every write request.
- Add privacy policy, terms, moderation, backups and audit logs before public launch.

OPTIONAL API READ BRIDGE
Before loading the page, define window.SPORTZONE_API_BASE to your backend base URL.
The front end will attempt GET requests to:
  {base}/matches
  {base}/players
  {base}/news
Each endpoint should return a JSON array matching the fields used in script.js.
This bridge is read-only. For production, add authenticated server endpoints for
admin create/update/delete operations; do not rely on client-side role checks.

MATCH OBJECT EXAMPLE
{
  "id": 101,
  "sport": "cricket",
  "competition": "International · ODI",
  "home": "India",
  "away": "Australia",
  "homeIcon": "🇮🇳",
  "awayIcon": "🇦🇺",
  "score": "245/4",
  "status": "LIVE",
  "detail": "Example payload — use provider data"
}

For GitHub Pages, this static demo can be hosted as-is. Do not commit API secrets.
