# 05_VERIFY_AND_MATCH — ICM stage contract (layer 2)

**One job:** Determine whether a confirmed buyer requirement fits a verified offer.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `03_BUYER_LEADS/output/` | Read only needed sections |
| `04_SUPPLIER_LEADS/output/` | Read only needed sections |
| `_config/LEGAL_AND_PRIVACY_GATES.md` | Read only needed sections |
| `app/src/rules.js` | Read only needed sections |

## Process
1. Confirm buyer RFQ and verified current supplier offer.
2. Check category, maximum equipment budget and supplier technical and commercial constraints.
3. Check whether remaining service life and local approval/installation are feasible.
4. Use the owner dashboard Find Matches; clearly label matches as candidates until buyer accepts.

## Outputs
`05_VERIFY_AND_MATCH/output/match-decision.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
One traceable possible match with all unsolved risks stated. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
