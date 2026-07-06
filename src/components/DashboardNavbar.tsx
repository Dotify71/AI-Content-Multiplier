"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function DashboardNavbar() {
  const router = useRouter();
  const supabase = createClient();
  const [tier, setTier] = useState<string>('free');
  const [usage, setUsage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const profileRes = await supabase.from('profiles').select('tier').eq('id', user.id).single();
      const currentTier = profileRes.data?.tier || 'free';
      setTier(currentTier);

      let query = supabase.from('content_packs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const now = new Date();
      
      if (currentTier === 'basic') {
        const dayOfWeek = now.getUTCDay();
        const diffToMonday = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeekUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diffToMonday)).toISOString();
        query = query.gte('created_at', startOfWeekUTC);
      } else if (currentTier === 'pro') {
        const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
        query = query.gte('created_at', startOfDayUTC);
      }

      const packsRes = await query;
      if (packsRes.count !== null) setUsage(packsRes.count);
      setLoading(false);
    };
    fetchUserData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const limit = tier === 'unlimited' ? '∞' : tier === 'pro' ? 10 : tier === 'basic' ? 5 : 3;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '16px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '16px'
    }}>
      {/* Brand */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ContentMultiplier
        </span>
      </Link>

      {/* Center: Usage Tracker */}
      {!loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px 16px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Usage: <span style={{ color: '#fff', fontWeight: 600 }}>{usage} / {limit}</span>
          </span>
          <span style={{ fontSize: '0.85rem', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '2px 10px', borderRadius: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            {tier}
          </span>
        </div>
      )}

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {tier !== 'unlimited' && tier !== 'pro' && (
          <Link href="/pricing" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'inline-block', textDecoration: 'none' }}>
            Upgrade
          </Link>
        )}
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s', padding: '8px' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          Log out
        </button>
      </div>
    </nav>
  );
}
