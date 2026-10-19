# Website verification — 19 October 2026

Status: private deployment verified; public launch blocked. Responsible owner: Hendri Vieli.

Source: https://github.com/HendriVi/alpmed-trade and supplied Medical_Brokerage_OS_Ready_to_Build(1).zip.

11 automated checks passed using SQLite and the actual generated production migration: buyer/supplier writes, hidden unverified offers, owner and other-account access boundaries, cross-origin rejection, consent validation, rate limiting, private launch gate, matching, profitability and sequential deal progression. Production build passed. Browser visual QA was unavailable in this environment.

Missing: legally responsible operator and public contact details, final privacy notice and original package launch evidence. No real customer or inventory records were seeded.

Live verification: https://alpmed-trade.calmearth512.chatgpt.site — homepage, JS and privacy load; D1-backed catalogue returns an empty list; unauthenticated buyer-record request rejected with 401, owner page redirects to sign-in. Deployment succeeded. No signed-in browser test or real customer submission was performed.
