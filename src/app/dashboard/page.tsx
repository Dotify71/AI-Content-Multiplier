"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';
import DashboardNavbar from '@/components/DashboardNavbar';

interface ContentResult {
  blogPost: string;
  linkedinPost: string;
  tweets: string[];
  shortScript: string;
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [voiceSample, setVoiceSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("blog");
  const [copied, setCopied] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const supabase = createClient();

  const loadingMessages = [
    "Downloading YouTube video transcript...",
    "Filtering out sponsors and tangents...",
    "Calibrating sentence cadence & tone profile...",
    "Drafting publication-ready long-form essay...",
    "Structuring high-tension LinkedIn post...",
    "Formatting viral Twitter/X thread hooks...",
    "Composing 60-second video script...",
    "Polishing final content pack..."
  ];

  const presets = [
    {
      label: "Ali Abdaal (Productivity)",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      voice: "Clear, friendly, actionable advice with bullet points, evidence-based reasoning, and zero fluff."
    },
    {
      label: "Naval Ravikant (Mental Models)",
      url: "https://www.youtube.com/watch?v=1-SVuFT45i8",
      voice: "Aphoristic, concise, dense insights. Short sentences with punchy philosophical takeaways."
    },
    {
      label: "Tech Architecture Deep Dive",
      url: "https://www.youtube.com/watch?v=8qUcwC9hKOU",
      voice: "Pragmatic software engineering perspective. Focused on trade-offs, scalability, and system topology."
    }
  ];

  const tonePills = [
    "⚡ Concise & Punchy",
    "💼 Thought Leadership",
    "☕ Casual Storyteller",
    "🎓 Analytical Deep-Dive"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 4000);
    } else {
      // eslint-disable-next-line
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
    // eslint-disable-next-line
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getYoutubeVideoId = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGenerate = async () => {
    if (!url) {
      setError("Please enter a valid YouTube video URL");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, voiceSample })
      });
      const data = await response.json();
      
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      if (response.status === 403) {
        window.location.href = '/pricing';
        return;
      }
      
      if (!response.ok) throw new Error(data.error || 'Failed to generate content');
      
      setResult(data);
      window.dispatchEvent(new Event('contentGenerated'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during generation.");
      }
    } finally {
      setLoading(false);
    }
  };

  const videoId = url ? getYoutubeVideoId(url) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <>
      <DashboardNavbar />
      <div className="main-container fade-in-up delay-1" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        
        {/* Loading Progress State */}
        {loading ? (
          <div style={{ maxWidth: '840px', margin: '40px auto', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '48px 32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px', borderColor: 'rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--accent-primary)', margin: '0 auto' }}></div>
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>
                {loadingMessages[loadingMessageIndex]}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Transforming long-form video into 4 channel-native drafts. Takes ~20-40 seconds.
              </p>

              <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', margin: '36px auto 0 auto' }}>
                <div className="skeleton" style={{ width: '100%', height: '14px' }}></div>
                <div className="skeleton" style={{ width: '85%', height: '14px' }}></div>
                <div className="skeleton" style={{ width: '92%', height: '14px' }}></div>
              </div>
            </div>
          </div>
        ) : !result ? (
          /* Studio Input Workspace */
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            
            <div style={{ marginBottom: '32px', textAlign: 'left' }}>
              <div className="badge-pill" style={{ marginBottom: '10px' }}>
                <span>✦ Video Repurposing Studio</span>
              </div>
              <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Create New Content Pack</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                Paste any YouTube link to extract its insights into an X thread, LinkedIn post, long-form essay, and short-form video script.
              </p>
            </div>

            {/* Quick Test Presets */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                Try with a sample link:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrl(preset.url);
                      setVoiceSample(preset.voice);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#fff'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    ✦ {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '36px', marginBottom: '32px' }}>
              
              {/* YouTube Link Field */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>
                  YouTube Video URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              {/* Thumbnail Preview if detected */}
              {thumbnailUrl && (
                <div style={{ marginBottom: '28px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', maxHeight: '220px' }}>
                  {/* eslint-disable-next-line */}
                  <img src={thumbnailUrl} alt="Video Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#fff' }}>
                    Video ID: {videoId}
                  </div>
                </div>
              )}

              {/* Tone Quick Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Quick Voice Tone:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {tonePills.map((tone, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVoiceSample(prev => prev ? `${prev}\nTone preference: ${tone}` : `Tone preference: ${tone}`)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing Sample Voice Cloning */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
                    Writing Sample or Voice Directives <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Paste past tweets, essays, or guidelines</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste a paragraph of your own writing so the output mimics your rhythm, vocabulary, and sentence lengths..."
                  value={voiceSample}
                  onChange={(e) => setVoiceSample(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem', marginBottom: '24px' }}>
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.05rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
                }}
              >
                ✦ Generate Multi-Platform Content Pack
              </button>

            </div>

          </div>
        ) : (
          /* Result Output Studio */
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            
            {/* Header with Back & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <button
                  onClick={() => setResult(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ← Create Another Pack
                </button>
                <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>Your Generated Content Pack</h1>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2), 'all')}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {copied === 'all' ? '✓ All Copied' : 'Export JSON'}
                </button>
              </div>
            </div>

            {/* Platform Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', flexWrap: 'wrap' }}>
              <button 
                className={`platform-pill ${activeTab === 'blog' ? 'active' : ''}`}
                onClick={() => setActiveTab('blog')}
              >
                <span>✉</span> Long-Form Essay
              </button>
              <button 
                className={`platform-pill ${activeTab === 'linkedin' ? 'active' : ''}`}
                onClick={() => setActiveTab('linkedin')}
              >
                <span style={{ color: '#0a66c2' }}>in</span> LinkedIn Post
              </button>
              <button 
                className={`platform-pill ${activeTab === 'twitter' ? 'active' : ''}`}
                onClick={() => setActiveTab('twitter')}
              >
                <span>𝕏</span> Twitter / X Thread ({result.tweets.length})
              </button>
              <button 
                className={`platform-pill ${activeTab === 'shortScript' ? 'active' : ''}`}
                onClick={() => setActiveTab('shortScript')}
              >
                <span style={{ color: '#ec4899' }}>▶</span> Reels / TikTok Script
              </button>
            </div>

            {/* Tab: Blog Post */}
            {activeTab === 'blog' && (
              <div className="glass-panel" style={{ padding: '48px 40px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Substack & SEO Article</span>
                  <button 
                    onClick={() => handleCopy(result.blogPost, 'blog')}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    {copied === 'blog' ? '✓ Copied Markdown' : 'Copy Markdown'}
                  </button>
                </div>
                <div className="blog-content">
                  <ReactMarkdown>{result.blogPost}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Tab: LinkedIn */}
            {activeTab === 'linkedin' && (
              <div className="glass-panel" style={{ maxWidth: '680px', margin: '0 auto', padding: '32px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0a66c2, #004182)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                      {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{userEmail ? userEmail.split('@')[0] : 'Creator'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thought Leader • Just now • 🌐</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(result.linkedinPost, 'linkedin')}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    {copied === 'linkedin' ? '✓ Copied' : 'Copy Post'}
                  </button>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1.02rem', color: '#e2e8f0' }}>
                  {result.linkedinPost}
                </div>
              </div>
            )}

            {/* Tab: Twitter Thread */}
            {activeTab === 'twitter' && (
              <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {result.tweets.map((tweet: string, i: number) => (
                  <div key={i} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {i + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>Thread Part {i + 1} of {result.tweets.length}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{userEmail ? userEmail.split('@')[0] : 'creator'}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopy(tweet, `tweet-${i}`)}
                        className="btn-secondary"
                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                      >
                        {copied === `tweet-${i}` ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '1rem', color: '#e2e8f0' }}>
                      {tweet}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: TikTok / Reels Script */}
            {activeTab === 'shortScript' && (
              <div className="glass-panel" style={{ maxWidth: '680px', margin: '0 auto', padding: '32px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', display: 'inline-block' }}></span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>Teleprompter & Director Script</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(result.shortScript, 'shortScript')}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    {copied === 'shortScript' ? '✓ Copied' : 'Copy Script'}
                  </button>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                  {result.shortScript}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
