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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <DashboardNavbar />
      <div className="main-container fade-in-up delay-1" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        
        {selectedPack ? (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <button 
              onClick={() => setSelectedPack(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ← Back to History
            </button>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              <button className={activeTab === 'blog' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('blog')} style={{ padding: '8px 24px' }}>Blog Post</button>
              <button className={activeTab === 'linkedin' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('linkedin')} style={{ padding: '8px 24px' }}>LinkedIn</button>
              <button className={activeTab === 'twitter' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('twitter')} style={{ padding: '8px 24px' }}>Twitter</button>
            </div>

            <div className="fade-in-up">
              {activeTab === 'blog' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {getYoutubeVideoId(selectedPack.youtube_url) && (
                    // eslint-disable-next-line
                    <img src={`https://img.youtube.com/vi/${getYoutubeVideoId(selectedPack.youtube_url)}/maxresdefault.jpg`} alt="Video Thumbnail" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '60px 80px', position: 'relative' }} className="blog-content">
                    <button 
                       onClick={() => handleCopy(selectedPack.blog_post, 'blog')}
                       style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                     >
                       {copied === 'blog' ? '✓ Copied!' : '📋 Copy Markdown'}
                    </button>
                     <ReactMarkdown>{selectedPack.blog_post}</ReactMarkdown>
                  </div>
                </div>
              )}

              {activeTab === 'linkedin' && (
                <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                  <button 
                    onClick={() => handleCopy(selectedPack.linkedin_post, 'linkedin')}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {copied === 'linkedin' ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-solid)' }}></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>Your Name</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Just now • 🌍</div>
                    </div>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '1.05rem', color: '#ddd' }}>
                    {selectedPack.linkedin_post}
                  </div>
                </div>
              )}

              {activeTab === 'twitter' && (
                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {selectedPack.tweets && selectedPack.tweets.map((tweet: string, i: number) => (
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
        ) : (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Content History</h1>
                <p style={{ color: 'var(--text-secondary)' }}>All your previously generated content packs.</p>
              </div>
              <Link href="/dashboard" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem', textDecoration: 'none' }}>
                + Generate New
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
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
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>No History Yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You haven&apos;t generated any content packs yet.</p>
                <Link href="/dashboard" className="btn-primary" style={{ padding: '12px 24px', display: 'inline-block', textDecoration: 'none' }}>
                  Generate Your First Pack
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {packs.map((pack) => {
                  const videoId = getYoutubeVideoId(pack.youtube_url);
                  const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
                  const date = new Date(pack.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div 
                      key={pack.id} 
                      className="glass-panel" 
                      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      onClick={() => setSelectedPack(pack)}
                    >
                      {thumb ? (
                        <div style={{ width: '100%', height: '180px', backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      ) : (
                        <div style={{ width: '100%', height: '180px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>No Thumbnail</span>
                        </div>
                      )}
                      
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>CONTENT PACK</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{date}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
