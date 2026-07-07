// Test YouTube's direct timedtext API - no scraping needed
async function fetchTranscript(videoId) {
  // Method 1: Try YouTube's timedtext API directly (public, no auth)
  const langs = ['en', 'en-US', 'en-GB'];
  
  for (const lang of langs) {
    const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3&xoaf=5&hl=en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    if (!res.ok) continue;
    const data = await res.json();
    if (!data.events || data.events.length === 0) continue;
    const text = data.events
      .filter(e => e.segs)
      .flatMap(e => e.segs.map(s => s.utf8 || ''))
      .join(' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length > 50) {
      console.log(`SUCCESS via timedtext (${lang}):`, text.substring(0, 100));
      return text;
    }
  }
  throw new Error('No captions found');
}

fetchTranscript('tB88DEBk5tw')
  .then(t => console.log('DONE'))
  .catch(e => console.error('FAIL:', e.message));
