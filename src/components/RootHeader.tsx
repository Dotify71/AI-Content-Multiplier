"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootHeader({ userEmail }: { userEmail: string | undefined }) {
  const pathname = usePathname();
  
  // Hide on dashboard and login which have their own specialized chrome
  if (pathname?.startsWith('/dashboard') || pathname === '/login') {
    return null;
  }

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50,
      background: 'rgba(8, 9, 13, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '16px 0'
    }}>
      <div className="main-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo with Icon */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)'
          }}>
            ✦
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#fff' }}>
            Content<span style={{ color: '#818cf8' }}>Multiplier</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="header-nav">
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Studio
          </Link>
          <a href="/#showcase" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Showcase
          </a>
          <Link href="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Pricing
          </Link>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {userEmail ? (
            <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
              Dashboard
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500, padding: '8px 14px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Sign In
              </Link>
              <Link href="/dashboard" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Open Studio →
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
