import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--glass-border)', 
      padding: '50px 0 36px 0', 
      marginTop: 'auto',
      background: 'rgba(8, 9, 13, 0.5)'
    }}>
      <div className="main-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
          
          <div style={{ maxWidth: '360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ✦
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                ContentMultiplier
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              The high-fidelity repurposing studio for modern creators. Transform long-form videos into native multi-platform writing in your voice.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <Link href="/dashboard" style={{ color: 'var(--text-secondary)' }}>Studio Workspace</Link>
                <Link href="/#showcase" style={{ color: 'var(--text-secondary)' }}>Live Showcase</Link>
                <Link href="/pricing" style={{ color: 'var(--text-secondary)' }}>Pricing & Plans</Link>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
                <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} ContentMultiplier. Designed for authentic creators.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
            <span>All systems running normally</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
