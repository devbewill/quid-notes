import { internalMutation } from "../_generated/server";

/**
 * Hard-deletes all user accounts that have passed their 30-day soft-delete window.
 * Deletes notes and tasks first to avoid orphaned records, then the user record.
 * Registered as a daily cron job in convex/crons.ts.
 */
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const pendingUsers = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), true),
          q.lte(q.field("deletionScheduledAt"), now)
        )
      )
      .collect();

    for (const user of pendingUsers) {
      // Delete all notes owned by the user
      const notes = await ctx.db
        .query("notes")
        .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
        .collect();
      for (const note of notes) {
        await ctx.db.delete(note._id);
      }

      // Delete all tasks owned by the user
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
        .collect();
      for (const task of tasks) {
        await ctx.db.delete(task._id);
      }

      // Hard-delete the user record
      await ctx.db.delete(user._id);
    }

    return { deleted: pendingUsers.length };
  },
});
