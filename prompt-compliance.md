## System Role

You are a Senior Fullstack Engineer and Privacy/Compliance Specialist with deep expertise in GDPR, data minimization principles, Next.js 14 (App Router), TypeScript, and Convex. You write production-quality, fully typed code with no placeholders. When a compliance choice has multiple valid approaches, you pick the most privacy-respecting default and document it with a `// PRIVACY:` inline comment.

---

## Project Context

You are extending **QUID**, a web app built on Next.js 14 + Convex. Users can register manually (email/password) or via Google OAuth. The app stores personal data (notes, tasks, dates) linked to each user. You must now implement the full privacy and compliance layer.

The app is intended for users in the EU. **GDPR compliance is mandatory, not optional.**

---

## Scope of This Task

Implement the following four areas completely:

1. Privacy Policy & Terms of Service pages
2. GDPR-compliant data handling logic (Convex)
3. Multi-user data isolation (enforce at query/mutation level)
4. User Account Menu with: profile info, export data, delete account

---

## 1. Legal Pages

### `/privacy` — Privacy Policy

Generate a complete, realistic Privacy Policy page in **Italian and English** (language toggle). It must cover:

- **Data Controller:** QUID (placeholder: "QUID S.r.l., Via Example 1, Milano, Italy — privacy@quid.app")
- **Data Collected:**
  - Account data: email, name, Google profile picture (if OAuth)
  - Content data: notes, tasks, dates created/modified
  - Technical data: IP address (at registration), user-agent, session tokens
- **Legal Basis (Art. 6 GDPR):**
  - Contract performance (Art. 6.1.b) → account management, core features
  - Legitimate interest (Art. 6.1.f) → security, abuse prevention
  - Consent (Art. 6.1.a) → optional analytics (if ever added)
- **Data Retention:**
  - Active account: data retained until deletion request
  - Deleted account: all personal data purged within **30 days**
  - Anonymized aggregate stats (if any): retained indefinitely
- **User Rights (Art. 15–22 GDPR):** Access, Rectification, Erasure, Portability, Restriction, Objection
- **How to exercise rights:** email to privacy@quid.app or directly via the in-app Account Menu
- **Third parties:** Convex (data processor, US — standard contractual clauses apply), Google OAuth (if used)
- **Cookies:** session cookies only, no tracking cookies, no third-party ad cookies
- **No data selling:** explicit statement

### `/terms` — Terms of Service

Generate a complete Terms of Service page covering:

- Eligibility (age 16+ per GDPR Art. 8)
- Acceptable use (no illegal content, no sharing credentials)
- Intellectual property (user owns their content)
- Service availability (no SLA guarantee for free tier)
- Account termination conditions
- Limitation of liability
- Governing law: Italy / EU

### Consent Banner

On first visit (before any account creation), show a minimal cookie/consent banner:

```
QUID uses only essential session cookies. No tracking, no ads.
[Got it]   [Privacy Policy]
```

- Store consent in `localStorage` key `quid_consent_v1 = "accepted"`.
- Do **not** show again after acceptance.
- Style consistent with QUID dark theme.

---

## 2. GDPR-Compliant Data Handling (Convex)

### Registration Flow

**Manual (email/password):**

- Collect: email (required), name (optional), password (hashed — never stored in plaintext, use Convex Auth bcrypt default)
- At registration, log: `registeredAt` (timestamp), `ipHash` (SHA-256 of IP — store hash, not raw IP), `userAgent`
- Show checkbox (unchecked by default): "I have read and accept the Privacy Policy and Terms of Service" — **required to proceed**
- Show optional checkbox: "I accept to receive product updates by email" → store as `marketingConsent: boolean`

**Google OAuth:**

- Collect from Google profile: email, name, `googleId`, `avatarUrl`
- Same consent checkbox required before completing registration
- Never request Google scopes beyond `profile` and `email`

### `users` table (extend existing schema)

```ts
{
  // Identity
  email: v.string(),
  name: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  authProvider: v.union(v.literal("email"), v.literal("google")),

  // Consent & compliance
  privacyAcceptedAt: v.number(),        // Unix timestamp ms — required
  privacyPolicyVersion: v.string(),     // e.g. "2024-01-01" — to track future re-consent
  marketingConsent: v.boolean(),
  marketingConsentUpdatedAt: v.optional(v.number()),

  // Technical (privacy-safe)
  registeredAt: v.number(),
  lastActiveAt: v.optional(v.number()),
  ipHash: v.optional(v.string()),       // SHA-256, not raw IP
  userAgent: v.optional(v.string()),

  // Account state
  isDeleted: v.boolean(),               // soft delete flag
  deletionRequestedAt: v.optional(v.number()),
  deletionScheduledAt: v.optional(v.number()), // registrationDate + 30 days
}
```

**Soft delete logic:**

- On deletion request: set `isDeleted: true`, `deletionRequestedAt: now`, `deletionScheduledAt: now + 30 days`
- During the 30-day window: user can cancel deletion (reactivate account)
- After 30 days: a Convex scheduled job hard-deletes the user record AND all associated notes/tasks
- During soft-delete window: user cannot log in (show message: "Your account is scheduled for deletion on [date]. [Cancel deletion]")

---

## 3. Multi-User Data Isolation

**Rule: every Convex query and mutation that touches `notes` or `tasks` MUST verify ownership.**

Implement a reusable server-side helper:

```ts
// convex/lib/auth.ts
export async function requireOwner(
  ctx: QueryCtx | MutationCtx,
  resourceOwnerId: Id<"users">,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("UNAUTHENTICATED");
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .unique();
  if (!user || user._id !== resourceOwnerId) throw new Error("FORBIDDEN");
  if (user.isDeleted) throw new Error("ACCOUNT_DELETED");
  return user;
}
```

Apply `requireOwner` to **every** query and mutation in `notes.ts` and `tasks.ts`. Never rely on client-passed `userId` parameters — always derive the user from the authenticated session server-side.

Add the following Convex indexes for efficient scoped queries:

```ts
notes: defineTable({...}).index("by_owner", ["ownerId"]).index("by_owner_and_parent", ["ownerId", "parentTaskId"])
tasks: defineTable({...}).index("by_owner", ["ownerId"])
users: defineTable({...}).index("by_email", ["email"])
```

---

## 4. User Account Menu

### Trigger

In the sidebar (bottom-left), render a user avatar/initials button. On click, open a slide-over panel from the left or a dropdown — your choice, pick the more elegant option for the QUID dark aesthetic.

### Menu Sections

```
─────────────────────────
  👤  Mario Rossi
      mario@example.com
      Registered via Google
─────────────────────────
  ACCOUNT
  [ Edit Profile ]         → inline form: edit name only (email is immutable)
  [ Change Password ]      → only visible if authProvider === "email"
  [ Marketing emails ]     → toggle switch, updates marketingConsent in DB

  DATA & PRIVACY
  [ Export my data ]       → downloads a JSON file
  [ Privacy Policy ]       → opens /privacy in new tab
  [ Terms of Service ]     → opens /terms in new tab

  DANGER ZONE
  [ Delete my account ]    → opens confirmation modal
─────────────────────────
  [ Sign out ]
─────────────────────────
```

### Export My Data

Implement a Convex action `users.exportData` that:

1. Fetches all notes and tasks owned by the user
2. Builds a JSON object:

```json
{
  "exportedAt": "2024-01-15T10:30:00Z",
  "account": {
    "email": "mario@example.com",
    "name": "Mario Rossi",
    "registeredAt": "2023-06-01T08:00:00Z",
    "authProvider": "google"
  },
  "notes": [
    {
      "title": "...",
      "text": "...",
      "status": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "tasks": [
    {
      "title": "...",
      "text": "...",
      "status": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

3. Returns the JSON string to the client
4. Client triggers a browser download: `quid-export-YYYY-MM-DD.json`

**Do not include** in the export: `ipHash`, `userAgent`, internal Convex IDs — these are internal/technical fields.

### Delete Account Flow

1. User clicks "Delete my account"
2. Modal opens:

```
  ⚠️  Delete your account

  All your notes and tasks will be permanently deleted
  within 30 days. You can cancel this within the window.

  Type "DELETE" to confirm:
  [ _________________ ]

  [ Cancel ]   [ Confirm deletion ]
```

3. On confirm: call mutation `users.requestDeletion`
4. User is signed out immediately
5. On next login attempt within 30 days: show reactivation screen instead of dashboard

---

## Deliverables (generate all of the following)

| #   | File                                  | Description                                                                                                                             |
| --- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `convex/schema.ts`                    | Updated users table with all compliance fields                                                                                          |
| 2   | `convex/lib/auth.ts`                  | `requireOwner` helper                                                                                                                   |
| 3   | `convex/users.ts`                     | `exportData` action, `requestDeletion` mutation, `cancelDeletion` mutation, `updateProfile` mutation, `updateMarketingConsent` mutation |
| 4   | `convex/scheduled/hardDeleteUsers.ts` | Scheduled job that hard-deletes users after 30-day window                                                                               |
| 5   | `app/privacy/page.tsx`                | Privacy Policy page (IT/EN toggle)                                                                                                      |
| 6   | `app/terms/page.tsx`                  | Terms of Service page                                                                                                                   |
| 7   | `components/ConsentBanner.tsx`        | First-visit cookie banner                                                                                                               |
| 8   | `components/AccountMenu.tsx`          | Full account slide-over/dropdown                                                                                                        |
| 9   | `components/DeleteAccountModal.tsx`   | Deletion confirmation modal                                                                                                             |
| 10  | `components/ExportDataButton.tsx`     | Export trigger + download logic                                                                                                         |

Generate each file completely. No `// TODO`, no `...rest of code`. Every component must be fully typed with TypeScript interfaces. All user-facing strings must support both Italian and English via a simple `useLocale` hook that reads from a context (implement the hook too).
