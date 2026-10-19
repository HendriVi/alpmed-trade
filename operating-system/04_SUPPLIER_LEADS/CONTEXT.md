# 04_SUPPLIER_LEADS — ICM stage contract (layer 2)

**One job:** Build verified German supply partnerships with no speculative purchasing.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `_config/RESEARCH_AND_OUTREACH.md` | Read only needed sections |
| `_config/LEGAL_AND_PRIVACY_GATES.md` | Read only needed sections |

## Process
1. Find inspected/serviced equipment suppliers and permitted disposal partners.
2. Verify business identity, serial/age, CE history, technical service, warranty, availability, delivery and brokerage fee agreement.
3. Add supplier enquiry through public form or verified owner workflow and approve only after evidence review.

## Outputs
`04_SUPPLIER_LEADS/output/supplier-research.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
At least one partner confirms specific available equipment and seller/service responsibilities. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
