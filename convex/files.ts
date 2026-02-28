import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Returns a pre-signed URL the client can POST a file to. */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non autenticato");
    return await ctx.storage.generateUploadUrl();
  },
});

/** Given a storageId returned by the POST to the upload URL, returns the public URL. */
export const getImageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
