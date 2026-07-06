import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>Last updated: {new Date().toLocaleDateString()}</p>

        <div className="glass-panel" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>1. Data Collection</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
            When you use ContentMultiplier, we collect the YouTube URLs you provide and any writing samples you input to process your requests. We do not permanently store your Voice Clone samples or the generated content on our servers after the request is fulfilled.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>2. How We Use Your Data</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
            The data you provide is solely used in real-time to generate your personalized Content Pack via third-party AI APIs (such as Google Gemini). We do not use your personal writing samples to train our own models.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>3. Third-Party Services</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
            We use third-party services to extract transcripts and generate AI content. These services have their own privacy policies. We are not responsible for the privacy practices of these external providers.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>4. Security</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0', lineHeight: 1.7 }}>
            We value your trust in providing us your Data, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>
        </div>
      </div>
    </div>
  );
}
