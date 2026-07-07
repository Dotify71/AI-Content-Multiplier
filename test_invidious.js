// Test Invidious API approach
async function parseCaptionText(content) {
  const vttLines = content
    .split('\n')
    .filter(line =>
      line.trim() !== '' &&
      !line.startsWith('WEBVTT') &&
      !line.startsWith('NOTE') &&
      !/^\d{2}:\d{2}/.test(line) &&
      !line.includes(' --> ')
    )
    .join(' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return vttLines;
}

const INVIDIOUS_INSTANCES = [
  'https://yewtu.be',
  'https://invidious.nerdvpn.de',
  'https://inv.riverside.rocks',
];

async function fetchTranscript(videoId) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      console.log(`Trying ${instance}...`);
      const listRes = await fetch(`${instance}/api/v1/captions/${videoId}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (!listRes.ok) { console.log(`  -> HTTP ${listRes.status}`); continue; }
      const data = await listRes.json();
      const captions = data.captions ?? [];
      console.log(`  -> Found ${captions.length} caption tracks`);
      if (!captions.length) continue;

      const track = captions.find(c => c.language_code === 'en')
        ?? captions.find(c => c.language_code?.startsWith('en'))
        ?? captions[0];

      console.log(`  -> Using track: ${track.label} (${track.language_code})`);
      const captionUrl = track.url.startsWith('http') ? track.url : `${instance}${track.url}`;
      const vttRes = await fetch(captionUrl, { signal: AbortSignal.timeout(8000) });
      if (!vttRes.ok) { console.log(`  -> VTT fetch HTTP ${vttRes.status}`); continue; }
      const vttText = await vttRes.text();
      const text = await parseCaptionText(vttText);
      console.log(`  -> Text length: ${text.length}`);
      if (text.length > 50) {
        console.log(`  -> SUCCESS! First 100 chars: ${text.substring(0, 100)}`);
        return text;
      }
    } catch (err) {
      console.log(`  -> Error: ${err.message}`);
    }
  }
  throw new Error('No captions available');
}

// Test with F1 video (originally failing)
fetchTranscript('NBHxNgFNcz8')
  .then(t => console.log('\nFINAL SUCCESS:', t.substring(0, 100)))
  .catch(e => console.error('\nFINAL FAIL:', e.message));
