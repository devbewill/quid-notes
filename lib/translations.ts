export const translations = {
  it: {
    // Consent banner
    consent_message:
      "QUID utilizza solo cookie di sessione essenziali. Nessun tracciamento, nessuna pubblicità.",
    consent_accept: "Ho capito",
    consent_privacy_link: "Informativa sulla Privacy",

    // Account menu
    account_section: "Account",
    account_edit_profile: "Modifica profilo",
    account_change_password: "Cambia password",
    account_marketing_label: "Email promozionali",
    account_sign_out: "Esci",
    account_save: "Salva",
    account_cancel: "Annulla",
    account_name_placeholder: "Il tuo nome",

    // Data & Privacy section
    privacy_section: "Dati e Privacy",
    privacy_export: "Esporta i miei dati",
    privacy_policy_link: "Informativa sulla Privacy",
    terms_link: "Termini di Servizio",

    // Danger zone
    danger_zone_section: "Zona pericolosa",
    danger_zone_delete: "Elimina il mio account",

    // Delete modal
    delete_modal_title: "Eliminare il tuo account?",
    delete_modal_desc:
      "Tutte le tue note e attività saranno eliminate definitivamente entro 30 giorni. Puoi annullare l'operazione entro questa finestra.",
    delete_modal_type_hint: 'Digita "ELIMINA" per confermare:',
    delete_modal_confirm_word: "ELIMINA",
    delete_modal_confirm_btn: "Conferma eliminazione",
    delete_modal_cancel_btn: "Annulla",

    // Export button
    export_btn: "Esporta i miei dati",
    export_loading: "Esportazione in corso…",

    // Feed
    feed_col_title: "Titolo",
    feed_col_type: "Tipo",
    feed_col_status: "Stato",
    feed_col_start: "Inizio",
    feed_col_due: "Scadenza",
    feed_empty: "Nessuna nota o attività. Inizia aggiungendone una.",

    // QuickAdd
    quickadd_placeholder: "+ Aggiungi una nota o attività…",
    quickadd_title_placeholder: "Titolo",
    quickadd_text_placeholder: "Descrizione",
    quickadd_start_placeholder: "Data inizio",
    quickadd_due_placeholder: "Data scadenza",
    quickadd_submit: "Aggiungi",

    // Activate bar / modal
    activate_notes_selected: "note selezionate",
    activate_note_selected: "nota selezionata",
    activate_clear: "Cancella",
    activate_btn: "ATTIVA",
    activate_modal_title: "ATTIVA",
    activate_tab_manual: "Manuale",
    activate_tab_ai: "AI (Gemini)",
    activate_task_title_placeholder: "Titolo dell'attività",
    activate_task_desc_placeholder: "Descrizione (opzionale)",
    activate_create_task: "Crea Attività",
    activate_analyze: "Analizza con AI",
    activate_analyzing: "Analisi in corso…",
    activate_ai_hint: "Note selezionate:",
    activate_ai_pick: "Seleziona una proposta",

    // Locale toggle
    locale_it: "IT",
    locale_en: "EN",

    // Auth
    auth_registered_via: "Registrato tramite",
    auth_email: "email",
    auth_google: "Google",
  },
  en: {
    // Consent banner
    consent_message:
      "QUID uses only essential session cookies. No tracking, no ads.",
    consent_accept: "Got it",
    consent_privacy_link: "Privacy Policy",

    // Account menu
    account_section: "Account",
    account_edit_profile: "Edit profile",
    account_change_password: "Change password",
    account_marketing_label: "Marketing emails",
    account_sign_out: "Sign out",
    account_save: "Save",
    account_cancel: "Cancel",
    account_name_placeholder: "Your name",

    // Data & Privacy section
    privacy_section: "Data & Privacy",
    privacy_export: "Export my data",
    privacy_policy_link: "Privacy Policy",
    terms_link: "Terms of Service",

    // Danger zone
    danger_zone_section: "Danger Zone",
    danger_zone_delete: "Delete my account",

    // Delete modal
    delete_modal_title: "Delete your account?",
    delete_modal_desc:
      "All your notes and tasks will be permanently deleted within 30 days. You can cancel this within the window.",
    delete_modal_type_hint: 'Type "DELETE" to confirm:',
    delete_modal_confirm_word: "DELETE",
    delete_modal_confirm_btn: "Confirm deletion",
    delete_modal_cancel_btn: "Cancel",

    // Export button
    export_btn: "Export my data",
    export_loading: "Exporting…",

    // Feed
    feed_col_title: "Title",
    feed_col_type: "Type",
    feed_col_status: "Status",
    feed_col_start: "Start",
    feed_col_due: "Due",
    feed_empty: "No notes or tasks yet. Start by adding one.",

    // QuickAdd
    quickadd_placeholder: "+ Add a note or task…",
    quickadd_title_placeholder: "Title",
    quickadd_text_placeholder: "Description",
    quickadd_start_placeholder: "Start date",
    quickadd_due_placeholder: "Due date",
    quickadd_submit: "Add",

    // Activate bar / modal
    activate_notes_selected: "notes selected",
    activate_note_selected: "note selected",
    activate_clear: "Clear",
    activate_btn: "ACTIVATE",
    activate_modal_title: "ACTIVATE",
    activate_tab_manual: "Manual",
    activate_tab_ai: "AI (Gemini)",
    activate_task_title_placeholder: "Task title",
    activate_task_desc_placeholder: "Description (optional)",
    activate_create_task: "Create Task",
    activate_analyze: "Analyze with AI",
    activate_analyzing: "Analyzing…",
    activate_ai_hint: "Selected notes:",
    activate_ai_pick: "Select a proposal",

    // Locale toggle
    locale_it: "IT",
    locale_en: "EN",

    // Auth
    auth_registered_via: "Registered via",
    auth_email: "email",
    auth_google: "Google",
  },
} as const;

export type TranslationKey = keyof typeof translations.it;
export type Locale = keyof typeof translations;
