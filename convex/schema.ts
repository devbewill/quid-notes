import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    // Identity
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    authProvider: v.union(v.literal("email"), v.literal("google")),

    // Consent & compliance
    privacyAcceptedAt: v.number(), // Unix ms — required at registration
    privacyPolicyVersion: v.string(), // e.g. "2024-01-01" — for re-consent tracking
    marketingConsent: v.boolean(),
    marketingConsentUpdatedAt: v.optional(v.number()),

    // Technical (privacy-safe: hashed, not raw)
    registeredAt: v.number(),
    lastActiveAt: v.optional(v.number()),
    ipHash: v.optional(v.string()), // SHA-256 hex of IP address
    userAgent: v.optional(v.string()),

    // Account state
    isDeleted: v.boolean(),
    deletionRequestedAt: v.optional(v.number()),
    deletionScheduledAt: v.optional(v.number()), // registeredAt + 30 days
  }).index("by_email", ["email"]),

  notes: defineTable({
    ownerId: v.id("users"),
    title: v.string(),
    text: v.string(),
    status: v.union(
      v.literal("idle"),
      v.literal("active"),
      v.literal("completed")
    ),
    startDate: v.optional(v.number()), // Unix ms
    dueDate: v.optional(v.number()), // Unix ms
    // undefined = top-level note; set = child note linked to a task
    parentTaskId: v.optional(v.id("tasks")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_and_parent", ["ownerId", "parentTaskId"]),

  tasks: defineTable({
    ownerId: v.id("users"),
    title: v.string(),
    text: v.string(),
    status: v.union(
      v.literal("idle"),
      v.literal("active"),
      v.literal("completed")
    ),
    startDate: v.optional(v.number()), // Unix ms
    dueDate: v.optional(v.number()), // Unix ms
    linkedNoteIds: v.array(v.id("notes")), // source notes (can be empty)
    aiProposals: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),
});
