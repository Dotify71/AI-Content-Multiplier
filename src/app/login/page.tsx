"use client";

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

function InteractiveSimulator() {
  const [step, setStep] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [activeTab, setActiveTab] = useState('blog');

  const startDemo = () => {
    setStep('loading');
    setProgress(0);
    setLoadingText('Extracting video transcript...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next === 25) {
          setLoadingText('Calibrating writing voice profile...');
        } else if (next === 55) {
          setLoadingText('Structuring platform-native theses...');
        } else if (next === 85) {
          setLoadingText('Polishing content pack drafts...');
        } else if (next >= 100) {
          clearInterval(interval);
          setStep('completed');
          return 100;
        }
        return next;
      });
    }, 120);
  };

  const blogMock = `### The Death of the Generic Software Generalist\n\nThe bottleneck is no longer how quickly you can write a CRUD endpoint. Syntax is commodity. What matters now is architectural intuition, distributed system trade-offs, and knowing which technical debt to pay down first.`;

  const linkedinMock = `Most engineers focus on memorizing frameworks.\n\nThe highest-paid engineers focus on business leverage.\n\nHere is how to shift your engineering career from junior syntax-writer to indispensable technical architect in 3 steps: 👇\n\n1/ Stop writing boilerplate from scratch.\n2/ Master system topology and data isolation.\n3/ Align every PR with revenue retention.`;

  const tweetsMock = [
    `1/ Coding syntax is officially commodity. AI generates endpoints in milliseconds. But architecture and judgment cannot be automated. 🧵`,
    `2/ The future belongs to technical curators and system architects who know how to compose complex agents safely.`
  ];

  if (step === 'idle') {
    return (
      <div className="glass-panel" style={{ padding: '28px', textAlign: 'left', background: 'rgba(16, 18, 27, 0.85)' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 600 }}>Source YouTube Link</label>
          <div style={{ padding: '10px 14px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#eaeaea', fontSize: '0.88rem' }}>
            https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 600 }}>Target Writing Voice</label>
          <div style={{ padding: '10px 14px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#94a3b8', fontSize: '0.84rem', fontStyle: 'italic', lineHeight: 1.5 }}>
            &quot;Pragmatic engineering insights. Punchy short sentences with real system trade-offs.&quot;
          </div>
        </div>

        <button 
          onClick={startDemo}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none' }}
        >
          ✦ Run Instant Test Drive
        </button>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', borderColor: 'rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--accent-primary)', marginBottom: '20px' }}></div>
        <h4 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>{loadingText}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 20px' }}>Transcribing and applying voice vector mapping</p>
        
        <div style={{ width: '100%', maxWidth: '280px', height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '4px', transition: 'width 0.12s ease-out' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', animation: 'fadeInUp 0.4s ease' }}>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', gap: '8px', marginBottom: '16px' }}>
        {['blog', 'linkedin', 'twitter'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`platform-pill ${activeTab === tab ? 'active' : ''}`}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            {tab === 'twitter' ? 'Twitter' : tab === 'linkedin' ? 'LinkedIn' : 'Essay'}
          </button>
        ))}
        
        <button 
          onClick={() => setStep('idle')}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          Reset ✕
        </button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', maxHeight: '180px', overflowY: 'auto', fontSize: '0.88rem', lineHeight: 1.6, color: '#e2e8f0' }}>
        {activeTab === 'blog' && <div style={{ whiteSpace: 'pre-wrap' }}>{blogMock}</div>}
        {activeTab === 'linkedin' && <div style={{ whiteSpace: 'pre-wrap' }}>{linkedinMock}</div>}
        {activeTab === 'twitter' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tweetsMock.map((tweet, i) => (
              <div key={i} style={{ borderBottom: i < 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: i < 1 ? '8px' : 0 }}>
                {tweet}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
        ✓ 1-click export ready for all major publishing platforms
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) setAuthError(err);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setAuthError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setAuthError(error.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Failed to initialize Google authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', flexWrap: 'wrap' }}>
      
      {/* Top back button */}
      <Link href="/" style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.88rem', textDecoration: 'none' }}>
        <span>←</span> Back to Studio
      </Link>

      {/* Left Column: Visual Showcase */}
      <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', borderRight: '1px solid var(--glass-border)', background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)', minWidth: '320px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
          
          <div className="badge-pill" style={{ marginBottom: '20px' }}>
            <span>✦ Creator Studio</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#fff' }}>
            Publish everywhere in <span className="gradient-text-accent">your authentic voice.</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Transform raw spoken video transcripts into viral threads, long-form newsletters, and punchy hooks. Test drive the simulator below.
          </p>

          <InteractiveSimulator />
        </div>
      </div>

      {/* Right Column: Clean Google Login Box */}
      <div style={{ flex: '1 1 380px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', minWidth: '320px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          
          <div className="glass-panel" style={{ padding: '36px 30px', textAlign: 'center', background: 'rgba(16, 18, 27, 0.9)' }}>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>
              ✦
            </div>

            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
              ContentMultiplier
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
              Sign in to manage your creator studio and saved content packs.
            </p>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: '#ffffff',
                color: '#090a0f',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-heading)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Connecting to Google...' : 'Continue with Google'}
            </button>

            {authError && (
              <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 14px', borderRadius: '6px', marginTop: '20px', fontSize: '0.85rem' }}>
                {authError}
              </div>
            )}

            <div style={{ marginTop: '32px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
                Encrypted authentication via Supabase
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
