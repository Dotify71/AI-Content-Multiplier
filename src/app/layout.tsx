import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content Multiplier AI",
  description: "Turn any YouTube video into an All-in-One Content Pack in your own voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{ padding: '24px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="main-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px', textDecoration: 'none', color: 'inherit' }}>
              Content<span style={{ color: 'var(--accent-solid)' }}>Multiplier</span>
            </Link>
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
              Login
            </Link>
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
