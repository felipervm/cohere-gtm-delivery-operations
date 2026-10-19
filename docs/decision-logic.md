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
