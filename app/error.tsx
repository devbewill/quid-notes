"use client";

import { useEffect } from "react";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // If it's an account deletion error, redirect to signin to show wipe UI
    if (error.message.includes("ACCOUNT_DELETED")) {
      router.replace("/signin");
    }
  }, [error, router]);

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <Shield className="w-16 h-16 mx-auto mb-6 text-semantic-error opacity-50" />
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Sessione terminata
        </h2>
        <p className="text-text-muted mb-8">
          L&apos;account è in fase di eliminazione o si è verificato un errore critico.
        </p>
        <button
          onClick={() => router.replace("/signin")}
          className="bg-accent-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-accent-secondary transition-colors"
        >
          Torna alla Login
        </button>
      </div>
    </div>
  );
}
