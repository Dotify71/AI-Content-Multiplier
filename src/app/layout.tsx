import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        <nav style={{ padding: '24px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="main-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
              Content<span style={{ color: 'var(--accent-solid)' }}>Multiplier</span>
            </div>
            <div>
              <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Login</button>
            </div>
          </div>
        </nav>
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <footer style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Content Multiplier. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
