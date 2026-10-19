# 09_COLLECT_AND_REVIEW — ICM stage contract (layer 2)

**One job:** Verify payment and quantify real economics and founder workload.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `08_SHIP_AND_ACCEPT/output/` | Read only needed sections |
| `_config/PROFIT_AND_RISK.md` | Read only needed sections |

## Process
1. Verify broker fee received in business account using real bank/escrow evidence.
2. Calculate net realized contribution including refunds, costs and customer acquisition.
3. Record founder time and identify which step caused manual work or delays.
4. Archive relevant documents securely; update STATUS.md.

## Outputs
`09_COLLECT_AND_REVIEW/output/deal-retrospective.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
Fee actually received, contribution positive, evidence filed and next improvement identified. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
