"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OAuthRedirect() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const handled = useRef(false);
  
  useEffect(() => {
    if (code && !handled.current) {
      handled.current = true;
      const supabase = createClient();
      
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (!error) {
            window.location.href = '/dashboard';
          } else {
            console.error("Client-side exchange error:", error);
            window.location.href = `/login?error=${encodeURIComponent(error.message)}`;
          }
        })
        .catch((err) => {
          window.location.href = `/login?error=${encodeURIComponent(err.message)}`;
        });
    }
  }, [code]);

  return null;
}
