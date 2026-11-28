"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';
import DashboardNavbar from '@/components/DashboardNavbar';
import Link from 'next/link';

interface ContentPack {
  id: number;
  created_at: string;
  youtube_url: string;
  blog_post: string;
  linkedin_post: string;
  tweets: string[];
  short_script: string;
}

export default function HistoryPage() {
  const [packs, setPacks] = useState<ContentPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<ContentPack | null>(null);
  const [activeTab, setActiveTab] = useState("blog");
  const [copied, setCopied] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('content_packs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setPacks(data);
      setLoading(false);
    };
    fetchHistory();
  }, [supabase]);

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="main-container fade-in-up delay-1" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        
        {selectedPack ? (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <button 
              onClick={() => setSelectedPack(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              ← Back to Saved Packs
            </button>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', flexWrap: 'wrap' }}>
              <button className={`platform-pill ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
                <span>✉</span> Long-Form Essay
              </button>
              <button className={`platform-pill ${activeTab === 'linkedin' ? 'active' : ''}`} onClick={() => setActiveTab('linkedin')}>
                <span style={{ color: '#0a66c2' }}>in</span> LinkedIn Post
              </button>
              <button className={`platform-pill ${activeTab === 'twitter' ? 'active' : ''}`} onClick={() => setActiveTab('twitter')}>
                <span>𝕏</span> Twitter Thread
              </button>
              {selectedPack.short_script && (
                <button className={`platform-pill ${activeTab === 'shortScript' ? 'active' : ''}`} onClick={() => setActiveTab('shortScript')}>
                  <span style={{ color: '#ec4899' }}>▶</span> Reels / TikTok Script
                </button>
              )}
            </div>

            <div className="fade-in-up">
              {activeTab === 'blog' && (
                <div className="glass-panel" style={{ padding: '48px 40px', position: 'relative' }}>
                  {getYoutubeVideoId(selectedPack.youtube_url) && (
                    <div style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {/* eslint-disable-next-line */}
                      <img src={`https://img.youtube.com/vi/${getYoutubeVideoId(selectedPack.youtube_url)}/maxresdefault.jpg`} alt="Video Thumbnail" style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Substack & Blog Draft</span>
                    <button 
                       onClick={() => handleCopy(selectedPack.blog_post, 'blog')}
                       className="btn-secondary"
                       style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                     >
                       {copied === 'blog' ? '✓ Copied!' : 'Copy Markdown'}
                    </button>
                  </div>
                  <div className="blog-content">
                    <ReactMarkdown>{selectedPack.blog_post}</ReactMarkdown>
                  </div>
                </div>
              )}

              {activeTab === 'linkedin' && (
                <div className="glass-panel" style={{ maxWidth: '680px', margin: '0 auto', padding: '32px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0a66c2, #004182)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        in
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>Creator Post</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thought Leader • 🌐</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(selectedPack.linkedin_post, 'linkedin')}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      {copied === 'linkedin' ? '✓ Copied!' : 'Copy Post'}
                    </button>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1.02rem', color: '#e2e8f0' }}>
                    {selectedPack.linkedin_post}
                  </div>
                </div>
              )}

              {activeTab === 'shortScript' && selectedPack.short_script && (
                <div className="glass-panel" style={{ maxWidth: '680px', margin: '0 auto', padding: '32px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', display: 'inline-block' }}></span>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>Reels / TikTok Script</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(selectedPack.short_script, 'shortScript')}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      {copied === 'shortScript' ? '✓ Copied!' : 'Copy Script'}
                    </button>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                    {selectedPack.short_script}
                  </div>
                </div>
              )}

              {activeTab === 'twitter' && (
                <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {selectedPack.tweets && selectedPack.tweets.map((tweet: string, i: number) => (
                    <div key={i} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {i + 1}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>Thread Part {i + 1} of {selectedPack.tweets.length}</div>
                        </div>
                        <button 
                          onClick={() => handleCopy(tweet, `tweet-${i}`)}
                          className="btn-secondary"
                          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                        >
                          {copied === `tweet-${i}` ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '1rem', color: '#e2e8f0' }}>
                        {tweet}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '2.4rem', marginBottom: '6px' }}>Saved Content Packs</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Browse and export your previously generated campaign assets.</p>
              </div>
              <Link href="/dashboard" className="btn-primary" style={{ padding: '12px 24px' }}>
                + New Content Pack
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '0' }}></div>
                    <div style={{ padding: '20px' }}>
                      <div className="skeleton" style={{ width: '60%', height: '20px', marginBottom: '12px' }}></div>
                      <div className="skeleton" style={{ width: '40%', height: '16px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : packs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>No Saved Packs Yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Generate your first video content pack from the studio.</p>
                <Link href="/dashboard" className="btn-primary" style={{ padding: '12px 24px' }}>
                  Open Studio →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {packs.map((pack) => {
                  const videoId = getYoutubeVideoId(pack.youtube_url);
                  const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
                  const date = new Date(pack.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div 
                      key={pack.id} 
                      className="glass-panel" 
                      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--glass-border)' }}
                      onClick={() => setSelectedPack(pack)}
                    >
                      {thumb ? (
                        <div style={{ width: '100%', height: '170px', backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      ) : (
                        <div style={{ width: '100%', height: '170px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'var(--text-muted)' }}>No Thumbnail</span>
                        </div>
                      )}
                      
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 600 }}>
                            CONTENT PACK
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{date}</span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pack.youtube_url}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
