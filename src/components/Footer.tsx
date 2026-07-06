import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 0', marginTop: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} ContentMultiplier. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</Link>
          <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
