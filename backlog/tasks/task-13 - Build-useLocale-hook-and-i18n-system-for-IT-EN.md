---
id: TASK-13
title: Build useLocale hook and i18n system for IT/EN
status: To Do
assignee: []
created_date: '2026-02-28 09:55'
labels:
  - frontend
  - i18n
dependencies:
  - TASK-2
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement hooks/useLocale.ts — a simple React context + hook for Italian/English localization.

Requirements:
- LocaleContext provides current locale (it | en) and a toggle function
- useLocale() hook exposes { locale, setLocale, t(key) }
- No external i18n library — keep it simple with a typed dictionary object
- LocaleProvider wraps the app in app/layout.tsx
- All user-facing strings in components that require it (AccountMenu, ConsentBanner, Privacy, Terms) must use t() instead of hardcoded strings
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 useLocale() returns current locale and a setLocale toggle function
- [ ] #2 Toggling locale from it to en (or vice versa) re-renders all components using the hook with the new language
- [ ] #3 The hook is typed: t() only accepts known translation keys (no any)
- [ ] #4 LocaleProvider is present in app/layout.tsx
<!-- AC:END -->
