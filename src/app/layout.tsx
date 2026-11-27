import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Footer from "../components/Footer";
import RootHeader from "../components/RootHeader";
import OAuthRedirect from "../components/OAuthRedirect";
import { createClient } from '@/utils/supabase/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-content-multiplier.vercel.app'),
  title: "Content Multiplier AI | 10x Your Content Output",
  description: "Turn any YouTube video into an All-in-One Content Pack in your own voice. Instantly generate Blogs, LinkedIn posts, Tweets, and TikTok/Reels Scripts.",
  openGraph: {
    title: "Content Multiplier AI",
    description: "Turn any YouTube video into an All-in-One Content Pack. Generate Blogs, LinkedIn, Tweets, and TikTok Scripts in your voice.",
    url: 'https://ai-content-multiplier.vercel.app',
    siteName: 'Content Multiplier',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Multiplier AI',
    description: 'Turn any YouTube video into an All-in-One Content Pack. Generate Blogs, LinkedIn, Tweets, and TikTok Scripts in your voice.',
  },
  verification: {
    google: 'h825GIngQeB8AvyGjTkUrueZ1W2y008wNAfDx475RWU',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userEmail: string | undefined = undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email;
  } catch {
    userEmail = undefined;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <OAuthRedirect />
        </Suspense>
        <RootHeader userEmail={userEmail} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
