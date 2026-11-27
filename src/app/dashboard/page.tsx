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
    "Downloading YouTube video transcript & timestamps...",
    "Extracting core arguments and practical frameworks...",
    "Calibrating personal cadence & vocabulary profile...",
    "Drafting publication-ready long-form essay...",
    "Structuring high-converting LinkedIn post...",
    "Composing viral Twitter/X thread breakdown...",
    "Formatting 60-second video script with visual cues...",
    "Polishing final content pack..."
  ];

  // Featured presets including the two high-end design videos requested by the user
  const featuredPresets = [
    {
      title: "How to Build $10K Websites in Minutes",
      author: "Caleb • Metics Media",
      tag: "Claude AI & Web Design",
      url: "https://youtu.be/snErQUyqwCU",
      voice: "Actionable, direct web design agency insights. Focus on no-code speed, client psychology, and high-ticket value."
    },
    {
      title: "The Easy Way to Design Top Tier Websites",
      author: "Sajid • Design Strategy",
      tag: "Design Principles",
      url: "https://youtu.be/qyomWr_C_jA",
      voice: "Design architect perspective. Deconstructing visual balance, spacing systems, and eliminating blank-canvas paralysis."
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
      }, 3500);
    } else {
      // eslint-disable-next-line
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    }).catch(() => {
      // Guest mode is completely supported
    });
    // eslint-disable-next-line
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const fullMarkdown = `# Content Multiplier Campaign Pack\nSource: ${url}\nDate: ${new Date().toLocaleDateString()}\n\n---\n\n## 1. Long-Form Essay & Newsletter\n\n${result.blogPost}\n\n---\n\n## 2. LinkedIn Thought Leadership\n\n${result.linkedinPost}\n\n---\n\n## 3. Twitter / X Thread\n\n${result.tweets.map((t, idx) => `### Tweet ${idx + 1}\n${t}`).join('\n\n')}\n\n---\n\n## 4. Short-Form Video Script\n\n${result.shortScript}\n`;
    
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `content-pack-${Date.now()}.md`;
    link.click();
  };

  const getYoutubeVideoId = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGenerate = async (customUrl?: string, customVoice?: string) => {
    const targetUrl = customUrl || url;
    const targetVoice = customVoice !== undefined ? customVoice : voiceSample;

    if (!targetUrl) {
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
        body: JSON.stringify({ url: targetUrl, voiceSample: targetVoice })
      });
      const data = await response.json();
      
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
        
        {/* Loading State */}
        {loading ? (
          <div style={{ maxWidth: '820px', margin: '40px auto', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '56px 36px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px', margin: '0 auto' }}></div>
              </div>
              <h2 style={{ fontSize: '1.7rem', marginBottom: '10px', color: '#fff' }}>
                {loadingMessages[loadingMessageIndex]}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Extracting transcript and constructing 4 platform-native formats.
              </p>

              <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px', margin: '36px auto 0 auto' }}>
                <div className="skeleton" style={{ width: '100%', height: '14px' }}></div>
                <div className="skeleton" style={{ width: '85%', height: '14px' }}></div>
                <div className="skeleton" style={{ width: '92%', height: '14px' }}></div>
              </div>
            </div>
          </div>
        ) : !result ? (
          /* Studio Input Form */
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            
            {/* Studio Header */}
            <div style={{ marginBottom: '32px', textAlign: 'left' }}>
              <div className="badge-pill badge-pill-accent" style={{ marginBottom: '12px' }}>
                <span>✦ Video Repurposing Studio</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', marginBottom: '10px' }}>Create Content Pack</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Paste any YouTube URL or try one of the featured design masterclasses below to generate your complete multi-platform campaign.
              </p>
            </div>

            {/* Featured 1-Click Interactive Masterclass Presets */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ✦ Featured 1-Click Masterclasses:
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
                {featuredPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setUrl(preset.url);
                      setVoiceSample(preset.voice);
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.74rem', background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {preset.tag}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {preset.author}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.98rem', color: '#fff', lineHeight: 1.4 }}>
                        {preset.title}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click to load link</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUrl(preset.url);
                          setVoiceSample(preset.voice);
                          handleGenerate(preset.url, preset.voice);
                        }}
                        className="btn-amber"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
                      >
                        Run Instant Demo →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Input Panel */}
            <div className="glass-panel" style={{ padding: '36px', marginBottom: '32px' }}>
              
              {/* YouTube Link Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>
                  YouTube Video URL <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingLeft: '44px',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(0, 0, 0, 0.35)',
                      color: '#fff',
                      fontSize: '0.98rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                  />
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }}>
                    ▶
                  </div>
                </div>
              </div>

              {/* Thumbnail Preview */}
              {thumbnailUrl && (
                <div style={{ marginBottom: '24px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', maxHeight: '200px' }}>
                  {/* eslint-disable-next-line */}
                  <img src={thumbnailUrl} alt="Video Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
                    Video Linked: {videoId}
                  </div>
                </div>
              )}

              {/* Tone Quick Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Quick Tone Presets:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {tonePills.map((tone, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVoiceSample(prev => prev ? `${prev}\nTone preference: ${tone}` : `Tone preference: ${tone}`)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.035)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing Sample Voice Directives */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
                    Custom Writing Voice or Persona Directives <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Paste past tweets, essays, or guidelines</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste a paragraph of your writing or specific instructions (e.g. 'Punchy short sentences, no fluff, practical system design takeaways')..."
                  value={voiceSample}
                  onChange={(e) => setVoiceSample(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem', marginBottom: '24px' }}>
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="btn-amber"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.05rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: 'none',
                  fontWeight: 700
                }}
              >
                ✦ Generate Multi-Platform Content Pack
              </button>

            </div>

          </div>
        ) : (
          /* Result Output Studio */
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            
            {/* Header with Back, Title, and Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <button
                  onClick={() => setResult(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ← Create Another Campaign
                </button>
                <h1 style={{ fontSize: '2rem', color: '#fff' }}>Campaign Assets Ready</h1>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDownloadMarkdown}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Download .MD Pack
                </button>
                <button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2), 'all')}
                  className="btn-amber"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {copied === 'all' ? '✓ All Copied' : 'Copy All JSON'}
                </button>
              </div>
            </div>

            {/* Platform Selector Tabs */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Substack & SEO Article</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• ~{result.blogPost.split(/\s+/).length} words</span>
                  </div>
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
                      {userEmail ? userEmail.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{userEmail ? userEmail.split('@')[0] : 'Creator'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Design & Strategy • Just now • 🌐</div>
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
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#fbbf24' }}>
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
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>Director Teleprompter Script</span>
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
