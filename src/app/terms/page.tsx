import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>Last updated: {new Date().toLocaleDateString()}</p>

        <div className="glass-panel" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
            By accessing and using ContentMultiplier, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>2. User Responsibility & Content Generation</h2>
          <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444', borderRadius: '4px', marginBottom: '32px' }}>
            <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '8px' }}>IMPORTANT DISCLAIMER</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
              ContentMultiplier is an AI-powered formatting tool. We do not claim ownership of the content you generate using our service. <strong>It is your sole responsibility to ensure that the content you publish to your personal accounts, blogs, or social media platforms does not violate any copyright laws, platform terms of service, or community guidelines.</strong> We take no responsibility for copyright strikes, plagiarism claims, or account bans that may arise from your use of the generated content.
            </p>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>3. Prohibited Uses</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
            You may not use our service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>4. Termination</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0', lineHeight: 1.7 }}>
            We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
