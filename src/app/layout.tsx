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
        <Suspense fallback={null}>
          <OAuthRedirect />
        </Suspense>
        <RootHeader userEmail={user?.email} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
