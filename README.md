# AlpMed Trade

Medical equipment brokerage website, persistent buyer and supplier enquiries, and owner-only mobile dashboard. Based on the existing HendriVi/alpmed-trade website and supplied Medical Brokerage OS.

## Application
- `/`: preserved AlpMed design; enquiries save to D1.
- `/admin`: ChatGPT sign-in, restricted server-side to OWNER_EMAIL.
- `/privacy`: private-stage notice; legal operator details required before public launch.
- `brokerage/src/`: validated intake, catalogue and owner API, brokerage rules.
- `brokerage/private/`: HTML served by Worker; owner HTML is never a public static asset.
- `public/`: scripts, styles and original brand assets.
- `db/schema.ts`, `drizzle/`: production database schema and immutable applied migrations.
- `operating-system/`: operating instructions and current checkpoint.

## Hosting
ChatGPT Sites provisions the Cloudflare Worker and D1 database identified by `.openai/hosting.json`. Source is mirrored to its deployment repository. This GitHub repository remains the source handoff. GitHub Pages cannot run the database or APIs. The old Pages branch remains a clearly labelled holding page until public launch.

Runtime settings: `OWNER_EMAIL` (secret), `RATE_LIMIT_SALT` (secret), `INTAKE_ENABLED` (false until legal/privacy requirements pass). Credentials are never committed. The gateway supplies authenticated identity headers; do not deploy this worker behind a proxy that accepts visitor-supplied identity headers.

## Verification
Run `node --test brokerage/tests/*.test.js`. Tests use the generated production migrations. Build through the Sites helper documented by the Sites skill. No demonstration stock is seeded. Every supplier submission starts unverified and hidden.

## Current limits
Public launch is blocked pending confirmed legal operator/contact details, privacy policy and the supplied launch gates. The private owner can use synthetic test submissions. Email notifications, escrow, shipping, invoicing and automated sourcing are not configured. Dashboard checks are recorded workflow gates, not proof of regulatory approval.
