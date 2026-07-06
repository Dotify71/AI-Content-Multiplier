"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [voiceSample, setVoiceSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("blog");
  const [copied, setCopied] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGenerate = async () => {
    if (!url) {
      setError("Please enter a YouTube URL");
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const videoId = url ? getYoutubeVideoId(url) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <>
      <DashboardNavbar />
      <div className="main-container fade-in-up delay-1" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        {loading ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '8px' }}>Analyzing Video & Cloning Voice...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>This usually takes about 20-30 seconds.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <div className="skeleton" style={{ width: '120px', height: '40px' }}></div>
            <div className="skeleton" style={{ width: '120px', height: '40px' }}></div>
            <div className="skeleton" style={{ width: '120px', height: '40px' }}></div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: '0' }}></div>
            <div style={{ padding: '60px 80px' }}>
               <div className="skeleton" style={{ width: '80%', height: '48px', marginBottom: '32px' }}></div>
               <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '16px' }}></div>
               <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '16px' }}></div>
               <div className="skeleton" style={{ width: '90%', height: '20px', marginBottom: '40px' }}></div>
               
               <div className="skeleton" style={{ width: '60%', height: '32px', marginBottom: '24px' }}></div>
               <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '16px' }}></div>
               <div className="skeleton" style={{ width: '95%', height: '20px', marginBottom: '16px' }}></div>
               <div className="skeleton" style={{ width: '85%', height: '20px', marginBottom: '16px' }}></div>
            </div>
          </div>
        </div>
      ) : !result ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Create Content Pack</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Enter a YouTube video and a sample of your writing style.</p>
          
          <div className="glass-panel">
            {error && <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>YouTube Video URL</label>
              <input 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                Your Voice Clone Sample 
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 400, marginLeft: '8px' }}>(Optional)</span>
              </label>
              <textarea 
                placeholder="Paste a recent blog post or long social media post you wrote here..." 
                rows={6}
                value={voiceSample}
                onChange={(e) => setVoiceSample(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
              ></textarea>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>We use this to analyze your tone, pacing, and vocabulary.</p>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleGenerate}
              disabled={loading}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Extracting & Generating...
                </>
              ) : 'Generate Content Pack'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button 
            onClick={() => setResult(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Back to generator
          </button>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <button className={activeTab === 'blog' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('blog')} style={{ padding: '8px 24px' }}>Blog Post</button>
            <button className={activeTab === 'linkedin' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('linkedin')} style={{ padding: '8px 24px' }}>LinkedIn</button>
            <button className={activeTab === 'twitter' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('twitter')} style={{ padding: '8px 24px' }}>Twitter</button>
          </div>

          <div className="fade-in-up">
            {activeTab === 'blog' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {thumbnailUrl && (
                  <img src={thumbnailUrl} alt="Video Thumbnail" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '60px 80px', position: 'relative' }} className="blog-content">
                  <button 
                     onClick={() => handleCopy(result.blogPost, 'blog')}
                     style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                   >
                     {copied === 'blog' ? '✓ Copied!' : '📋 Copy Markdown'}
                  </button>
                   <ReactMarkdown>{result.blogPost}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                <button 
                  onClick={() => handleCopy(result.linkedinPost, 'linkedin')}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {copied === 'linkedin' ? '✓ Copied!' : '📋 Copy'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-solid)' }}></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{userEmail ? userEmail.split('@')[0] : 'Your Name'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Just now • 🌍</div>
                  </div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '1.05rem', color: '#ddd' }}>
                  {result.linkedinPost}
                </div>
              </div>
            )}

            {activeTab === 'twitter' && (
              <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {result.tweets.map((tweet: string, i: number) => (
                  <div key={i} className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                    <button 
                      onClick={() => handleCopy(tweet, `tweet-${i}`)}
                      style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {copied === `tweet-${i}` ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-solid)' }}></div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{userEmail ? userEmail.split('@')[0] : 'Your Name'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>@{userEmail ? userEmail.split('@')[0] : 'yourhandle'}</div>
                      </div>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '1.1rem', color: '#ddd' }}>
                      {tweet}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
