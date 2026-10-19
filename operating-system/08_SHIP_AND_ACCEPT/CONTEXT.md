# 08_SHIP_AND_ACCEPT — ICM stage contract (layer 2)

**One job:** Coordinate without personally arranging or paying for freight.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `07_CONTRACT_AND_ESCROW/output/` | Read only needed sections |
| `_config/LEGAL_AND_PRIVACY_GATES.md` | Read only needed sections |

## Process
1. Supplier and contracted carrier complete de-installation, transport and insurance.
2. Collect tracking, commissioning/installation and regulatory inspection records.
3. Collect formal acceptance or documented dispute before payment release.
4. Advance dashboard status only on actual partner evidence.

## Outputs
`08_SHIP_AND_ACCEPT/output/delivery-and-acceptance.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
Buyer acceptance and independently confirmed contractual release condition. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
