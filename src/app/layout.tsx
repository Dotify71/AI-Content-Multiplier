import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "../components/Footer";
import { createClient } from '@/utils/supabase/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content Multiplier AI",
  description: "Turn any YouTube video into an All-in-One Content Pack in your own voice.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{ padding: '24px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="main-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px', textDecoration: 'none', color: 'inherit' }}>
              Content<span style={{ color: 'var(--accent-solid)' }}>Multiplier</span>
            </Link>
            {user ? (
               <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
                 {user.email}
               </Link>
            ) : (
              <Link href="/login" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
                Login
              </Link>
            )}
          </div>
        </nav>
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
