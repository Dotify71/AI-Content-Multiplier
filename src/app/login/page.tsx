import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
           <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
             ContentMultiplier
           </h1>
           <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Log in to continue.</p>
        </div>

        <div className="glass-panel" style={{ padding: '40px' }}>
          <button style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', cursor: 'pointer', marginBottom: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '0.9rem' }}>Email address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            Sign In
          </button>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <Link href="/login" style={{ color: '#fff' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
