# 02_WEBSITE_AND_INTAKE — ICM stage contract (layer 2)

**One job:** Launch a minimal buyer/supplier enquiry site, not an ecommerce store.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `app/README.md` | Read only needed sections |
| `app/public/privacy.html` | Read only needed sections |
| `_config/LEGAL_AND_PRIVACY_GATES.md` | Read only needed sections |

## Process
1. Configure one Cloudflare Worker with its D1 database and secure owner credentials.
2. Replace privacy placeholders and verify form consent, HTTPS, anti-bot and mobile usability.
3. Confirm one test buyer, one test supplier and protected dashboard; do not collect real submissions before legal/privacy pass.

## Outputs
`02_WEBSITE_AND_INTAKE/output/website-test.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
Form records saved, admin protected, privacy complete and legal gate passed. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
