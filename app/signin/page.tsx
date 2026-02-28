"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (flow === "signUp" && !privacyAccepted) {
      setError("Devi accettare l'Informativa sulla Privacy per continuare.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn("password", { email, password, name, flow });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di autenticazione");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => signIn("google");

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">QUID</h1>
        <p className="text-sm text-muted mb-8">Potential noted. Action defined.</p>

        {/* Tab */}
        <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1">
          {(["signIn", "signUp"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFlow(f); setError(null); }}
              className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${
                flow === f ? "bg-bg text-text font-medium" : "text-muted"
              }`}
            >
              {f === "signIn" ? "Accedi" : "Registrati"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {flow === "signUp" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome (opzionale)"
              className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
          />

          {/* Consent checkboxes — sign up only */}
          {flow === "signUp" && (
            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  required
                  className="mt-0.5 accent-accent"
                />
                <span>
                  Ho letto e accetto l&apos;{" "}
                  <Link href="/privacy" target="_blank" className="text-accent underline">
                    Informativa sulla Privacy
                  </Link>{" "}
                  e i{" "}
                  <Link href="/terms" target="_blank" className="text-accent underline">
                    Termini di Servizio
                  </Link>
                  . *
                </span>
              </label>
              <label className="flex items-start gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 accent-accent"
                />
                <span>Accetto di ricevere aggiornamenti sul prodotto via email.</span>
              </label>
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-bg font-medium rounded-full py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "…" : flow === "signIn" ? "Accedi" : "Crea account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted">oppure</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-border text-text text-sm rounded-full py-2.5 hover:bg-surface transition-colors"
        >
          Continua con Google
        </button>
      </div>
    </div>
  );
}
