"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [voiceSample, setVoiceSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("blog");

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
      
      if (!response.ok) throw new Error(data.error || 'Failed to generate content');
      
      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const videoId = url ? getYoutubeVideoId(url) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      {!result ? (
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
              <div style={{ background: '#ffffff', color: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {thumbnailUrl && (
                  <img src={thumbnailUrl} alt="Video Thumbnail" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '60px 80px' }} className="blog-content">
                   <ReactMarkdown>{result.blogPost}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-solid)' }}></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Your Name</div>
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
                  <div key={i} className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-solid)' }}></div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Your Name</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>@yourhandle</div>
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
  );
}
