# 06_QUOTE_AND_PROFIT — ICM stage contract (layer 2)

**One job:** Ensure economic viability before binding commitments.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `05_VERIFY_AND_MATCH/output/` | Read only needed sections |
| `_config/PROFIT_AND_RISK.md` | Read only needed sections |

## Process
1. Get supplier quote valid through target closing date.
2. Calculate broker fee in EUR, who pays it, payment fees, partner fees, logistics scope, dispute reserve and taxes separately.
3. Reject zero/negative expected contribution or unfunded upfront cash requirements.
4. Only create a deal in owner dashboard once its inputs are verified.

## Outputs
`06_QUOTE_AND_PROFIT/output/approved-quote.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
Positive expected contribution and written fee-payer agreement. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
