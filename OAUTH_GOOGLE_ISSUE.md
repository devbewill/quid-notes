# OAuth Google Login Issue

## Problem Description

When logging out from one Google account and trying to log in with a different Google account, the user gets stuck on the signin page. A manual page refresh is required to successfully enter the app.

## Observed Behavior

### First Login (works correctly)
1. User logs in with Google Account A
2. Convex logs show:
   ```
   auth:store type: verifier
   auth:store type: verifierSignature
   auth:store type: userOAuth
   auth:store type: verifyCodeAndSignIn
   auth:store type: refreshSession
   ```
3. User is redirected to home page successfully

### Logout and Second Login (fails)
1. User logs out
2. Convex logs show:
   ```
   auth:store type: signOut
   ```
3. User tries to log in with Google Account B
4. Convex logs show only:
   ```
   auth:store type: verifier
   auth:store type: verifierSignature
   auth:store type: userOAuth
   auth:store type: verifyCodeAndSignIn
   auth:store type: refreshSession
   ```
5. User gets stuck on signin page
6. Manual page refresh triggers second `refreshSession` and user can enter

**Key observation**: The first login shows TWO `refreshSession` events, while the second login after logout only shows ONE `refreshSession`. The second `refreshSession` only happens when manually refreshing the page.

## Root Cause

It appears that after logout, when a user tries to log in with a different Google account, Convex Auth does not automatically trigger the second `refreshSession` that is required to complete the authentication flow. The second `refreshSession` only occurs when the page is manually refreshed.

This suggests that Convex Auth's session management may have an issue when switching between OAuth accounts of the same provider.

## Solutions Attempted

### Attempt 1: Improved loading states and redirects
**File**: `app/signin/page.tsx`

Added loading spinner and redirect logic with multiple timeout checks.

**Result**: Failed - user still gets stuck on signin page.

### Attempt 2: Prevent multiple redirects
**File**: `app/signin/page.tsx`

Added `isRedirecting` state to prevent multiple redirects.

**Result**: Failed - blocked all logins, had to revert.

### Attempt 3: Wait for user document creation
**File**: `app/signin/page.tsx`

Modified redirect logic to wait for `user` document to be created before redirecting.

**Result**: Failed - user document is created but redirect doesn't happen.

### Attempt 4: Multiple timeout checks
**File**: `app/signin/page.tsx`

Added multiple checks at 500ms, 1000ms, 2000ms to catch delayed auth updates.

**Result**: Failed - timeouts fire but redirect doesn't happen.

### Attempt 5: Force page reload
**File**: `app/signin/page.tsx`

Added forced `window.location.reload()` after 300ms when authenticated.

**Result**: Failed - no flash, still stuck.

### Attempt 6: Aggressive polling
**File**: `app/signin/page.tsx`

Added polling every 500ms to check if user document is created.

**Result**: Failed - no console logs from polling logic.

### Attempt 7: Force reload with longer delay
**File**: `app/signin/page.tsx`

Changed to 1.5 second delay before forced reload.

**Result**: Failed - still stuck, no reload.

### Attempt 8: Sign out before sign in
**File**: `app/signin/page.tsx`

Modified `handleGoogle` to call `signOut()` before `signIn("google")`.

**Result**: Failed - still gets stuck.

## Current State

The problem is still unresolved. The user can successfully:
- Log in with email/password
- Log in with the first Google account used
- Log in with multiple Google accounts if they refresh the page manually

But cannot:
- Log out from one Google account and immediately log in with a different Google account without manual page refresh

## Relevant Files

- `app/signin/page.tsx` - Login/signup page
- `app/page.tsx` - Main dashboard with auth checks
- `convex/auth.ts` - Convex auth configuration with `createOrUpdateUser` callback
- `convex/lib/auth.ts` - `requireAuth` helper

## Next Steps to Investigate

1. Check Convex Auth library version and documentation for known issues
2. Look into clearing localStorage/sessionStorage more aggressively
3. Consider using Convex's `isAuthenticated` ref instead of hook
4. Investigate if there's a Convex Auth method to force a session refresh
5. Check if the issue is browser-specific (cookies, local storage)
6. Consider using a different OAuth flow or provider as a workaround

## Convex Logs Analysis

### Successful login pattern:
```
verifier → verifierSignature → userOAuth → verifyCodeAndSignIn → refreshSession → refreshSession
```

### Failed login after logout pattern:
```
verifier → verifierSignature → userOAuth → verifyCodeAndSignIn → refreshSession
```

The missing second `refreshSession` is the key difference.
