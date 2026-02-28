---
id: TASK-2
title: Configure Tailwind CSS design tokens and global layout
status: Done
assignee: []
created_date: '2026-02-28 09:51'
updated_date: '2026-02-28 10:07'
labels:
  - setup
  - frontend
  - design
dependencies:
  - TASK-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up the QUID design system in Tailwind and define the root layout.

Custom colors in tailwind.config.ts: bg=#0B0B0B, surface=#161616, border=#262626, text=#E8E8E8, muted=#666666, accent=#FFFFFF.
Load Geist font via next/font (or geist npm package) in app/layout.tsx.
Global layout: sidebar w-56 fixed left (bg-surface border-r border-border) + main area flex-1 bg-bg.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 tailwind.config.ts exports the 6 custom color tokens (bg, surface, border, text, muted, accent)
- [ ] #2 Geist font is loaded and applied to the html element
- [ ] #3 app/layout.tsx renders a two-column layout: sidebar w-56 + main flex-1
- [ ] #4 Background color bg-bg (#0B0B0B) is visible in the browser
<!-- AC:END -->
