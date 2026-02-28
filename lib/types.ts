/**
 * Shared document types derived from the Convex schema.
 * These mirror what Convex generates in _generated/dataModel.ts once
 * `npx convex dev` is run.
 */
import type { Id } from "@/convex/_generated/dataModel";

export interface NoteDoc {
  _id: Id<"notes">;
  _creationTime: number;
  ownerId: Id<"users">;
  title: string;
  text: string;
  status: "idle" | "active" | "completed";
  startDate?: number;
  dueDate?: number;
  tags?: string[];
  tagColors?: Array<{ name: string; color: string }>;
  parentTaskId?: Id<"tasks">;
  createdAt: number;
  updatedAt: number;
}

export interface TaskDoc {
  _id: Id<"tasks">;
  _creationTime: number;
  ownerId: Id<"users">;
  title: string;
  text: string;
  status: "idle" | "active" | "completed";
  startDate?: number;
  dueDate?: number;
  linkedNoteIds: Id<"notes">[];
  aiProposals?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface UserDoc {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  name?: string;
  avatarUrl?: string;
  authProvider: "email" | "google";
  privacyAcceptedAt: number;
  privacyPolicyVersion: string;
  marketingConsent: boolean;
  marketingConsentUpdatedAt?: number;
  registeredAt: number;
  lastActiveAt?: number;
  ipHash?: string;
  userAgent?: string;
  isDeleted: boolean;
  deletionRequestedAt?: number;
  deletionScheduledAt?: number;
}
