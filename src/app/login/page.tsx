"use client";

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

function InteractiveSimulator() {
  const [step, setStep] = useState('idle'); // 'idle' | 'loading' | 'completed'
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [activeTab, setActiveTab] = useState('blog');

  const startDemo = () => {
    setStep('loading');
    setProgress(0);
    setLoadingText('Ripping YouTube transcript...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next === 25) {
          setLoadingText('Analyzing writing voice clone...');
        } else if (next === 55) {
          setLoadingText('Fine-tuning Gemini ghostwriter...');
        } else if (next === 85) {
          setLoadingText('Structuring Content Pack drafts...');
        } else if (next >= 100) {
          clearInterval(interval);
          setStep('completed');
          return 100;
        }
        return next;
      });
    }, 150);
  };

  const blogMock = `## The Future of Coding: Why Devs Must Adapt

Software engineering is undergoing a tectonic shift. It's no longer about writing lines of code; it's about orchestration. As AI agents handle boilerplate code and syntax validation, the developer's role shifts towards high-level architecture and system design. 

In this new era, the programmers who thrive won't be those who memorized syntax libraries, but those who excel at problem decomposition and structural orchestration.`;

  const linkedinMock = `🚀 The role of a Software Engineer is officially changing. 

It is no longer about writing syntax; it's about system orchestration. With AI agents writing code blocks, the real value lies in how you design systems, analyze logic, and compose architectures. 

The devs who adapt will become structural architects. The rest will get left behind. 

Agree? Let's discuss in the comments. 👇

#SoftwareEngineering #Productivity #AI`;

  const tweetsMock = [
    `1/ Coding syntax is officially commodity. AI can write standard code blocks faster and with fewer syntax bugs than any human. But this isn't the end of devs—it's their evolution. 🧵`,
    `2/ The value has shifted from WRITING code to ORCHESTRATING systems. High-level architecture, business logic mapping, and product security are the new core skills.`,
    `3/ The next generation of elite programmers won't write code—they will edit, prompt, design, and guide. Adapt your skillset today to stay ahead.`
  ];

  if (step === 'idle') {
    return (
      <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', backdropFilter: 'blur(8px)', textAlign: 'left' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>YouTube Video Link</label>
          <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: '#eaeaea', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>Your Writing Sample (For Voice Cloning)</label>
          <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: '#888', fontSize: '0.85rem', minHeight: '60px', fontStyle: 'italic', lineHeight: 1.4 }}>
            "Syntax is commodity. The elite devs of tomorrow aren't the ones memorizing code blocks, but the architects orchestrating systems."
          </div>
        </div>

        <button 
          onClick={startDemo}
          style={{ width: '100%', padding: '14px', background: 'var(--accent-gradient)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)' }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          ⚡ Run Live AI Test Drive
        </button>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="glass-panel" style={{ padding: '50px 30px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', backdropFilter: 'blur(8px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        {/* Animated spinner */}
        <div style={{ width: '50px', height: '50px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTop: '3px solid #a78bfa', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
        
        <h4 style={{ margin: '0 0 8px', color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{loadingText}</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 24px' }}>Simulating real-time AI transcription & voice matching</p>
        
        {/* Progress bar container */}
        <div style={{ width: '100%', maxWidth: '300px', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '3px', transition: 'width 0.1s ease-out' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', backdropFilter: 'blur(8px)', textAlign: 'left', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Simulation Result Header Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', gap: '8px', marginBottom: '20px' }}>
        {['blog', 'linkedin', 'twitter'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === tab ? '#c084fc' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'twitter' ? 'Twitter' : tab === 'linkedin' ? 'LinkedIn' : 'SEO Blog'}
          </button>
        ))}
        
        <button 
          onClick={() => setStep('idle')}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
        >
          ✕ Reset
        </button>
      </div>

      {/* Simulator tab renders */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', maxHeight: '200px', overflowY: 'auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {activeTab === 'blog' && (
          <div style={{ whiteSpace: 'pre-wrap', color: '#eaeaea' }}>
            {blogMock}
          </div>
        )}
        {activeTab === 'linkedin' && (
          <div style={{ whiteSpace: 'pre-wrap', color: '#eaeaea' }}>
            {linkedinMock}
          </div>
        )}
        {activeTab === 'twitter' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tweetsMock.map((tweet, i) => (
              <div key={i} style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < 2 ? '12px' : 0, color: '#eaeaea' }}>
                {tweet}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 500, textAlign: 'center' }}>
          ✨ The actual app lets you copy all output tabs in 1-click!
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const supabase = createClient();

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

      if (error) {
        setAuthError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setAuthError(err.message || "A critical error occurred while trying to connect to Supabase.");
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) return;
    try {
      setEmailLoading(true);
      setAuthError("");
      
      // Try to sign in
      let { error } = await supabase.auth.signInWithPassword({ email, password });
      
      // If the user doesn't exist, sign them up instead!
      if (error && error.message.includes("Invalid login credentials")) {
         const { error: signUpError } = await supabase.auth.signUp({ email, password });
         error = signUpError;
      }

      if (error) {
        setAuthError(error.message);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setAuthError(err.message || "A critical error occurred");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '90vh', background: 'radial-gradient(ellipse at bottom, #11101d 0%, #060608 100%)', overflow: 'hidden', flexWrap: 'wrap' }}>
      {/* Left Side: Premium Feature/Value Prop Illustration */}
      <div className="login-left-panel" style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 60px', borderRight: '1px solid rgba(255, 255, 255, 0.03)', position: 'relative', background: 'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 40%)', minWidth: '320px' }}>
        
        {/* Abstract glowing background blobs */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--accent-glow)', filter: 'blur(100px)', opacity: 0.15, top: '25%', left: '20%', pointerEvents: 'none' }}></div>
        
        <div style={{ maxWidth: '540px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '6px 12px', borderRadius: '20px', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }}></span>
            <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI-Powered Ghostwriter</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '20px', letterSpacing: '-0.02em', color: '#fff' }}>
            Multiply your content in <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your own voice.</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Test drive the generator below to see how our AI ghostwriter turns a video link into a custom-tailored content pack.
          </p>

          {/* Interactive CSS Ghostwriter Simulator */}
          <InteractiveSimulator />
        </div>
      </div>

      {/* Right Side: Clean Centered Google Login Box */}
      <div style={{ flex: '1 1 400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#0a090e', minWidth: '320px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <div className="glass-panel animate-glow" style={{ padding: '50px 40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}>
            
            <div style={{ marginBottom: '40px' }}>
               <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>
                 ContentMultiplier
               </h1>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                 Log in to access your creator dashboard.
               </p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ width: '100%', padding: '16px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(255, 255, 255, 0.06)', color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                id="email-input"
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
              />
              <input 
                id="password-input"
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
              />
              <button 
                id="password-login-btn"
                onClick={handlePasswordLogin}
                disabled={emailLoading}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#8b5cf6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
              >
                {emailLoading ? 'Logging in...' : 'Sign In / Sign Up'}
              </button>
            </div>

            {authError && (
              <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '8px', marginTop: '24px', fontSize: '0.9rem', textAlign: 'center' }}>
                Error: {authError}
              </div>
            )}

            <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                Secure Login powered by Supabase
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
