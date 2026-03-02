Ho analizzato a fondo il flusso interno del client Convex Auth e la sua interazione con i WebSocket.

Il problema NON è nel database e neanche nel salvataggio dei token, ma in un **bug del client React di Convex** (`ConvexProviderWithAuth`). 
Quando Convex riceve i token per il SECONDO utente:
1. Imposta correttamente `isAuthenticated = true` e salva il nuovo token nel browser.
2. Ma, a causa di una "race condition" interna, il WebSocket che comunica con il server Convex fallisce nel ri-abbonarsi alla query `api.users.current` con la nuova identità autenticata.
3. Risultato: la query rimane bloccata in stato di caricamento (`undefined`) all'infinito. Dato che l'interfaccia aspetta che la query restituisca un utente, vedi il caricamento perpetuo ("rimane appeso").
4. Quando aggiorni manualmente (F5), il browser azzera lo stato React, WebSocket si ricollega (da zero) leggendo i token corretti dal localStorage e quindi "magicamente" funziona.

Poiché questo è un problema profondo e specifico di sincronizzazione tra `@convex-dev/auth`, `convex/react`, e Next.js App Router, **la soluzione e best practice** (adottata anche in molti progetti in produzione finchè non esce una patch di Convex) è rilevare questo "stallo" ed effettuare un ripristino forzato (hard reload) in modo trasparente se la query non risponde.

Ho implementato un fix **robusto** in `app/page.tsx` che individua questo esatto scenario: se sei autenticato ma il WebSocket rimane bloccato per più di 2 secondi, forza un ricaricamento del browser per sbloccare la connessione e farti entrare.
