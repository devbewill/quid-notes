import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Returns the authenticated user or throws.
 * Throws: UNAUTHENTICATED | ACCOUNT_DELETED
 * Use this in every query/mutation that touches notes or tasks.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("UNAUTHENTICATED");
  }

  const user = await ctx.db.get(userId);
  if (user === null) {
    throw new Error("UNAUTHENTICATED");
  }

  if (user.isDeleted) {
    throw new Error("ACCOUNT_DELETED");
  }

  return user;
}
