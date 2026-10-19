# 03_BUYER_LEADS — ICM stage contract (layer 2)

**One job:** Identify buyers while distinguishing prospect fit from confirmed demand.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `_config/RESEARCH_AND_OUTREACH.md` | Read only needed sections |
| `app/README.md` | Read only needed sections |

## Process
1. Search Romanian private clinics, diagnostic practices and expansion/procurement announcements using dated public sources.
2. Score only evidence-backed buying signals; no invented needs or bought contact lists.
3. Secure opted-in RFQs using the website or authorized partner introductions; qualify need, budget, timing and authority.

## Outputs
`03_BUYER_LEADS/output/buyer-research.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
At least one directly confirmed qualified equipment request; leads without intent stay prospects. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
