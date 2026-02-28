---
id: TASK-1
title: Setup Next.js 14 project with TypeScript and dependencies
status: Done
assignee: []
created_date: '2026-02-28 09:51'
updated_date: '2026-02-28 10:07'
labels:
  - setup
  - frontend
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Initialize the Next.js 14 (App Router) project with all required dependencies.

Install: next, react, react-dom, typescript, tailwindcss, framer-motion, convex, @auth/core, geist.
Configure tsconfig.json with strict mode.
No separate frontend/ or backend/ folders — Convex expects convex/ at root, Next.js uses app/ and components/ at root.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 next dev starts without errors
- [ ] #2 tsconfig.json has strict: true
- [ ] #3 All required packages present in package.json (next, convex, framer-motion, geist, tailwindcss)
- [ ] #4 npx tsc --noEmit passes with zero errors on an empty project
<!-- AC:END -->
