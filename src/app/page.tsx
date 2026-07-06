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
          <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>Start Generating Free</button>
          <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '16px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>See Examples</button>
        </div>
      </section>

      {/* How it works Section */}
      <section className="main-container fade-in-up delay-3" style={{ paddingBottom: '120px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>How it works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>From a single video to a week of content in 30 seconds.</p>
        </div>
        
        <div className="feature-grid">
          <div className="glass-panel" style={{ transition: 'all 0.3s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎥</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>1. Paste Video</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Drop any YouTube URL. We instantly extract the transcript and core ideas.</p>
          </div>
          
          <div className="glass-panel" style={{ transition: 'all 0.3s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🧠</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>2. Clone Your Voice</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Provide a short sample of your past writing. Our AI maps your unique tone, pacing, and vocabulary.</p>
          </div>
          
          <div className="glass-panel" style={{ transition: 'all 0.3s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>3. Get Content Pack</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Instantly receive a ready-to-publish blog post, LinkedIn carousel, and Twitter thread.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
