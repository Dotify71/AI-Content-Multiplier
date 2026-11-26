"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  useEffect(() => {
    const fetchTier = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('tier').eq('id', user.id).single();
        if (data) setCurrentTier(data.tier);
      }
    };
    fetchTier();
  }, []);

  const handleUpgrade = async (tier: string) => {
    setLoading(tier);
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      const order = await res.json();
      
      if (!res.ok) throw new Error(order.error || 'Failed to create order');

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "ContentMultiplier",
          description: `Upgrade to ${tier.toUpperCase()} tier`,
          order_id: order.id,
          handler: async function (response: Record<string, string>) {
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  tier
                })
              });
              
              let verifyData;
              try {
                verifyData = await verifyRes.json();
              } catch {
                throw new Error("The server crashed while verifying the payment. Check your terminal for errors.");
              }

              if (verifyRes.ok) {
                alert("Payment successful! Your account has been upgraded.");
                window.location.href = '/dashboard';
              } else {
                alert("Payment verification failed: " + verifyData.error);
              }
            } catch (err: unknown) {
              if (err instanceof Error) {
                alert(err.message);
              } else {
                alert("An unknown error occurred.");
              }
            }
          },
          theme: { color: "#6366f1" }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: { error: { description: string } }){
          alert("Payment failed: " + response.error.description);
        });
        rzp.open();
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(null);
    }
  };

  const isProHighlighted = currentTier !== 'pro' && currentTier !== 'unlimited';
  const isUnlimitedHighlighted = currentTier === 'pro';

  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '60px', paddingBottom: '120px', position: 'relative' }}>
      
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ✦
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            Content<span style={{ color: '#818cf8' }}>Multiplier</span>
          </span>
        </Link>

        <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
          ← Back to Studio
        </Link>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px auto' }}>
        <div className="badge-pill" style={{ marginBottom: '14px' }}>
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
          Plans for creators who publish with intent.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Stop spending 12 hours a week manually drafting threads and essays. Multiply your reach in minutes.
        </p>
      </div>

      {/* Pricing Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Basic Tier */}
        <div className="pricing-card">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>Starter</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For casual creators testing weekly repurposing</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>₹499</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ month</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '28px' }}>Cancel anytime. Zero commitment.</p>

          {currentTier === 'basic' ? (
            <button disabled style={{ marginBottom: '32px', width: '100%', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
              Current Plan
            </button>
          ) : (currentTier === 'pro' || currentTier === 'unlimited') ? (
            <button disabled style={{ marginBottom: '32px', width: '100%', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
              Included in Your Plan
            </button>
          ) : (
            <button 
              onClick={() => handleUpgrade('basic')} 
              disabled={loading === 'basic'}
              className="btn-secondary"
              style={{ marginBottom: '32px', width: '100%', padding: '12px' }}
            >
              {loading === 'basic' ? 'Connecting to Razorpay...' : 'Get Starter'}
            </button>
          )}

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, fontSize: '0.92rem' }}>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Plan includes:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> 5 video conversions per week
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Long-form SEO blog & newsletter
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> X / Twitter thread formatting
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> High-converting LinkedIn posts
            </div>
          </div>
        </div>

        {/* Pro Tier (Featured) */}
        <div className="pricing-card featured" style={{ position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '12px', letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
            Most Popular
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>Creator Pro</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For active weekly publishers & growing channels</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>₹999</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ month</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '28px' }}>Priority GPU compute & faster conversion speeds.</p>

          {currentTier === 'pro' ? (
            <button disabled style={{ marginBottom: '32px', width: '100%', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
              Current Plan
            </button>
          ) : (
            <button 
              onClick={() => handleUpgrade('pro')} 
              disabled={loading === 'pro'}
              className="btn-primary"
              style={{ marginBottom: '32px', width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none' }}
            >
              {loading === 'pro' ? 'Connecting to Razorpay...' : 'Upgrade to Creator Pro'}
            </button>
          )}

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, fontSize: '0.92rem' }}>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Everything in Starter, plus:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-primary)' }}>✓</span> 10 video conversions per day (300/mo)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-primary)' }}>✓</span> TikTok / Reels script teleprompter
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-primary)' }}>✓</span> Custom writing voice calibration
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-primary)' }}>✓</span> Priority processing during peak hours
            </div>
          </div>
        </div>

        {/* Unlimited Tier */}
        <div className="pricing-card">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>Agency Unlimited</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For media teams, agencies, and prolific founders</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>₹1,999</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ month</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '28px' }}>Zero caps. Maximum conversion velocity.</p>

          {currentTier === 'unlimited' ? (
            <button disabled style={{ marginBottom: '32px', width: '100%', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
              Current Plan
            </button>
          ) : (
            <button 
              onClick={() => handleUpgrade('unlimited')} 
              disabled={loading === 'unlimited'}
              className="btn-secondary"
              style={{ marginBottom: '32px', width: '100%', padding: '12px' }}
            >
              {loading === 'unlimited' ? 'Connecting to Razorpay...' : 'Get Unlimited'}
            </button>
          )}

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, fontSize: '0.92rem' }}>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Everything in Creator Pro, plus:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Unlimited video conversions
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Multi-persona voice switching
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Instant generation queue (zero wait)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Early access to new platform models
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
