import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireAuth } from "./lib/auth";
import { api } from "./_generated/api";

/** Returns the current authenticated user's profile. */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user || user.isDeleted) return null;
    return user;
  },
});

/** Returns the current authenticated user's profile, including soft-deleted users. */
export const currentWithDeleted = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return user;
  },
});

/** Update display name only — email is immutable. */
export const updateProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    await ctx.db.patch(user._id, { name: args.name });
  },
});

/** Toggle marketing email preference. */
export const updateMarketingConsent = mutation({
  args: {
    marketingConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    await ctx.db.patch(user._id, {
      marketingConsent: args.marketingConsent,
      marketingConsentUpdatedAt: Date.now(),
    });
  },
});

/**
 * Initiate soft-delete: sets isDeleted=true and schedules hard-delete in 30 days.
 * The caller must sign out the user immediately after.
 */
export const requestDeletion = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    await ctx.db.patch(user._id, {
      isDeleted: true,
      deletionRequestedAt: now,
      deletionScheduledAt: now + THIRTY_DAYS_MS,
    });
  },
});

/**
 * Cancel a pending deletion within the 30-day window.
 * Re-activates the account.
 */
export const cancelDeletion = mutation({
  args: {},
  handler: async (ctx) => {
    // NOTE: requireAuth throws on isDeleted, so we bypass it here
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("UNAUTHENTICATED");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("UNAUTHENTICATED");

    const now = Date.now();
    if (!user.deletionScheduledAt || user.deletionScheduledAt <= now) {
      throw new Error("DELETION_WINDOW_EXPIRED");
    }

    await ctx.db.patch(userId, {
      isDeleted: false,
      deletionRequestedAt: undefined,
      deletionScheduledAt: undefined,
    });
  },
});

/**
 * Check if a user account is in soft-delete state (for the login screen).
 * Returns deletion info if soft-deleted, null otherwise.
 */
export const getDeletionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    if (!user.isDeleted) return null;
    return {
      deletionScheduledAt: user.deletionScheduledAt,
    };
  },
});

/**
 * Check if an email belongs to a soft-deleted account.
 * Used during sign-in to prevent soft-deleted users from signing in.
 */
export const checkEmailDeletionStatus = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) return { exists: false, isDeleted: false };

    return {
      exists: true,
      isDeleted: user.isDeleted ?? false,
      deletionScheduledAt: user.deletionScheduledAt,
    };
  },
});

/**
 * Export all user data as a JSON string.
 * Excludes: ipHash, userAgent, internal Convex IDs — per GDPR data portability.
 */
export const exportData = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("UNAUTHENTICATED");

    const user = await ctx.runQuery(api.users.current);
    if (!user) throw new Error("USER_NOT_FOUND");

    const notes = await ctx.runQuery(api.notes.listTopLevel);
    const tasks = await ctx.runQuery(api.tasks.listAll);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      account: {
        email: user.email,
        name: user.name ?? null,
        registeredAt: new Date(user.registeredAt).toISOString(),
        authProvider: user.authProvider,
        marketingConsent: user.marketingConsent,
        privacyAcceptedAt: new Date(user.privacyAcceptedAt).toISOString(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notes: (notes as any[]).map((n) => ({
        title: n.title as string,
        text: n.text as string,
        status: n.status as string,
        startDate: n.startDate
          ? new Date(n.startDate as number).toISOString()
          : null,
        dueDate: n.dueDate ? new Date(n.dueDate as number).toISOString() : null,
        createdAt: new Date(n.createdAt as number).toISOString(),
        updatedAt: new Date(n.updatedAt as number).toISOString(),
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tasks: (tasks as any[]).map((t) => ({
        title: t.title as string,
        text: t.text as string,
        status: t.status as string,
        startDate: t.startDate
          ? new Date(t.startDate as number).toISOString()
          : null,
        dueDate: t.dueDate ? new Date(t.dueDate as number).toISOString() : null,
        createdAt: new Date(t.createdAt as number).toISOString(),
        updatedAt: new Date(t.updatedAt).toISOString(),
      })),
    };

    return JSON.stringify(exportPayload, null, 2);
  },
});

/**
 * IMMEDIATELY hard-delete all user data and account.
 * This should ONLY be used for testing or explicit user confirmation.
 */
export const hardDeleteImmediate = mutation({
  args: {},
  handler: async (ctx) => {
    // We get the ID directly so we can delete users who are already soft-deleted
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("UNAUTHENTICATED");

    // 1. Delete all tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // 2. Delete all notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // 3. Delete auth sessions
    const authSessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of authSessions) {
      await ctx.db.delete(session._id);
    }

    // 4. Delete auth accounts
    const authAccounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of authAccounts) {
      await ctx.db.delete(account._id);
    }

    // 5. Delete the user document itself
    await ctx.db.delete(userId);
  },
});

/**
 * Restore a soft-deleted user by email.
 * This is an admin function to restore accidentally deleted accounts.
 */
export const restoreUserByEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isDeleted) {
      throw new Error("USER_NOT_DELETED");
    }

    await ctx.db.patch(user._id, {
      isDeleted: false,
      deletionRequestedAt: undefined,
      deletionScheduledAt: undefined,
    });

    return { success: true, email: user.email };
  },
});

/**
 * Admin action to restore a soft-deleted user by email.
 * Can be called from the Convex dashboard.
 */
export const adminRestoreUser = action({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean; email: string }> => {
    const result = await ctx.runMutation(api.users.restoreUserByEmail, {
      email: args.email,
    });
    return result;
  },
});
