"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'newsletter' | 'script'>('twitter');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const sampleOutputs = {
    twitter: {
      title: "Viral X / Twitter Thread",
      handle: "@alex_creator",
      name: "Alex Rivera",
      date: "2h ago",
      text: `Most founders build features.\n\nThe best founders build distribution loops.\n\nHere are 5 counter-intuitive lessons from bootstrapping to $50k MRR without spending a dollar on paid ads: 🧵\n\n1/ Repurposing is not copy-pasting.\nA 20-minute video contains at least 3 distinct arguments. Treat each argument as an independent thesis, not a summary.\n\n2/ The first 3 lines decide everything.\nIf your hook doesn't create tension or challenge common wisdom, your body text will never be read.`,
      stats: { replies: "48", retweets: "312", likes: "1.8K" }
    },
    linkedin: {
      title: "LinkedIn Thought Leadership",
      handle: "founder & creator",
      name: "Sarah Chen",
      date: "3h • Edited",
      text: `I spent 40 hours last month writing blogs that got zero organic traffic.\n\nThen I made one simple shift:\n\nInstead of starting from a blank Google Doc, I recorded a 15-minute voice note walking through our customer churn post-mortem.\n\nHere is what happened next:\n→ Converted the transcript into 3 granular LinkedIn case studies\n→ Generated 42,000 impressions in 4 days\n→ Landed 2 enterprise sales calls\n\nYour spoken voice is always 10x more authentic than your typing voice. The secret is capturing that raw spoken intuition and structuring it for the feed.\n\nWhat is your process for turning ideas into content?`,
      stats: { reactions: "486", comments: "94 comments" }
    },
    newsletter: {
      title: "Substack / Long-Form Essay",
      handle: "The Pragmatic Architect",
      name: "David Kim",
      date: "5 min read",
      text: `### The Death of the Generic Software Generalist\n\nOver the past eighteen months, the software industry crossed a silent inflection point. The bottleneck is no longer how quickly you can write a CRUD endpoint or patch a CSS layout.\n\nAI generates syntax in milliseconds. What it cannot do is understand the political trade-offs between two database models inside a distributed team.\n\n**The Three New Core Competencies:**\n1. **System Topology & Isolation:** Designing components that fail gracefully without cascading downtime.\n2. **Business Metric Mapping:** Knowing which engineering trade-off directly shifts retention.\n3. **Orchestration Over Authorship:** Directing agents, reviewing boundary conditions, and verifying outputs rather than hand-typing boilerplate.\n\nIf you want to stay indispensable, stop optimizing for typing speed. Start optimizing for architectural judgment.`,
      stats: { reads: "3.2K reads", claps: "142 likes" }
    },
    script: {
      title: "Short-Form Video Script (TikTok & Reels)",
      handle: "60-Second Hook",
      name: "Creator Studio",
      date: "Duration: 52s",
      text: `[HOOK - 0:00 to 0:05]\n(Talking head with punch zoom)\n"Stop using ChatGPT to write your tweets. You're literally burning your audience's trust in real time."\n\n[TENSION - 0:05 to 0:18]\n(Cut to B-Roll showing robotic text)\n"Notice how every AI post starts with 'In today's fast-paced digital world'? It's sterile. Nobody connects with a corporate press release."\n\n[THE SOLUTION - 0:18 to 0:38]\n(Screen recording of video voice extraction)\n"Instead, record a 2-minute voice clip talking naturally to a friend. Run it through a voice-cloned model that keeps your filler rhythm and cadence."\n\n[CALL TO ACTION - 0:38 to 0:50]\n"Drop 'STUDIO' in the comments and I'll send you the exact workflow we use to generate 30 posts a week."`,
      stats: { pacing: "Fast (145 WPM)", target: "Reels / Shorts" }
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Hero Section */}
      <section className="main-container" style={{ paddingTop: '100px', paddingBottom: '70px', textAlign: 'center', position: 'relative' }}>
        
        {/* Subtle top pill */}
        <div className="fade-in-up" style={{ marginBottom: '24px' }}>
          <div className="badge-pill badge-pill-accent">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }}></span>
            <span>The Editorial Engine for Video Creators</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="fade-in-up delay-1 gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.12, maxWidth: '960px', margin: '0 auto 24px auto', letterSpacing: '-0.035em' }}>
          Turn 20-minute video essays into a week of <span className="gradient-text-accent">high-converting writing.</span>
        </h1>

        {/* Subtitle */}
        <p className="fade-in-up delay-2" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 40px auto', lineHeight: 1.6, fontWeight: 400 }}>
          No cookie-cutter robotic summaries. We transcribe your YouTube video, map your personal writing cadence, and forge platform-native threads, essays, and hooks.
        </p>

        {/* Action CTAs */}
        <div className="fade-in-up delay-3" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Open Creator Studio <span style={{ transition: 'transform 0.2s' }}>→</span>
          </Link>
          <a href="#showcase" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            View Live Examples
          </a>
        </div>

        {/* Quick Trust Highlights */}
        <div className="fade-in-up delay-4" style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Full YouTube transcript extraction
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Custom tone & voice calibration
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>✓</span> 4 native formats in 30 seconds
          </div>
        </div>
      </section>

      {/* Interactive Platform Studio Showcase */}
      <section id="showcase" className="main-container" style={{ paddingBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="badge-pill" style={{ marginBottom: '12px' }}>Interactive Output Preview</div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Platform-Native Content, Not Generic Rehashes</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            See how the same video idea transforms organically for each specific audience and algorithm.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <button 
            className={`platform-pill ${activeTab === 'twitter' ? 'active' : ''}`}
            onClick={() => setActiveTab('twitter')}
          >
            <span style={{ fontSize: '1rem' }}>𝕏</span> X / Twitter Thread
          </button>
          <button 
            className={`platform-pill ${activeTab === 'linkedin' ? 'active' : ''}`}
            onClick={() => setActiveTab('linkedin')}
          >
            <span style={{ fontSize: '1rem', color: '#0a66c2' }}>in</span> LinkedIn Article
          </button>
          <button 
            className={`platform-pill ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletter')}
          >
            <span style={{ fontSize: '1rem', color: '#ff6719' }}>✉</span> Long-Form Newsletter
          </button>
          <button 
            className={`platform-pill ${activeTab === 'script' ? 'active' : ''}`}
            onClick={() => setActiveTab('script')}
          >
            <span style={{ fontSize: '1rem', color: '#ec4899' }}>▶</span> Reels / Shorts Script
          </button>
        </div>

        {/* Preview Card Mockup */}
        <div className="glass-panel" style={{ maxWidth: '820px', margin: '0 auto', padding: '32px', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 17, 26, 0.85)', boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.7)' }}>
          
          {/* Card Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>
                {sampleOutputs[activeTab].name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {sampleOutputs[activeTab].name}
                  {activeTab === 'twitter' && <span style={{ color: '#1d9bf0', fontSize: '0.85rem' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {sampleOutputs[activeTab].handle} • {sampleOutputs[activeTab].date}
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleCopy(sampleOutputs[activeTab].text, activeTab)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '6px' }}
            >
              {copiedTab === activeTab ? '✓ Copied to clipboard' : 'Copy Sample'}
            </button>
          </div>

          {/* Body Content */}
          <div style={{ minHeight: '220px', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1.02rem', color: '#e2e8f0' }}>
            {sampleOutputs[activeTab].text}
          </div>

          {/* Card Footer Bar */}
          <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {Object.entries(sampleOutputs[activeTab].stats).map(([k, v]) => (
                <span key={k} style={{ textTransform: 'capitalize' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>{v}</strong> {k}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 10px', borderRadius: '12px' }}>
              Generated in 12s
            </span>
          </div>

        </div>
      </section>

      {/* The 3-Step Humanized Pipeline */}
      <section className="main-container" style={{ paddingBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge-pill" style={{ marginBottom: '12px' }}>Engine Architecture</div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '14px' }}>How We Protect Your Natural Voice</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Standard AI models dilute your opinions into bland consensus. Our 3-stage engine treats your video as proprietary raw intellectual property.
          </p>
        </div>

        <div className="feature-grid">
          
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px', color: '#818cf8' }}>
              01
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Raw Context Extraction</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              We bypass surface-level video descriptions. We extract the unedited spoken transcript, isolating your actual arguments, stories, and timestamps while stripping out filler tangents and sponsorship segments.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px', color: '#fbbf24' }}>
              02
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Cadence & Tone Mapping</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Provide a paragraph of your past writing or select a tone profile. Our pipeline analyzes sentence variety, humor, punchiness, and vocabulary so the drafts sound unmistakably like you.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px', color: '#34d399' }}>
              03
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Channel-Native Packaging</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              LinkedIn values storytelling hooks; X rewards concise thesis-driven tension; Substack demands deep nuance. The engine reorganizes your ideas into formats native to how each platform is actually read.
            </p>
          </div>

        </div>
      </section>

      {/* Comparison: Generic AI vs ContentMultiplier */}
      <section className="main-container" style={{ paddingBottom: '100px' }}>
        <div className="glass-panel" style={{ padding: '48px 36px', background: 'rgba(12, 14, 21, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>The Difference You Can Feel</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Why creators switch from generic LLM prompts to ContentMultiplier</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✕</span> Generic AI Prompts
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <li>• Starts with clichés like &quot;In today&apos;s fast-paced digital landscape...&quot;</li>
                <li>• Overuses emojis (🚀, 💡, 🧵) and robotic bullet points</li>
                <li>• Ignores personal stories and flattens your real personality</li>
                <li>• Requires 20 minutes of prompt tweaking for a mediocre result</li>
              </ul>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✓</span> ContentMultiplier Studio
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: '#e2e8f0', fontSize: '0.95rem' }}>
                <li>• Direct, tension-creating hooks written in human vernacular</li>
                <li>• Calibrated to your unique syntax, vocabulary, and pacing</li>
                <li>• Extracts your specific examples, numbers, and case studies</li>
                <li>• One-click export into ready-to-publish drafts</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Studio Launch */}
      <section className="main-container" style={{ paddingBottom: '120px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '64px 32px', background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), rgba(15, 17, 26, 0.95) 70%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>Ready to multiply your best ideas?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '580px', margin: '0 auto 36px auto' }}>
            Paste a link, check your preview, and publish across four channels in less time than it takes to brew a coffee.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
              Launch Studio Free →
            </Link>
            <Link href="/pricing" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              View Creator Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
