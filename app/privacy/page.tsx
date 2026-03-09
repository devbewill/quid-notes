export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-2xl mx-auto px-6 py-12">
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
              <strong>Account data:</strong> email address, name (optional),
              Google profile picture (if using OAuth).
            </li>
            <li>
              <strong>Content:</strong> notes, tasks, creation and modification
              dates.
            </li>
            <li>
              <strong>Technical data:</strong> IP address (anonymised — SHA-256
              hash), user-agent, session tokens.
            </li>
          </ul>

          <h2>3. Legal Basis (Art. 6 GDPR)</h2>
          <ul>
            <li>
              <strong>Art. 6.1.b — contract performance:</strong> account
              management, core service delivery.
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
              <strong>Active account:</strong> data retained until deletion
              request.
            </li>
            <li>
              <strong>Deleted account:</strong> all personal data purged within
              30 days of the deletion request.
            </li>
            <li>
              Anonymised aggregate statistics (if any) may be retained
              indefinitely.
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
              <strong>Google LLC</strong> — only when using Google OAuth
              sign-in.
            </li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            QUID uses only essential session cookies required for the service to
            function. No tracking, profiling, or third-party advertising cookies
            are used.
          </p>

          <h2>8. Data Sales</h2>
          <p>Your data is never sold to third parties.</p>

          <h2>9. Contact</h2>
          <p>
            For any privacy-related enquiry:{" "}
            <a href="mailto:info@syntheticmess.xyz" className="text-accent">
              info@syntheticmess.xyz
            </a>
          </p>
        </article>
      </div>
    </div>
  );
}
