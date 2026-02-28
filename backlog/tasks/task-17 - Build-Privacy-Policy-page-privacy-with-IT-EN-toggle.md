---
id: TASK-17
title: Build Privacy Policy page (/privacy) with IT/EN toggle
status: To Do
assignee: []
created_date: '2026-02-28 09:56'
labels:
  - frontend
  - gdpr
  - legal
dependencies:
  - TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build app/privacy/page.tsx — a complete, realistic Privacy Policy page.

Language toggle: IT / EN (default: IT for EU users)

Must cover:
- Data Controller: QUID S.r.l., Via Example 1, Milano — privacy@quid.app
- Data Collected: account data, content data (notes/tasks), technical data (IP hash, user-agent, session tokens)
- Legal Basis (Art. 6 GDPR): 6.1.b (contract), 6.1.f (legitimate interest), 6.1.a (consent for optional analytics)
- Data Retention: active = until deletion; deleted = purged within 30 days
- User Rights (Art. 15-22): access, rectification, erasure, portability, restriction, objection
- How to exercise rights: email privacy@quid.app or via in-app Account Menu
- Third Parties: Convex (US, standard contractual clauses), Google OAuth
- Cookies: session only, no tracking, no ads
- No data selling: explicit statement
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page renders at /privacy without errors
- [ ] #2 Language toggle switches all content between Italian and English
- [ ] #3 All required GDPR sections are present (data controller, legal basis, retention, rights, third parties, cookies)
- [ ] #4 privacy@quid.app appears as a mailto link
- [ ] #5 Page uses QUID dark theme styling (no white background)
<!-- AC:END -->
