"use client";

import { useState } from "react";
import type { Locale } from "@/lib/translations";

const content: Record<Locale, React.ReactNode> = {
  it: (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>Termini di Servizio</h1>
      <p className="text-muted text-xs">Versione: 2026-01-01</p>

      <h2>1. Idoneità</h2>
      <p>
        Per utilizzare QUID devi avere almeno 16 anni (art. 8 GDPR). Creando un
        account, dichiari di soddisfare questo requisito.
      </p>

      <h2>2. Uso accettabile</h2>
      <p>È vietato:</p>
      <ul>
        <li>Inserire contenuti illegali o che violino diritti di terzi.</li>
        <li>Condividere le proprie credenziali di accesso.</li>
        <li>Tentare di accedere ai dati di altri utenti.</li>
        <li>Usare il servizio per attività di spam o abuso.</li>
      </ul>

      <h2>3. Proprietà intellettuale</h2>
      <p>
        I contenuti che inserisci in QUID (note, attività) sono di tua esclusiva
        proprietà. QUID S.r.l. non rivendica alcun diritto sui tuoi contenuti.
        Ci concedi una licenza limitata per elaborare e archiviare i dati al
        solo scopo di erogare il servizio.
      </p>

      <h2>4. Disponibilità del servizio</h2>
      <p>
        QUID è fornito &quot;così com&apos;è&quot;, senza garanzie di
        disponibilità continua, in particolare per i piani gratuiti. Non viene
        garantito alcun livello minimo di servizio (SLA).
      </p>

      <h2>5. Sospensione e chiusura dell&apos;account</h2>
      <p>
        Ci riserviamo il diritto di sospendere o chiudere account in caso di
        violazione dei presenti Termini, uso abusivo del servizio, o attività
        che arrechino danno ad altri utenti o a QUID S.r.l.
      </p>

      <h2>6. Limitazione di responsabilità</h2>
      <p>
        Nei limiti consentiti dalla legge applicabile, QUID S.r.l. non è
        responsabile per danni indiretti, consequenziali o perdita di dati
        derivanti dall&apos;uso del servizio. La responsabilità massima è
        limitata all&apos;importo eventualmente pagato dall&apos;utente negli
        ultimi 12 mesi.
      </p>

      <h2>7. Legge applicabile e foro competente</h2>
      <p>
        I presenti Termini sono regolati dalla legge italiana e dal diritto
        dell&apos;Unione Europea. Per qualsiasi controversia è competente il
        Tribunale di Milano (Italia).
      </p>

      <h2>8. Contatti</h2>
      <p>
        Per domande sui Termini di Servizio:{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>
      </p>
    </article>
  ),
  en: (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-muted text-xs">Version: 2026-01-01</p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 16 years old to use QUID (GDPR Art. 8). By
        creating an account, you confirm that you meet this requirement.
      </p>

      <h2>2. Acceptable Use</h2>
      <p>The following are prohibited:</p>
      <ul>
        <li>Uploading illegal content or content that violates third-party rights.</li>
        <li>Sharing your login credentials with others.</li>
        <li>Attempting to access another user&apos;s data.</li>
        <li>Using the service for spam or abusive activities.</li>
      </ul>

      <h2>3. Intellectual Property</h2>
      <p>
        The content you create in QUID (notes, tasks) is solely yours. QUID
        S.r.l. claims no ownership over your content. You grant us a limited
        licence to process and store your data solely for the purpose of
        delivering the service.
      </p>

      <h2>4. Service Availability</h2>
      <p>
        QUID is provided &quot;as is&quot;, with no guarantee of continuous
        availability, particularly for free-tier plans. No minimum service level
        (SLA) is guaranteed.
      </p>

      <h2>5. Account Suspension and Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts in the event of a
        breach of these Terms, abusive use of the service, or activities that
        harm other users or QUID S.r.l.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the extent permitted by applicable law, QUID S.r.l. is not liable
        for indirect, consequential damages or data loss arising from the use of
        the service. Maximum liability is limited to the amount, if any, paid by
        the user in the preceding 12 months.
      </p>

      <h2>7. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by Italian law and European Union law. Any
        disputes shall be subject to the jurisdiction of the Court of Milan
        (Italy).
      </p>

      <h2>8. Contact</h2>
      <p>
        For questions about these Terms:{" "}
        <a href="mailto:privacy@quid.app" className="text-accent">
          privacy@quid.app
        </a>
      </p>
    </article>
  ),
};

export default function TermsPage() {
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
