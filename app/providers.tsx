"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { LocaleProvider } from "@/hooks/useLocale";
import type { ReactNode } from "react";
import { Suspense } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ConvexAuthProvider client={convex}>
        <LocaleProvider>{children}</LocaleProvider>
      </ConvexAuthProvider>
    </Suspense>
  );
}
