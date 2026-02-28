---
id: TASK-19
title: TypeScript strict check and lint pass — zero errors
status: Done
assignee: []
created_date: '2026-02-28 09:56'
updated_date: '2026-02-28 10:40'
labels:
  - quality
dependencies:
  - TASK-12
  - TASK-15
  - TASK-16
  - TASK-17
  - TASK-18
  - TASK-9
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Final quality gate before the project is considered shippable.

Checks to run:
- npx tsc --noEmit: must produce zero errors
- npm run lint (ESLint): must produce zero errors and zero warnings
- No "any" types in the codebase (except explicitly annotated exceptions with // NOTE: justification)
- No "// TODO" or "// FIXME" comments in the codebase
- No hardcoded user IDs or API keys in source code
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 npx tsc --noEmit exits with code 0
- [ ] #2 npm run lint exits with code 0
- [ ] #3 grep -r "any" src/ (or equivalent) returns no unqualified any usages
- [ ] #4 grep -r "TODO\|FIXME" returns no results in app/, components/, convex/, hooks/, lib/
<!-- AC:END -->
