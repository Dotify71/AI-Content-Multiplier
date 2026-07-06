"use client";

import { useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [voiceSample, setVoiceSample] = useState("");

  return (
    <div className="main-container fade-in-up delay-1" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Create Content Pack</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Enter a YouTube video and a sample of your writing style.</p>
        
        <div className="glass-panel">
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

          <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
            Generate Content Pack
          </button>
        </div>
      </div>
    </div>
  );
}
