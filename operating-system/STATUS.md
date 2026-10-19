# Current state — 19 October 2026

Stage 02: implemented, private deployment pending verification.

The original AlpMed design is retained in brokerage/private/home.html and public/. Buyer and supplier forms persist in one D1 database. Dashboard at /admin uses hosting-authenticated owner identity, with runtime OWNER_EMAIL. No demonstration inventory is loaded. Public intake is closed with INTAKE_ENABLED=false. Owner synthetic testing is permitted.

Canonical application source: repository root; original package app/ is replaced by brokerage/, build/sites-worker.ts and generated drizzle/ migrations. Original commercial rules retained.

Public launch is BLOCKED by missing confirmed legal operator name, postal address and contact email, final privacy/retention/hosting notice, and the legal launch gates in _config/LEGAL_AND_PRIVACY_GATES.md. No later business stages are marked complete. No payment, outreach, inventory purchase or regulatory clearance has occurred.
