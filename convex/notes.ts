import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib/auth";

/** Top-level notes: parentTaskId is absent (undefined). */
export const listTopLevel = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query("notes")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withIndex("by_owner_and_parent", (q: any) =>
        q.eq("ownerId", user._id).eq("parentTaskId", undefined)
      )
      .order("desc")
      .collect();
  },
});

/** Child notes nested under a specific task. */
export const listByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query("notes")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withIndex("by_owner_and_parent", (q: any) =>
        q.eq("ownerId", user._id).eq("parentTaskId", args.taskId)
      )
      .collect();
  },
});

/** Create a top-level note with status idle. */
export const create = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    startDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const now = Date.now();
    return ctx.db.insert("notes", {
      ownerId: user._id,
      title: args.title,
      text: args.text,
      status: "idle",
      startDate: args.startDate,
      dueDate: args.dueDate,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Update a note's fields. Verifies ownership. */
export const update = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    text: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("idle"),
        v.literal("active"),
        v.literal("completed")
      )
    ),
    startDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const note = await ctx.db.get(args.noteId);
    if (!note || note.ownerId !== user._id) throw new Error("FORBIDDEN");

    const { noteId, ...fields } = args;
    await ctx.db.patch(noteId, { ...fields, updatedAt: Date.now() });
  },
});

/** Delete a note. Verifies ownership. */
export const remove = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const note = await ctx.db.get(args.noteId);
    if (!note || note.ownerId !== user._id) throw new Error("FORBIDDEN");
    await ctx.db.delete(args.noteId);
  },
});
