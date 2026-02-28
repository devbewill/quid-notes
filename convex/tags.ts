import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Updates the color of a tag across ALL notes owned by the current user.
 * This keeps the tag color globally consistent.
 */
export const updateTagColor = mutation({
  args: {
    tagName: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non autenticato");

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    for (const note of notes) {
      if (!note.tags?.includes(args.tagName)) continue;
      const existing = note.tagColors ?? [];
      await ctx.db.patch(note._id, {
        tagColors: [
          ...existing.filter((c) => c.name !== args.tagName),
          { name: args.tagName, color: args.color },
        ],
      });
    }
  },
});
