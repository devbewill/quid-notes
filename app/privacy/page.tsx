"use client";

import { useState } from "react";
import type { Locale } from "@/lib/translations";

const content: Record<Locale, React.ReactNode> = {
  it: (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>Informativa sulla Privacy</h1>
      <p className="text-muted text-xs">Versione: 2026-01-01</p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        QUID S.r.l., Via Example 1, 20100 Milano (MI), Italia.
        <br />
        Email:{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>
      </p>

      <h2>2. Dati raccolti</h2>
      <ul>
        <li>
          <strong>Dati account:</strong> indirizzo email, nome (opzionale), foto
          profilo Google (se si utilizza OAuth).
        </li>
        <li>
          <strong>Contenuti:</strong> note, attività, date di creazione e modifica.
        </li>
        <li>
          <strong>Dati tecnici:</strong> indirizzo IP (in forma anonimizzata —
          hash SHA-256), user-agent, token di sessione.
        </li>
      </ul>

      <h2>3. Base giuridica (art. 6 GDPR)</h2>
      <ul>
        <li>
          <strong>Art. 6.1.b — esecuzione del contratto:</strong> gestione
          dell&apos;account, erogazione del servizio principale.
        </li>
        <li>
          <strong>Art. 6.1.f — interesse legittimo:</strong> sicurezza,
          prevenzione abusi.
        </li>
        <li>
          <strong>Art. 6.1.a — consenso:</strong> comunicazioni promozionali
          via email (opzionale, revocabile in qualsiasi momento).
        </li>
      </ul>

      <h2>4. Conservazione dei dati</h2>
      <ul>
        <li>
          <strong>Account attivo:</strong> i dati sono conservati fino alla
          richiesta di cancellazione.
        </li>
        <li>
          <strong>Account cancellato:</strong> tutti i dati personali vengono
          eliminati entro 30 giorni dalla richiesta.
        </li>
        <li>
          Eventuali statistiche aggregate anonimizzate possono essere conservate
          a tempo indeterminato.
        </li>
      </ul>

      <h2>5. Diritti degli interessati (artt. 15–22 GDPR)</h2>
      <p>Hai diritto a:</p>
      <ul>
        <li>Accesso ai tuoi dati (art. 15)</li>
        <li>Rettifica (art. 16)</li>
        <li>Cancellazione (&quot;diritto all&apos;oblio&quot;, art. 17)</li>
        <li>Portabilità (art. 20)</li>
        <li>Limitazione del trattamento (art. 18)</li>
        <li>Opposizione (art. 21)</li>
      </ul>
      <p>
        Puoi esercitare questi diritti scrivendo a{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>{" "}
        oppure direttamente dall&apos;app tramite il menu Account.
      </p>

      <h2>6. Responsabili del trattamento</h2>
      <ul>
        <li>
          <strong>Convex, Inc.</strong> (USA) — database e funzioni serverless,
          sulla base delle clausole contrattuali standard UE.
        </li>
        <li>
          <strong>Google LLC</strong> — solo se si utilizza l&apos;accesso
          tramite Google OAuth.
        </li>
      </ul>

      <h2>7. Cookie</h2>
      <p>
        QUID utilizza esclusivamente cookie di sessione essenziali per il
        funzionamento del servizio. Non vengono utilizzati cookie di tracciamento,
        profilazione o pubblicità di terze parti.
      </p>

      <h2>8. Cessione dei dati</h2>
      <p>
        I tuoi dati non vengono mai venduti a terzi.
      </p>

      <h2>9. Contatti</h2>
      <p>
        Per qualsiasi richiesta relativa alla privacy:{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>
      </p>
    </article>
  ),
  en: (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-muted text-xs">Version: 2026-01-01</p>

      <h2>1. Data Controller</h2>
      <p>
        QUID S.r.l., Via Example 1, 20100 Milano (MI), Italy.
        <br />
        Email:{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>
      </p>

      <h2>2. Data Collected</h2>
      <ul>
        <li>
          <strong>Account data:</strong> email address, name (optional), Google
          profile picture (if using OAuth).
        </li>
        <li>
          <strong>Content:</strong> notes, tasks, creation and modification dates.
        </li>
        <li>
          <strong>Technical data:</strong> IP address (anonymised — SHA-256
          hash), user-agent, session tokens.
        </li>
      </ul>

      <h2>3. Legal Basis (Art. 6 GDPR)</h2>
      <ul>
        <li>
          <strong>Art. 6.1.b — contract performance:</strong> account management,
          core service delivery.
        </li>
        <li>
          <strong>Art. 6.1.f — legitimate interest:</strong> security, abuse
          prevention.
        </li>
        <li>
          <strong>Art. 6.1.a — consent:</strong> optional marketing emails
          (revocable at any time).
        </li>
      </ul>

      <h2>4. Data Retention</h2>
      <ul>
        <li>
          <strong>Active account:</strong> data retained until deletion request.
        </li>
        <li>
          <strong>Deleted account:</strong> all personal data purged within 30
          days of the deletion request.
        </li>
        <li>
          Anonymised aggregate statistics (if any) may be retained indefinitely.
        </li>
      </ul>

      <h2>5. Your Rights (Arts. 15–22 GDPR)</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your data (Art. 15)</li>
        <li>Rectification (Art. 16)</li>
        <li>Erasure (&quot;right to be forgotten&quot;, Art. 17)</li>
        <li>Portability (Art. 20)</li>
        <li>Restriction of processing (Art. 18)</li>
        <li>Objection (Art. 21)</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>{" "}
        or use the Account menu in the app.
      </p>

      <h2>6. Data Processors</h2>
      <ul>
        <li>
          <strong>Convex, Inc.</strong> (USA) — database and serverless
          functions, under EU standard contractual clauses.
        </li>
        <li>
          <strong>Google LLC</strong> — only when using Google OAuth sign-in.
        </li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        QUID uses only essential session cookies required for the service to
        function. No tracking, profiling, or third-party advertising cookies are
        used.
      </p>

      <h2>8. Data Sales</h2>
      <p>Your data is never sold to third parties.</p>

      <h2>9. Contact</h2>
      <p>
        For any privacy-related enquiry:{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>
      </p>
    </article>
  ),
};

export default function PrivacyPage() {
  const [locale, setLocale] = useState<Locale>("it");

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Language toggle */}
        <div className="flex gap-2 mb-8">
          {(["it", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${
                locale === l
                  ? "border-accent text-accent"
                  : "border-border text-muted hover:text-text"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {content[locale]}
      </div>
    </div>
  );
}
