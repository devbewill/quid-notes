export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-2xl mx-auto px-6 py-12">
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
            <li>
              Uploading illegal content or content that violates third-party
              rights.
            </li>
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
            availability, particularly for free-tier plans. No minimum service
            level (SLA) is guaranteed.
          </p>

          <h2>5. Account Suspension and Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts in the event
            of a breach of these Terms, abusive use of the service, or
            activities that harm other users or QUID S.r.l.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the extent permitted by applicable law, QUID S.r.l. is not liable
            for indirect, consequential damages or data loss arising from the
            use of the service. Maximum liability is limited to the amount, if
            any, paid by the user in the preceding 12 months.
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
            <a href="mailto:info@syntheticmess.xyz" className="text-accent">
              info@syntheticmess.xyz
            </a>
          </p>
        </article>
      </div>
    </div>
  );
}
