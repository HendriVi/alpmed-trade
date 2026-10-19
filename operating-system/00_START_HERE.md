# MEDICAL BROKERAGE OS — START HERE

**Purpose:** A small, remote-operable, no-inventory brokerage matching buyers of used/refurbished medical equipment to European equipment suppliers, initially Germany → Romania. Your income comes from a **contractually disclosed success fee**. No promise about any specific percentage until both parties agree.

**This package is the system**—not another spreadsheet or an abstract business plan. It contains a working prototype (public buyer/supplier intake, reviewed listings, a private owner dashboard, matching, profit checks, and sequential transaction gates), plus an ICM workflow for a single AI agent. There is no AI API key, subscription, inventory purchase, or software development required to study or test the files. Public launch DOES require deployment, security configuration and legal checks; it is not already live.

## Single operating route

01 RULES → 02 WEBSITE / INTAKE → 03 BUYER LEADS → 04 SUPPLIER LEADS → 05 VERIFY & MATCH → 06 QUOTE & PROFIT → 07 CONTRACT & ESCROW → 08 SHIP & ACCEPT → 09 COLLECT & REVIEW → 10 AUTOMATE / MONITOR.

Every numbered folder has a `CONTEXT.md` file: **inputs, process, output, pass/fail gate.** Its `output/` folder holds only documents created while working that stage. **The live buyer/supplier/deal records belong to the app database.** Do not create duplicate spreadsheets.

## What already exists

- `app/public/index.html` — buyer form, supplier form, verified-offer storefront.
- `app/public/admin.html` — private owner workspace (buyers, suppliers, offers, matching, deals, financial contribution).
- `app/src/index.js`, `app/src/rules.js` — server-side data capture and automatic deterministic rules.
- `app/schema.sql` — database structure.
- `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` — AI agent operating instructions; `STATUS.md` — exact current state.
- `RUN_WITH_AI.md` — one prompt to hand the whole folder to a coding or research agent.

## Your involvement

Before launch: register a hosting account or authorize an agent to deploy; insert the business's actual company and privacy details; resolve Romanian regulatory pathway; agree with payment and service partners. After launch: approve prospects, suppliers and equipment; decide whether to proceed on profit-positive deals; approve legal/payment milestones and handle exceptions. Everything else is a target for automation **after the first successful deal**.

## Important limitations

- Running `index.html` from Files does not activate forms; the Worker and database must be deployed.
- This starter **does not** autonomously search the entire public web or send emails. AI research requires a web-enabled agent with the folder, or an explicitly configured external research integration. Do not describe research as live until completed.
- The dashboard is a **working MVP**, not certified medical software, escrow, legal due diligence, an invoicing system, a freight booking platform or a validated production deployment.
- Do not launch before `_config/LEGAL_AND_PRIVACY_GATES.md` passes.

**Next step:** Hand this ZIP to an AI coding agent with `RUN_WITH_AI.md` and ask it to deploy the app to a dedicated Cloudflare Worker/D1 instance (after you explicitly authorize account access). No spreadsheets.
