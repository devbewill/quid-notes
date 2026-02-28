import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib/auth";

/** Create a standalone task directly (no linked notes). */
export const createDirect = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    startDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const now = Date.now();
    return ctx.db.insert("tasks", {
      ownerId: user._id,
      title: args.title,
      text: args.text,
      status: "idle",
      linkedNoteIds: [],
      startDate: args.startDate,
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** All tasks for the authenticated user. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query("tasks")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
  },
});

/**
 * Create a task from selected notes.
 * Atomically: inserts the task, then sets parentTaskId on each linked note.
 * The notes disappear from the top-level feed and appear as Level 2 children.
 */
export const createFromNotes = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    linkedNoteIds: v.array(v.id("notes")),
    startDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const now = Date.now();

    // Verify all linked notes belong to the current user and are top-level
    for (const noteId of args.linkedNoteIds) {
      const note = await ctx.db.get(noteId);
      if (!note || note.ownerId !== user._id) throw new Error("FORBIDDEN");
      if (note.parentTaskId !== undefined)
        throw new Error("NOTE_ALREADY_LINKED");
    }

    const taskId = await ctx.db.insert("tasks", {
      ownerId: user._id,
      title: args.title,
      text: args.text,
      status: "active",
      linkedNoteIds: args.linkedNoteIds,
      startDate: args.startDate,
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });

    // Link notes to the new task — moves them from Level 1 to Level 2
    for (const noteId of args.linkedNoteIds) {
      await ctx.db.patch(noteId, { parentTaskId: taskId, updatedAt: now });
    }

    return taskId;
  },
});

/**
 * Delete a task and restore its linked notes to the top-level feed.
 * NEVER deletes the notes — only clears their parentTaskId.
 */
export const deleteAndRestoreNotes = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task || task.ownerId !== user._id) throw new Error("FORBIDDEN");

    const now = Date.now();

    // Restore linked notes to top-level
    for (const noteId of task.linkedNoteIds) {
      const note = await ctx.db.get(noteId);
      if (note && note.ownerId === user._id) {
        await ctx.db.patch(noteId, { parentTaskId: undefined, updatedAt: now });
      }
    }

    await ctx.db.delete(args.taskId);
  },
});

/** Update a task's fields. Verifies ownership. */
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
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
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task || task.ownerId !== user._id) throw new Error("FORBIDDEN");

    const { taskId, ...fields } = args;
    await ctx.db.patch(taskId, { ...fields, updatedAt: Date.now() });
  },
});
