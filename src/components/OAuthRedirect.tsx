"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthRedirect() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  useEffect(() => {
    if (code) {
      window.location.href = `/auth/callback?code=${code}`;
    }
  }, [code]);

  return null;
}
