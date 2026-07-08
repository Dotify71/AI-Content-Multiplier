"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OAuthRedirect() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const handled = useRef(false);
  
  useEffect(() => {
    if (code && !handled.current) {
      handled.current = true;
      window.location.href = `/auth/callback?code=${code}`;
    }
  }, [code]);

  return null;
}
