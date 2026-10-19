# Current state — 19 October 2026

Stage 02: implemented and deployed privately. Public launch remains blocked.

The original AlpMed design is retained in brokerage/private/home.html and public/. Buyer and supplier forms persist in one D1 database. Dashboard at /admin uses hosting-authenticated owner identity, with runtime OWNER_EMAIL. No demonstration inventory is loaded. Public intake is closed with INTAKE_ENABLED=false. Owner synthetic testing is permitted.

Canonical application source: repository root; original package app/ is replaced by brokerage/, build/sites-worker.ts and generated drizzle/ migrations. Original commercial rules retained.

Public launch is BLOCKED by missing confirmed legal operator name, postal address and contact email, final privacy/retention/hosting notice, and the legal launch gates in _config/LEGAL_AND_PRIVACY_GATES.md. No later business stages are marked complete. No payment, outreach, inventory purchase or regulatory clearance has occurred.

Private site: https://alpmed-trade.calmearth512.chatgpt.site
Dashboard: https://alpmed-trade.calmearth512.chatgpt.site/admin
Deployment appgdep_6ad63401f2788191b929a161e9213ad3 succeeded with runtime environment revision 1. Live checks: home, scripts and privacy return 200; database catalogue returns 200 with zero offers; unauthenticated owner API returns 401; admin sends anonymous requests to sign-in. Browser rendering and signed-in production form submission were not exercised. Original gh-pages demonstration inventory removed and intake buttons disabled while launch is pending.
