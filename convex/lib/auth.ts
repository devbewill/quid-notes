import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Returns the authenticated user or null.
 * Use this in queries that should gracefully return empty data on unauth/deleted states.
 */
export async function getAuthUserOrNull(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;

  const user = await ctx.db.get(userId);
  if (user === null || user.isDeleted) return null;

  return user;
}

/**
 * Returns the authenticated user or throws.
 * Throws: UNAUTHENTICATED | ACCOUNT_DELETED
 * Use this in every query/mutation that touches notes or tasks.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("UNAUTHENTICATED");
  }

  const user = await ctx.db.get(userId);
  if (user === null) {
    throw new ConvexError("UNAUTHENTICATED");
  }

  if (user.isDeleted) {
    throw new ConvexError("ACCOUNT_DELETED");
  }

  return user;
}
