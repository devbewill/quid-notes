---
id: TASK-14
title: Build ConsentBanner component
status: Done
assignee: []
created_date: '2026-02-28 09:55'
updated_date: '2026-02-28 10:40'
labels:
  - frontend
  - gdpr
dependencies:
  - TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build components/ConsentBanner.tsx — first-visit cookie consent banner.

Behavior:
- Shows on first visit before account creation
- Reads localStorage key quid_consent_v1; if "accepted", do not render
- On click [Got it]: sets quid_consent_v1="accepted" in localStorage and hides banner

Content:
  QUID uses only essential session cookies. No tracking, no ads.
  [Got it]   [Privacy Policy]

[Privacy Policy] opens /privacy in a new tab.

Style: consistent with QUID dark theme (bg-surface, border-border, text-text).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Banner is visible on first load when quid_consent_v1 is not set in localStorage
- [ ] #2 After clicking Got it, the banner disappears and quid_consent_v1=accepted is set in localStorage
- [ ] #3 Refreshing the page after consent does not show the banner again
- [ ] #4 Privacy Policy link opens /privacy in a new tab
- [ ] #5 Banner text is localized via useLocale (IT/EN)
<!-- AC:END -->
