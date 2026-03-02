"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useConvexAuth();
  const deletionStatus = useQuery(api.users.getDeletionStatus, isAuthenticated ? {} : "skip");
  const cancelDeletion = useMutation(api.users.cancelDeletion);
  const hardDelete = useMutation(api.users.hardDeleteImmediate);

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
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di autenticazione");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => signIn("google").then(() => router.push("/"));

  const handleRestore = async () => {
    setLoading(true);
    try {
      await cancelDeletion();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile recuperare l'account");
    } finally {
      setLoading(false);
    }
  };

  const handleHardDelete = async () => {
    if (!confirm("Sei sicuro? Questa azione distruggerà IMMEDIATAMENTE tutti i tuoi dati, le tue note e il tuo account. L'azione è irreversibile.")) return;
    setLoading(true);
    try {
      await hardDelete();
      await signOut();
      setFlow("signIn");
      setError("Account eliminato con successo. Puoi registrarti di nuovo come nuovo utente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile eliminare l'account");
    } finally {
      setLoading(false);
    }
  };

  // If the user's account is pending deletion, show the recovery UI
  if (isAuthenticated && deletionStatus) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Account in Eliminazione</h1>
          <p className="text-sm text-muted mb-8">
            Il tuo account è attualmente programmato per l&apos;eliminazione definitiva il{" "}
            <span className="text-text font-medium">
              {deletionStatus.deletionScheduledAt ? new Date(deletionStatus.deletionScheduledAt).toLocaleDateString() : "presto"}
            </span>.
          </p>

          {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestore}
              disabled={loading}
              className="w-full bg-accent text-bg font-medium rounded-full py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "…" : "Recupera il mio account"}
            </button>
            <button
              onClick={handleHardDelete}
              disabled={loading}
              className="w-full bg-rose-500/10 text-rose-500 font-medium border border-rose-500/20 rounded-full py-2.5 text-sm hover:bg-rose-500/20 transition-colors disabled:opacity-50"
            >
              {loading ? "…" : "Elimina ORA (Test Wipe)"}
            </button>
            <button
              onClick={() => void signOut().then(() => setFlow("signIn"))}
              className="w-full border border-border text-text text-sm rounded-full py-2.5 hover:bg-surface transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="mt-8 text-center">
          <Link href="/landing" className="text-xs text-muted hover:text-text underline decoration-border underline-offset-4 transition-colors">
            Scopri QUID Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
