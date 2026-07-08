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
          theme: { color: "#8b5cf6" }
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
  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '80px', paddingBottom: '120px', position: 'relative' }}>
      <Link href="/dashboard" style={{ position: 'absolute', top: '32px', right: '32px', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', transition: 'all 0.2s', cursor: 'pointer' }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.02em' }}>Plans & Pricing</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '64px', fontSize: '1.1rem' }}>Stop spending 10 hours a week on content. Let AI do it in 30 seconds.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', textAlign: 'left' }}>
          
          {(() => {
            const isProHighlighted = currentTier !== 'pro' && currentTier !== 'unlimited';
            const isUnlimitedHighlighted = currentTier === 'pro';

            return (
              <>
          {/* Basic Tier */}
          <div className="pricing-card">
            {/* SVG Icon matching Claude's aesthetic */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ marginBottom: '32px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>

            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '-0.02em' }}>Basic</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>For casual creators starting out</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>₹499</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', minHeight: '40px' }}>Per month. Billed monthly.</p>
            
            {currentTier === 'basic' ? (
              <button disabled style={{ marginBottom: '40px', width: '100%', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                Your current plan
              </button>
            ) : (currentTier === 'pro' || currentTier === 'unlimited') ? (
              <button disabled style={{ marginBottom: '40px', width: '100%', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                Included in your plan
              </button>
            ) : (
              <button onClick={() => handleUpgrade('basic')} disabled={loading === 'basic'} className="pricing-btn-outline" style={{ marginBottom: '40px', width: '100%', cursor: 'pointer', border: 'none', padding: '16px', fontSize: '1.1rem', borderRadius: '24px' }}>
                {loading === 'basic' ? 'Loading...' : 'Get Started'}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Includes:</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>5 video conversions per week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>SEO Blog Post Generation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>LinkedIn & Twitter Threads</span>
              </div>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="pricing-card" style={isProHighlighted ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)' } : {}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isProHighlighted ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="1.5" style={{ marginBottom: '32px' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>

            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '-0.02em' }}>Pro</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>For everyday productivity</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>₹999</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', minHeight: '40px' }}>Per month with annual subscription discount ($80 billed up front). $10 if billed monthly.</p>
            
            {currentTier === 'pro' ? (
              <button disabled style={{ marginBottom: '40px', width: '100%', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                Your current plan
              </button>
            ) : (currentTier === 'unlimited') ? (
              <button disabled style={{ marginBottom: '40px', width: '100%', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                Included in your plan
              </button>
            ) : (
              <button onClick={() => handleUpgrade('pro')} disabled={loading === 'pro'} className={isProHighlighted ? "pricing-btn" : "pricing-btn-outline"} style={{ marginBottom: '40px', width: '100%', cursor: 'pointer', border: 'none', padding: '16px', fontSize: '1.1rem', borderRadius: '24px' }}>
                {loading === 'pro' ? 'Loading...' : 'Start Pro'}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Everything in Basic, plus:</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>10 video conversions per day</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Priority Generation Speed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Early access to new features</span>
              </div>
            </div>
          </div>

          {/* Unlimited/Max Tier */}
          <div className="pricing-card" style={isUnlimitedHighlighted ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)' } : {}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isUnlimitedHighlighted ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="1.5" style={{ marginBottom: '32px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              <path d="M2 12h20"/>
            </svg>

            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '-0.02em' }}>Unlimited</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>Get the most out of ContentMultiplier</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>₹1999</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', minHeight: '40px' }}>Per month.</p>
            
            {currentTier === 'unlimited' ? (
              <button disabled style={{ marginBottom: '40px', width: '100%', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                Your current plan
              </button>
            ) : (
              <button onClick={() => handleUpgrade('unlimited')} disabled={loading === 'unlimited'} className={isUnlimitedHighlighted ? "pricing-btn" : "pricing-btn-outline"} style={{ marginBottom: '40px', width: '100%', cursor: 'pointer', border: 'none', padding: '16px', fontSize: '1.1rem', borderRadius: '24px' }}>
                {loading === 'unlimited' ? 'Loading...' : 'Start Unlimited'}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Everything in Pro, plus:</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Unlimited video conversions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Custom Voice Cloning AI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '0.95rem', color: '#eaeaea' }}>Priority access at high traffic times</span>
              </div>
            </div>
          </div>
              </>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
