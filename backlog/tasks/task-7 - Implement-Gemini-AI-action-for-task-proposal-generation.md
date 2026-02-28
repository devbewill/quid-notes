---
id: TASK-7
title: Implement Gemini AI action for task proposal generation
status: To Do
assignee: []
created_date: '2026-02-28 09:52'
labels:
  - backend
  - ai
dependencies:
  - TASK-4
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement convex/ai.ts — a Convex action that calls the Google Gemini API server-side.

Function: generateProposals(action)
- Accepts: array of note objects (title + text)
- Calls gemini-1.5-flash with the exact prompt from the spec (see prompt.md)
- Parses the JSON array response from Gemini
- Returns exactly 3 strings (task proposals)
- Errors if Gemini returns malformed JSON or not exactly 3 proposals

Prompt:
You are an assistant that converts raw notes into actionable tasks.
Given the following notes, extract the underlying intent and generate exactly 3 concise, actionable task proposals.
Each proposal must be a single sentence starting with a verb.
Return ONLY a JSON array of 3 strings. No explanation.

Notes: {{notes_content}}

Environment variable: GEMINI_API_KEY
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Action returns an array of exactly 3 non-empty strings
- [ ] #2 Each returned string starts with a verb (validated via regex or manual inspection)
- [ ] #3 API key is read from GEMINI_API_KEY env var — never hardcoded
- [ ] #4 If Gemini returns invalid JSON, the action throws a descriptive error (not a raw exception)
- [ ] #5 The Gemini call is server-side only (Convex action, not a client call)
<!-- AC:END -->
