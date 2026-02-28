import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Google],
  callbacks: {
    // NOTE: return type is explicitly cast to satisfy @convex-dev/auth's Id<"users">
    // expectation while working around the generic ctx types in the stub _generated/server.
    // eslint-disable-next-line @typescript-eslint/require-await
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId !== undefined) {
        // Returning user — refresh last active timestamp
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (ctx.db as any).patch(args.existingUserId, {
          lastActiveAt: Date.now(),
        });
        return args.existingUserId;
      }

      // New registration — frontend consent form must be shown before this is called
      const profile = args.profile as {
        email?: string;
        name?: string;
        image?: string;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = await (ctx.db as any).insert("users", {
        email: profile.email ?? "",
        name: profile.name ?? undefined,
        avatarUrl: profile.image ?? undefined,
        authProvider: args.provider.id === "google" ? "google" : "email",
        // NOTE: privacyAcceptedAt is set to now; the frontend consent checkbox
        // enforces that the user has accepted before calling signIn.
        privacyAcceptedAt: Date.now(),
        privacyPolicyVersion: "2026-01-01",
        marketingConsent: false,
        registeredAt: Date.now(),
        isDeleted: false,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return userId;
    },
  },
});
