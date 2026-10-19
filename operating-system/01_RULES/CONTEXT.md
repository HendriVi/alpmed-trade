# 01_RULES — ICM stage contract (layer 2)

**One job:** Define the legally permissible brokerage role; do not launch prematurely.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `_config/LEGAL_AND_PRIVACY_GATES.md` | Read only needed sections |
| `_config/PROFIT_AND_RISK.md` | Read only needed sections |
| `STATUS.md` | Read only needed sections |

## Process
1. Identify operating company and disclosed broker role.
2. Obtain qualified review of German seller → Romanian clinic pathway, ANMDMR obligations, VAT, service partner and seller-of-record.
3. Choose an independent eligible escrow provider and establish responsibility matrix.

## Outputs
`01_RULES/output/role-matrix.md and output/launch-blockers.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
Written responsibility assignment and legal route; otherwise blocked. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
