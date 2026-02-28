import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Inserts ~20 demo notes + 5 tasks for the authenticated user.
 * Call once from the UI "Aggiungi dati demo" button.
 */
export const seedDemoData = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non autenticato");

    const now = Date.now();
    const d = 86_400_000; // ms per day

    const notes = [
      { title: "Redesign homepage", text: "Aggiornare hero section, palette colori e CTA principale. Testare su mobile.", tags: ["design"], status: "active" as const, startDate: now - 5 * d, dueDate: now + 10 * d },
      { title: "Aggiornare dipendenze NPM", text: "Verificare breaking changes in React 19 e Next.js 15. Priorità: convex, framer-motion.", tags: ["dev"], status: "idle" as const, startDate: now - 2 * d },
      { title: "Campagna email Q1", text: "Strutturare la sequenza di onboarding: 5 email, cadenza settimanale. Oggetto A/B test.", tags: ["marketing"], status: "idle" as const, dueDate: now + 20 * d },
      { title: "Revisione contratto fornitore", text: "Clausole da rivedere: SLA, penali e rinnovo automatico. Coinvolgere legal.", tags: ["legal", "client"], status: "idle" as const, startDate: now - 3 * d },
      { title: "Call con cliente Rossi", text: "Demo del nuovo modulo report. Preparare slide e walkthrough interattivo.", tags: ["meeting", "client"], status: "completed" as const, startDate: now - 7 * d },
      { title: "Bug login mobile Safari", text: "Il token JWT non viene mantenuto su Safari iOS 17. Investigare localStorage vs cookie.", tags: ["dev"], status: "active" as const, startDate: now - 1 * d },
      { title: "Nuova palette colori brand", text: "Primario: violet-500, Secondario: amber-400. Definire scala grigio e semantici error/warning.", tags: ["design"], status: "idle" as const, startDate: now },
      { title: "Report mensile vendite", text: "Consolidare: MRR, churn rate, NPS Q4. Deadline: fine mese.", tags: ["marketing"], status: "active" as const, dueDate: now + 5 * d },
      { title: "Setup Google Analytics 4", text: "Configurare eventi conversione, funnels e dashboard personalizzata con Looker Studio.", tags: ["dev", "marketing"], status: "idle" as const, startDate: now + 2 * d },
      { title: "Bozza proposta commerciale", text: "Offerta Enterprise: includere pricing tier, SLA, supporto 24h e clausole di exit.", tags: ["client"], status: "active" as const, dueDate: now + 7 * d },
      { title: "Audit UX dashboard admin", text: "Identificare friction points nel flusso creazione report. Heatmaps con Hotjar.", tags: ["design", "dev"], status: "idle" as const, startDate: now - 4 * d },
      { title: "Follow-up preventivo inviato", text: "Sollecitare risposta al preventivo del 12 feb. Scadenza accettazione: fine settimana.", tags: ["client"], status: "idle" as const, dueDate: now + 3 * d },
      { title: "Documentazione API v2", text: "Swagger + esempi curl per tutti gli endpoint REST. Includere autenticazione OAuth2.", tags: ["dev"], status: "idle" as const, startDate: now - 1 * d },
      { title: "Raccolta feedback utenti beta", text: "Typeform inviato a 50 utenti. Analizzare risposte entro venerdì, prioritizzare issues.", tags: ["design", "meeting"], status: "idle" as const, dueDate: now + 4 * d },
      { title: "Piano contenuti social aprile", text: "Calendario editoriale: 3 post/sett su LinkedIn e Instagram. Topics: prodotto, team, case study.", tags: ["marketing"], status: "idle" as const, dueDate: now + 15 * d },
      { title: "Migrazione DB a Postgres", text: "Piano migrazione da SQLite. Step: schema, ETL, cutover, rollback plan.", tags: ["dev"], status: "idle" as const, startDate: now + 5 * d },
      { title: "Onboarding nuovo designer", text: "Accessi, walkthrough design system, prime task assegnate, check-in day 5.", tags: ["meeting", "design"], status: "idle" as const, startDate: now + 1 * d },
      { title: "Benchmark competitor Q1", text: "Analisi funzionalità e pricing di 5 competitor diretti. Output: slide executive.", tags: ["marketing", "client"], status: "completed" as const, startDate: now - 10 * d },
    ];

    for (const n of notes) {
      await ctx.db.insert("notes", {
        ownerId: userId,
        title: n.title,
        text: n.text,
        status: n.status,
        tags: n.tags,
        startDate: n.startDate ?? now,
        dueDate: n.dueDate,
        createdAt: now,
        updatedAt: now,
      });
    }

    const tasks = [
      { title: "Sprint Q1 Development", text: "Goal: modulo report, fix bug mobile, aggiornamento deps. Due: fine marzo.", status: "active" as const, startDate: now - 14 * d, dueDate: now + 16 * d },
      { title: "Rebrand 2024", text: "Rinnovare identità visiva completa: logo, palette, typography, motion system.", status: "idle" as const, startDate: now - 3 * d, dueDate: now + 60 * d },
      { title: "Onboarding cliente ABC", text: "Setup ambiente, formazione team cliente, integrazione CRM e primo report.", status: "active" as const, startDate: now - 5 * d, dueDate: now + 25 * d },
      { title: "Release v2.0", text: "Feature gate, QA completo, release notes, comunicazione a tutti gli utenti.", status: "idle" as const, startDate: now + 10 * d, dueDate: now + 45 * d },
      { title: "Budget marketing Q2", text: "Definire allocazione: paid ads, content, eventi, tool e agenzia.", status: "idle" as const, startDate: now + 2 * d, dueDate: now + 30 * d },
    ];

    for (const t of tasks) {
      await ctx.db.insert("tasks", {
        ownerId: userId,
        title: t.title,
        text: t.text,
        status: t.status,
        linkedNoteIds: [],
        startDate: t.startDate ?? now,
        dueDate: t.dueDate,
        createdAt: now,
        updatedAt: now,
      });
    }

    return `✅ Inseriti ${notes.length} note e ${tasks.length} task demo.`;
  },
});
