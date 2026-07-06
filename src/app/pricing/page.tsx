import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.02em' }}>Plans & Pricing</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '64px', fontSize: '1.1rem' }}>Stop spending 10 hours a week on content. Let AI do it in 30 seconds.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', textAlign: 'left' }}>
          
          {/* Basic Tier */}
          <div className="pricing-card">
            {/* SVG Icon matching Claude's aesthetic */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ marginBottom: '32px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>

            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '-0.02em' }}>Basic</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>For casual creators starting out</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>$4</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', minHeight: '40px' }}>Per month. Billed monthly.</p>
            
            <Link href="/login" className="pricing-btn-outline" style={{ marginBottom: '40px' }}>
              Get Started
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Includes:</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>5 video conversions per week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>SEO Blog Post Generation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>LinkedIn & Twitter Threads</span>
              </div>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="pricing-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" style={{ marginBottom: '32px' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>

            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '-0.02em' }}>Pro</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>For everyday productivity</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>$8</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', minHeight: '40px' }}>Per month with annual subscription discount ($80 billed up front). $10 if billed monthly.</p>
            
            <Link href="/login" className="pricing-btn" style={{ marginBottom: '40px' }}>
              Start Pro
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Everything in Basic, plus:</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>10 video conversions per day</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Priority Generation Speed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Early access to new features</span>
              </div>
            </div>
          </div>

          {/* Unlimited/Max Tier */}
          <div className="pricing-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ marginBottom: '32px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              <path d="M2 12h20"/>
            </svg>

            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '-0.02em' }}>Unlimited</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>Get the most out of ContentMultiplier</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>$15</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', minHeight: '40px' }}>Per month.</p>
            
            <Link href="/login" className="pricing-btn-outline" style={{ marginBottom: '40px' }}>
              Start Unlimited
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Everything in Pro, plus:</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Unlimited video conversions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Custom Voice Cloning AI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Priority access at high traffic times</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
