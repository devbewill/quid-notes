"use client";

import { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, X, Mail, Lock, User, AlertCircle, Shield, Trash2, LogOut } from "lucide-react";

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

  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip");
  const deletionStatus = useQuery(api.users.getDeletionStatus, isAuthenticated ? {} : "skip");
  const cancelDeletion = useMutation(api.users.cancelDeletion);
  const hardDelete = useMutation(api.users.hardDeleteImmediate);

  // Redirect to home if authenticated, user doc exists, and not pending deletion
  // Wait for isLoading to be false to ensure user doc is created
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !deletionStatus) {
      console.log("Redirecting authenticated user to home...");
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, deletionStatus, router]);

  // Force page reload if authenticated but user doc not ready
  // This triggers the second refreshSession that Convex needs
  useEffect(() => {
    if (!isLoading && isAuthenticated && !user && !deletionStatus) {
      console.log("User authenticated but doc not ready, forcing reload...");
      // Force a full page reload to trigger second refreshSession
      const timeout = setTimeout(() => {
        console.log("Executing forced reload...");
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isAuthenticated, user, deletionStatus]);

  // Additional safeguard: if on signin page and authenticated, force redirect
  useEffect(() => {
    const checkAuth = () => {
      if (!isLoading && isAuthenticated && user && !deletionStatus) {
        console.log("Forcing redirect from signin to home...");
        window.location.href = "/";
      }
    };

    // Check after a delay to catch delayed auth updates
    const timeout1 = setTimeout(checkAuth, 500);
    const timeout2 = setTimeout(checkAuth, 1000);
    const timeout3 = setTimeout(checkAuth, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [isLoading, isAuthenticated, user, deletionStatus]);

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

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Force signOut before signIn to ensure clean session
      try {
        await signOut();
      } catch (e) {
        // Ignore if not signed in
      }
      // Small delay to ensure session is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      await signIn("google");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di autenticazione");
    } finally {
      setLoading(false);
    }
  };

  // Force a second auth check after Google OAuth
  useEffect(() => {
    if (isAuthenticated && user && !deletionStatus) {
      // Force a second check to trigger refreshSession
      const timer = setTimeout(() => {
        window.location.reload();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, deletionStatus]);

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

  // If user is authenticated but user doc is not ready (during OAuth setup)
  if (isAuthenticated && !user && !deletionStatus) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10 text-center"
        >
          <div className="w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <h1 className="font-black text-3xl tracking-tighter text-white uppercase mb-4">
            Setting up your account...
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Please wait while we complete your registration.
          </p>
          <button
            onClick={() => void signOut()}
            className="text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-wider"
          >
            Cancel and go back
          </button>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && deletionStatus) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-12">
            <Shield className="w-20 h-20 mx-auto mb-6 text-violet-500" />
            <h1 className="font-black text-4xl tracking-tighter text-white uppercase mb-4">
              Account in<br/>Eliminazione
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Il tuo account è attualmente programmato per l'eliminazione definitiva il{" "}
              <span className="text-white font-medium">
                {deletionStatus.deletionScheduledAt ? new Date(deletionStatus.deletionScheduledAt).toLocaleDateString() : "presto"}
              </span>
              .
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={handleRestore}
              disabled={loading}
              className="group w-full bg-violet-600 text-white font-black text-lg uppercase tracking-widest px-6 py-4 hover:bg-violet-500 transition-all border-2 border-transparent hover:border-violet-400 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              {loading ? "…" : "Recupera il mio account"} <Shield className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleHardDelete}
              disabled={loading}
              className="w-full bg-rose-500/10 text-rose-500 font-bold text-sm uppercase tracking-wider px-6 py-4 border-2 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? "…" : "Elimina ORA (Test Wipe)"} <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => void signOut().then(() => setFlow("signIn"))}
              className="w-full border-2 border-zinc-800 text-zinc-400 font-bold text-sm uppercase tracking-wider px-6 py-4 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" /> Esci
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]" />
      
      <div className="absolute top-6 left-6">
        <Link href="/landing-page" className="text-zinc-600 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">
          ← Torna alla Landing
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="font-black text-[12vw] leading-none tracking-tighter text-white uppercase mb-2">
            QUID
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
            Notes evolve. Tasks resolve.
          </p>
        </div>

        <div className="flex gap-2 mb-8 bg-[#0a0a0f] border border-zinc-800 p-1.5">
          {(["signIn", "signUp"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFlow(f); setError(null); }}
              className={`flex-1 py-3 font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                flow === f
                  ? "bg-violet-600 text-white shadow-[2px_2px_0_0_#000]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f === "signIn" ? "Accedi" : "Registrati"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {flow === "signUp" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome (opzionale)"
                className="w-full bg-[#0a0a0f] border-2 border-zinc-800 rounded-none px-12 py-4 text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors font-mono text-sm"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-[#0a0a0f] border-2 border-zinc-800 rounded-none px-12 py-4 text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors font-mono text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-[#0a0a0f] border-2 border-zinc-800 rounded-none px-12 py-4 text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors font-mono text-sm"
            />
          </div>

          {flow === "signUp" && (
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 text-sm text-zinc-400 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  required
                  className="mt-1 w-5 h-5 border-2 border-zinc-700 bg-transparent rounded-none accent-violet-500 checked:border-violet-500"
                />
                <span className="leading-relaxed">
                  Ho letto e accetto l&apos;{" "}
                  <Link href="/privacy" target="_blank" className="text-violet-400 hover:text-violet-300 underline underline-offset-4">
                    Informativa sulla Privacy
                  </Link>{" "}
                  e i{" "}
                  <Link href="/terms" target="_blank" className="text-violet-400 hover:text-violet-300 underline underline-offset-4">
                    Termini di Servizio
                  </Link>
                  .
                  <span className="text-red-500"> *</span>
                </span>
              </label>
              
              <label className="flex items-start gap-3 text-sm text-zinc-400 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 border-2 border-zinc-700 bg-transparent rounded-none accent-violet-500 checked:border-violet-500"
                />
                <span className="leading-relaxed">
                  Accetto di ricevere aggiornamenti sul prodotto via email.
                </span>
              </label>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border-2 border-red-500/30 text-red-400 text-sm flex items-center gap-3 font-mono"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-violet-600 text-white font-black text-lg uppercase tracking-widest px-6 py-4 hover:bg-violet-500 transition-all border-2 border-transparent hover:border-violet-400 shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#fff] hover:-translate-x-1 hover:-translate-y-1 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? "…" : flow === "signIn" ? "Accedi" : "Crea account"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">oppure</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border-2 border-zinc-800 text-white font-bold text-sm uppercase tracking-wider px-6 py-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all flex items-center justify-center gap-3"
        >
          Continua con Google <ArrowRight className="w-4 h-4" />
        </button>

        <div className="mt-12 text-center">
          <Link href="/landing-page" className="text-sm font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
            Scopri QUID Notes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
