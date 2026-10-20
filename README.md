# GTM-to-Delivery — Operational Integrity

Independent proof of work for Cohere's Delivery Operations Analyst opportunity.

An interactive, fictional GTM → Deal Desk → Delivery Engineering workflow. All entities and thresholds are synthetic. No integration with Cohere systems, no actual commercial approvals, no endorsement.

## Local setup

```sh
python -m http.server 8000
node --test tests/test_engine.cjs
```

Visit `http://localhost:8000`.

Author: Felipe Mattos · [LinkedIn](https://www.linkedin.com/in/felipervm) · [Portfolio](https://github.com/felipervm)


## Interface and validation

The workbench includes a guided current-versus-hypothetical comparison, clickable pipeline stages, stage/condition filters, a review-only inspector and filtered CSV export. Metrics describe the full 12-record fixture. The local hypothetical copy never updates the queue or source file.

Delivery-ready means inputs are valid, security/commercial approvals and scope confirmation are present, an owner is assigned, and the record is in Approved or Delivery Assigned. Assignment due is separate from an approval blocker. Stage age is not cycle time. Unsupported enums and invalid ages route to GTM Operations rather than being accepted. See [decision logic](docs/decision-logic.md).

18 automated Node tests cover stage gating, enum validation, malformed ages, whitespace/type errors, routing priority, SLA boundaries, non-mutation and review-only events. Run `node --test tests/test_engine.cjs` and `node --check src/app.js`.

Cohere logos, typefaces and product artwork are used for company context, without affiliation or endorsement. Felipe's supplied portrait appears in the closing introduction. No Salesforce, Mission Control or North integration is implemented. This is a candidacy work sample, not a production product.
