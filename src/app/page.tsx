import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow Effect */}
      <div className="hero-glow"></div>
      
      {/* Hero Section */}
      <section className="main-container" style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center', position: 'relative' }}>
        <div className="fade-in-up" style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '24px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '24px' }}>
          ✨ Version 1.0 is now live
        </div>
        
        <h1 className="fade-in-up delay-1 gradient-text" style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: '900px', margin: '0 auto 24px auto' }}>
          Multiply your content without <span className="gradient-text-accent">losing your voice.</span>
        </h1>
        
        <p className="fade-in-up delay-2" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.5 }}>
          Paste a YouTube link. Upload a writing sample. Get a viral LinkedIn thread, 3 Tweets, and an SEO Blog Post—written exactly how you sound.
        </p>
        
        <div className="fade-in-up delay-3" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px', display: 'inline-block' }}>Start Generating Free</Link>
          <button className="btn-secondary">See Examples</button>
        </div>
      </section>

      {/* How it works Section */}
      <section className="main-container fade-in-up delay-3" style={{ paddingBottom: '120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>The Workflow</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Zero prompt engineering required. Just plug and play.</p>
        </div>
        
        <div className="feature-grid">
          <div className="glass-panel" style={{ transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '5rem', fontWeight: 800, color: 'rgba(255,255,255,0.04)', position: 'absolute', top: '-15px', right: '10px', lineHeight: 1, userSelect: 'none' }}>01</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)', position: 'relative' }}>Input Video</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, position: 'relative' }}>We bypass standard summaries. Our engine extracts the raw transcript, preserving the nuanced context and core arguments of the original video.</p>
          </div>
          
          <div className="glass-panel" style={{ transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '5rem', fontWeight: 800, color: 'rgba(255,255,255,0.04)', position: 'absolute', top: '-15px', right: '10px', lineHeight: 1, userSelect: 'none' }}>02</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)', position: 'relative' }}>Style Mapping</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, position: 'relative' }}>Our models analyze your provided writing sample to construct a custom persona vector, ensuring the output perfectly mirrors your unique cadence.</p>
          </div>
          
          <div className="glass-panel" style={{ transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '5rem', fontWeight: 800, color: 'rgba(255,255,255,0.04)', position: 'absolute', top: '-15px', right: '10px', lineHeight: 1, userSelect: 'none' }}>03</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)', position: 'relative' }}>Content Generation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, position: 'relative' }}>Within seconds, receive a multi-platform content suite: a long-form article, a structured thread, and highly engaging social posts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
