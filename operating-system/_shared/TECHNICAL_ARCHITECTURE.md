# Architecture contract

Public site (`/`) → public buyer/supplier JSON POST → Cloudflare Worker validates, rate limits, records → D1.

Owner site (`/admin.html`) → private API (HTTPS + owner basic credentials) → verify supplier + stock + evidence; qualify buyer → automatic category/budget/expiry match → configure quoted price, disclosed broker commission and broker costs → deal created only if positive contribution → sequential evidence-based compliance/payment/shipping/acceptance gates.

File-backed ICM research stages are the **agent's working memory**, not another database. App D1 is the single live CRM. Research output is staged outside the public site, with URLs and dates. No research output is promoted to verified stock or verified buying intent without checks.

External dependencies currently NOT implemented: web research agent scheduling, verified email delivery, electronic contracting, escrow provider, freight platform, tax engine. Add one only if transaction evidence proves it is needed and workable.
