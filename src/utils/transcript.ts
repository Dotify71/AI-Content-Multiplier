import { YoutubeTranscript } from 'youtube-transcript';

export async function getCleanTranscript(videoId: string): Promise<string> {
  // Strategy 1: Try English captions via youtube-transcript
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    if (items && items.length > 0) {
      const text = items.map(i => i.text).join(' ').replace(/\s+/g, ' ').trim();
      if (text.length > 100) return text;
    }
  } catch (err: any) {
    console.warn(`[Transcript] English fetch failed for ${videoId}:`, err.message);
  }

  // Strategy 2: Fallback to any language available
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    if (items && items.length > 0) {
      const text = items.map(i => i.text).join(' ').replace(/\s+/g, ' ').trim();
      if (text.length > 100) return text;
    }
  } catch (err: any) {
    console.warn(`[Transcript] Default fetch failed for ${videoId}:`, err.message);
  }

  // Strategy 3: Try timedtext directly from YouTube
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const pageHtml = await pageRes.text();
    const captionMatch = pageHtml.match(/"captionTracks":\s*(\[.*?\])/);
    if (captionMatch) {
      const tracks = JSON.parse(captionMatch[1]);
      const englishTrack = tracks.find((t: any) => t.languageCode === 'en' || t.languageCode.startsWith('en')) || tracks[0];
      if (englishTrack && englishTrack.baseUrl) {
        const transcriptRes = await fetch(englishTrack.baseUrl);
        const xml = await transcriptRes.text();
        const text = xml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
        if (text.length > 100) return text;
      }
    }
  } catch (err: any) {
    console.warn(`[Transcript] Timedtext scrape failed for ${videoId}:`, err.message);
  }

  throw new Error('Could not find captions for this YouTube video. Please ensure the video has subtitles or closed captions enabled.');
}
