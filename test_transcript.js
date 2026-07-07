const videoId = 'NBHxNgFNcz8';
async function fetchYouTubeTranscript(videoId) {
  const INNERTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://www.youtube.com',
    'X-YouTube-Client-Name': '1',
    'X-YouTube-Client-Version': '2.20240701.00.00',
  };

  const pageRes = await fetch(`https://api.codetabs.com/v1/proxy?quest=` + encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`), { headers });
  const pageHtml = await pageRes.text();

  const playerResponseMatch = pageHtml.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;/);
  if (!playerResponseMatch) throw new Error('Could not parse YouTube page');

  const playerResponse = JSON.parse(playerResponseMatch[1]);
  const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error('No captions available for this video');
  }

  const track = captionTracks.find((t) => t.languageCode === 'en')
    || captionTracks.find((t) => t.languageCode?.startsWith('en'))
    || captionTracks[0];

  const captionUrl = `${track.baseUrl}&fmt=json3`;
  const captionRes = await fetch(`https://corsproxy.io/?` + encodeURIComponent(captionUrl), { headers });
  if (!captionRes.ok) throw new Error(`Caption fetch returned ${captionRes.status}`);

  const captionData = await captionRes.json();
  const text = captionData.events
    ?.filter((e) => e.segs)
    .flatMap((e) => e.segs.map((s) => s.utf8 || ''))
    .join(' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text || text.length < 50) throw new Error('Transcript is empty or too short');
  return text;
}

fetchYouTubeTranscript(videoId).then(console.log).catch(console.error);
