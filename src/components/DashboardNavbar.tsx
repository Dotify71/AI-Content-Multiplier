"use client";

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function DashboardNavbar() {
  const supabase = createClient();
  const [tier, setTier] = useState<string>('free');
  const [usage, setUsage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.email) setEmail(user.email);
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
        } else {
          setTier('guest');
          setUsage(0);
        }
      } catch {
        setTier('guest');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [supabase]);

  useEffect(() => {
    const handleContentGenerated = () => {
      setUsage(prev => prev + 1);
    };
    window.addEventListener('contentGenerated', handleContentGenerated);
    return () => window.removeEventListener('contentGenerated', handleContentGenerated);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const limit = tier === 'unlimited' ? '∞' : tier === 'pro' ? 10 : tier === 'basic' ? 5 : 3;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(12, 13, 18, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '12px clamp(12px, 3vw, 24px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '10px 16px',
      minHeight: '60px'
    }}>
      {/* Brand & Studio Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0c0d12',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            ✦
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            Content<span style={{ color: '#fbbf24' }}>Multiplier</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 600, padding: '5px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)' }}>
            Studio
          </Link>
          <Link href="/dashboard/history" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Saved Library
          </Link>
        </div>
      </div>

      {/* Center: Usage Tracker or Guest Mode Pill */}
      {!loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '5px 14px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          {tier === 'guest' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Portfolio Demo Mode • <strong style={{ color: '#fff' }}>{usage} generated</strong>
              </span>
            </div>
          ) : (
            <>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Usage: <strong style={{ color: '#fff' }}>{usage} / {limit}</strong>
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
                {tier}
              </span>
            </>
          )}
        </div>
      )}

      {/* Right: User / Auth Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {email ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0c0d12', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {email.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {email}
              </span>
            </div>
            {tier === 'free' || tier === 'basic' ? (
              <Link href="/pricing" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
                Upgrade
              </Link>
            ) : null}
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', padding: '6px' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              Sign Out
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', textDecoration: 'none' }}>
              Pricing
            </Link>
            <Link href="/login" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
              Sign In to Save
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
