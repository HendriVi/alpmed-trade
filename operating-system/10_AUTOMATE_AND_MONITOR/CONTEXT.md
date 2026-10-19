# 10_AUTOMATE_AND_MONITOR — ICM stage contract (layer 2)

**One job:** Automate only repeated, proven steps; monitor quality and failures.

## Inputs (and boundaries)
| Source | Scope |
|---|---|
| `09_COLLECT_AND_REVIEW/output/` | Read only needed sections |
| `app/README.md` | Read only needed sections |
| `_config/RESEARCH_AND_OUTREACH.md` | Read only needed sections |

## Process
1. Run security checks and acceptance tests for website, dashboard and state machine.
2. Automate the biggest recurring bottleneck next: permission-based lead capture, supplier stock reconfirmation, approved research enrichment, documentation reminders or partner updates.
3. Keep alerting, human approval for legal/payment, retries and audit history.
4. Assess new market corridors only after verified import and payment rules.

## Outputs
`10_AUTOMATE_AND_MONITOR/output/automation-change-log.md`. Include source links, timestamp, unresolved questions, named responsible party, and explicit status (draft/verified/blocked). This output is a handoff artifact, NOT a duplicate customer database.

## Audit and advancement gate
One deployed automation with measured hours saved, accepted error rate and rollback path. A blocked stage must write the blocker in `STATUS.md` and must NOT mark later stages complete.
