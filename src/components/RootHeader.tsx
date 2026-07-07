"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootHeader({ userEmail }: { userEmail: string | undefined }) {
  const pathname = usePathname();
  
  // Hide the basic root header on the dashboard, pricing, and login pages, 
  // because they have their own sticky DashboardNavbar or don't need a redundant Login button!
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/pricing') || pathname === '/login') {
    return null;
  }

  return (
    <nav style={{ padding: '24px 0', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="main-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px', textDecoration: 'none', color: 'inherit' }}>
          Content<span style={{ color: 'var(--accent-solid)' }}>Multiplier</span>
        </Link>
        {userEmail ? (
           <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
             {userEmail}
           </Link>
        ) : (
          <Link href="/login" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
