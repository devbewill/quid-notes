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
  isPinned?: boolean;
  deletedAt?: number;
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
  isPinned?: boolean;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
}

