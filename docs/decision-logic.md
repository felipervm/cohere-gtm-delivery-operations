# Decision logic and limitations

**Purpose:** a fictional GTM → Deal Desk → Delivery Engineering handoff work sample for the Delivery Operations Analyst role at Cohere. This is not a representation of Cohere’s internal systems or policies.

## Process stages
GTM Brief → Deal Desk → Approved → Delivery Assigned. Stage aging uses hypothetical thresholds: 2, 3, 2 and 5 days, respectively.

## Required fields
Account, owner, region, use case, positive estimated value, security review, commercial approval, technical scope and delivery owner fields. Note that 'unassigned' is a known placeholder value and requires assignment before readiness.

## Routing order
1. Missing/invalid input → GTM Operations
2. Unapproved security review → Security
3. Unconfirmed technical scope → Delivery Engineering
4. Unapproved commercial approval → Deal Desk
5. Missing delivery assignee → Engineering Program Manager
6. Otherwise monitor

## Human approval and auditability
Events are **proposals**, with `requiresHumanApproval: true` and `executed: false`. Nothing touches a CRM, production API or Cohere customer data. A real pilot would need legal/security sign-off, identity/access control, stable field mapping, approval permissions, event logging, retry/error management, and owner accountability.

## Interpretation
All observations, financial values, case names, responsibilities and SLA thresholds are fictional. This tool helps discuss possible workflows, not diagnose issues at Cohere.


## Readiness, input validation and task definitions

Readiness additionally requires stage Approved or Delivery Assigned; complete records in earlier stages route to Deal Desk for human stage reconciliation. It never moves a stage automatically.

Text fields must be nonblank strings. Estimated value must be a finite positive number. Approval states are pending/approved/rejected; scope is confirmed/unconfirmed. Stage must be one of the four stages. Stage age must be a finite nonnegative number. Invalid inputs route first to GTM Operations. Unknown stages have no inferred SLA and are separately counted in the engine. Invalid ages are excluded from average stage age.

Assignment due is a task for an otherwise approved, valid record at the delivery gate with an unassigned owner. It is not counted as an approval/input blocker. A record can be ready and over its stage-age threshold simultaneously: these measure different conditions. Average stage age is a snapshot, not cycle time or measured efficiency.

The guided comparison uses an ephemeral copy. Hypothetical resolution assumes a valid brief, obtained approvals, confirmed scope, named owner, Approved stage and age zero. It does not alter the source, dashboard metrics or CSV. Events remain human-review proposals with executed:false.

## Acceptance checks

18 Node tests cover readiness stage gates, unsupported enums, invalid ages, input types, owner routing, task distinctions, SLA boundaries, fixture reconciliation and source preservation. The browser should show 12 opportunities, 4 ready, 6 blocked, 2 with invalid/missing fields and 7 over the illustrative SLA. Average stage age is 3.8 days. Filters affect only the queue and exported CSV.
