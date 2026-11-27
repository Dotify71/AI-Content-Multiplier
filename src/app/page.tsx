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
      handle: "@design_systems",
      name: "Sajid • Top Tier Design",
      date: "Masterclass Breakdown",
      text: `Creativity in web design isn't about waiting for a lightning bolt of inspiration.\n\nIt is a systematic process of connecting existing ideas.\n\n1. Stop starting from a blank canvas.\nMost designers drain their cognitive energy staring at a blank frame, obsessing over grid math. Top tier designers start with proven modular typography hierarchy and contrast.\n\n2. The $10,000 rule of visual pacing.\nLuxury websites feel expensive not because of flashy animations, but because of generous whitespace, tight letter tracking, and disciplined two-color palettes.\n\n3. Build distribution loops into your layouts.\nEvery high-ticket landing page has one job: guide the visitor's eye down a single unbroken narrative slope.`,
      stats: { replies: "54", retweets: "420", likes: "2.1K" }
    },
    linkedin: {
      title: "LinkedIn Thought Leadership",
      handle: "Agency Founder & Web Architect",
      name: "Caleb • Metics Media",
      date: "Case Study • 🌐",
      text: `How we build $10,000 scroll driven websites in hours instead of weeks:\n\nFor years, agencies charged five figures because custom WebGL transitions and interactive scroll physics took 60+ hours of senior engineering.\n\nThen we systematized our workflow:\n* Deconstruct the client's spoken vision from a 15 minute Loom\n* Map the core value proposition into single sentence friction killers\n* Use modern AI orchestration to scaffold the layout architecture\n* Spend 90% of our energy on typography polish and micro interactions\n\nThe clients don't pay for hours typed. They pay for visual authority and conversion velocity.\n\nWhat is your biggest bottleneck when taking a website from good to top tier?`,
      stats: { reactions: "612", comments: "108 comments" }
    },
    newsletter: {
      title: "Substack / Long-Form Essay",
      handle: "The Pragmatic Architect",
      name: "Editorial Masterclass",
      date: "6 min read",
      text: `### Stop Designing From a Blank Slate: The 4 Rules of High-Converting Web Design\n\nCreativity isn't an accident. It is an intentional mechanical process.\n\nWhen junior designers sit down to build a website, they open a blank document and freeze. Senior designers never start blank. They deconstruct proven design systems, isolate typographical contrasts, and assemble components like architectural scaffolding.\n\n**The Four Core Pillars:**\n1. **Typography as Structure:** If your typography alone doesn't convey authority before any images load, your layout is broken.\n2. **The Contrast Ratio:** A single warm accent against a deep charcoal canvas communicates more luxury than twelve competing neon gradients.\n3. **Content Multiplier Effect:** A single 20 minute video masterclass holds enough actionable insight for an entire week of newsletter issues and social hooks.\n4. **Friction Reduction:** Every unnecessary button or secondary link on a landing page leaks conversion intent.\n\nIf you want to create work that commands attention, abandon the blank canvas mindset.`,
      stats: { reads: "4.8K reads", claps: "215 likes" }
    },
    script: {
      title: "Short-Form Video Script (TikTok & Reels)",
      handle: "60-Second Hook",
      name: "Creator Studio",
      date: "Duration: 55s",
      text: `[HOOK: 0:00 to 0:06]\n(Talking head with punch zoom)\n"Stop using generic AI prompts for your content. It makes your brand look like a corporate press release."\n\n[TENSION: 0:06 to 0:19]\n(Cut to B-Roll showing cookie cutter robotic text)\n"Notice how every ChatGPT post uses the exact same phrases and rocket emojis? Your audience scrolls right past it because it has zero personal cadence."\n\n[THE SOLUTION: 0:19 to 0:40]\n(Screen recording of video voice extraction)\n"Instead, record a 2 minute video sharing your genuine unscripted thoughts. Extract the raw transcript and calibrate a voice vector that matches how you actually talk."\n\n[CALL TO ACTION: 0:40 to 0:55]\n"Try ContentMultiplier on your next video and watch your organic reach multiply 10x without losing your authentic voice."`,
      stats: { pacing: "Fast (145 WPM)", target: "Reels / Shorts" }
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Ambient Real Studio Background with Organic Motion */}
      <div className="hero-ambient-container">
        <div className="hero-ambient-image"></div>
      </div>

      {/* Hero Section */}
      <section className="main-container" style={{ paddingTop: '100px', paddingBottom: '70px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Subtle top pill */}
        <div className="fade-in-up" style={{ marginBottom: '24px' }}>
          <div className="badge-pill badge-pill-accent">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }}></span>
            <span>The High Ticket Editorial Studio for Video Creators</span>
          </div>
        </div>

        {/* Main Headline with unbroken natural flow */}
        <h1 className="fade-in-up delay-1 gradient-text" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.3rem)', fontWeight: 800, lineHeight: 1.15, maxWidth: '960px', margin: '0 auto 24px auto', letterSpacing: '-0.035em' }}>
          Turn 20 minute video essays into a week of <span className="gradient-text-accent" style={{ display: 'inline-block' }}>high converting writing.</span>
        </h1>

        {/* Subtitle */}
        <p className="fade-in-up delay-2" style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 40px auto', lineHeight: 1.6, fontWeight: 400 }}>
          No robotic summaries or ChatGPT fluff. ContentMultiplier transcribes your YouTube video, maps your personal cadence, and forges ready to publish essays, threads, and video hooks.
        </p>

        {/* Action CTAs */}
        <div className="fade-in-up delay-3" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/dashboard" className="btn-amber" style={{ padding: '14px 34px', fontSize: '1.05rem', borderRadius: '8px', fontWeight: 700 }}>
            Open Creator Studio <span style={{ transition: 'transform 0.2s' }}>→</span>
          </Link>
          <a href="#showcase" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            Explore Masterclass Previews
          </a>
        </div>

        {/* Quick Trust Highlights */}
        <div className="fade-in-up delay-4" style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Instant YouTube transcript parsing
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Custom tone & voice calibration
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>✓</span> 4 native formats in 5 seconds
          </div>
        </div>
      </section>

      {/* Interactive Platform Studio Showcase */}
      <section id="showcase" className="main-container" style={{ paddingBottom: '100px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="badge-pill" style={{ marginBottom: '12px' }}>Interactive Output Preview</div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Platform Native Content, Not Generic Rehashes</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto' }}>
            See how real design and strategy masterclasses transform organically for each specific platform algorithm.
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
            <span style={{ fontSize: '1rem', color: '#f59e0b' }}>✉</span> Long-Form Newsletter
          </button>
          <button 
            className={`platform-pill ${activeTab === 'script' ? 'active' : ''}`}
            onClick={() => setActiveTab('script')}
          >
            <span style={{ fontSize: '1rem', color: '#ec4899' }}>▶</span> Reels / Shorts Script
          </button>
        </div>

        {/* Preview Card Mockup */}
        <div className="glass-panel floating-lens-card" style={{ maxWidth: '840px', margin: '0 auto', padding: '36px', position: 'relative' }}>
          
          {/* Card Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0c0d12', fontSize: '1.1rem' }}>
                ✦
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {sampleOutputs[activeTab].name}
                  <span style={{ color: '#1d9bf0', fontSize: '0.85rem' }}>✓</span>
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
              Engine Velocity: 4.2s
            </span>
          </div>

        </div>
      </section>

      {/* The 3-Step Humanized Pipeline */}
      <section className="main-container" style={{ paddingBottom: '100px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge-pill" style={{ marginBottom: '12px' }}>Engine Architecture</div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '14px' }}>How We Protect Your Natural Voice</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Standard AI models dilute your opinions into bland corporate consensus. Our 3-stage engine treats your video as proprietary intellectual property.
          </p>
        </div>

        <div className="feature-grid">
          
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px', color: '#fbbf24' }}>
              01
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Raw Context Extraction</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              We bypass surface level descriptions. We extract the unedited spoken transcript with timestamps, isolating arguments and case studies while stripping out tangents and sponsorship plugs.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px', color: '#fbbf24' }}>
              02
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Cadence & Tone Calibration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Provide a paragraph of past writing or choose a tone profile. The pipeline analyzes sentence variety, punchiness, and vocabulary so the drafts sound unmistakably like you.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px', color: '#34d399' }}>
              03
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Channel Native Translation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              LinkedIn values storytelling hooks; X rewards concise thesis driven tension; Substack demands deep nuance. The engine reorganizes ideas into structures native to each feed.
            </p>
          </div>

        </div>
      </section>

      {/* Comparison: Generic AI vs ContentMultiplier */}
      <section className="main-container" style={{ paddingBottom: '100px', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: '48px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>The Difference You Can Feel</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Why serious creators avoid generic LLM prompts and switch to ContentMultiplier</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.18)' }}>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✕</span> Generic AI Prompts
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <li>• Starts with clichés like &quot;In today&apos;s fast paced digital landscape...&quot;</li>
                <li>• Overuses emojis (🚀, 💡, 🧵) and robotic bullet points</li>
                <li>• Ignores personal stories and flattens your real personality</li>
                <li>• Requires 20 minutes of prompt tweaking for a mediocre result</li>
              </ul>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✓</span> ContentMultiplier Studio
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: '#e2e8f0', fontSize: '0.95rem' }}>
                <li>• Direct, tension creating hooks written in human vernacular</li>
                <li>• Calibrated to your unique syntax, vocabulary, and pacing</li>
                <li>• Extracts your specific examples, numbers, and case studies</li>
                <li>• One click export into ready to publish Markdown drafts</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Studio Launch */}
      <section className="main-container" style={{ paddingBottom: '120px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: '64px 32px', background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12), rgba(19, 22, 31, 0.95) 70%)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>Ready to multiply your best ideas?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '580px', margin: '0 auto 36px auto' }}>
            Paste a link, check your preview, and publish across four channels in less time than it takes to brew an espresso.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-amber" style={{ padding: '16px 36px', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 700 }}>
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
