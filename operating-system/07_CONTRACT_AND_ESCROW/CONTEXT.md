# 07_CONTRACT_AND_ESCROW — ICM stage contract (layer 2)

**One job:** Allocate legal roles and secure third-party payments.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `06_QUOTE_AND_PROFIT/output/` | Read only needed sections |
| `_config/LEGAL_AND_PRIVACY_GATES.md` | Read only needed sections |

## Process
1. Obtain executed buyer–seller contract and disclosed brokerage agreement.
2. Confirm applicable device approvals and responsible Romanian entity.
3. Open independent third-party escrow (never broker-held money); verify amount, release criteria and broker fee.
4. Advance deal gates only on documented human confirmation; never let AI claim funds cleared.

## Outputs
`07_CONTRACT_AND_ESCROW/output/transaction-control.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
Signed agreements, verified regulatory route and independent escrow funding. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
