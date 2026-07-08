async function fetchYouTubeTranscript(videoId) {
  try {
    const res = await fetch(`https://youtube-transcript.ai/transcript/${videoId}.txt`);
    if (!res.ok) {
      throw new Error(`Failed to fetch transcript: ${res.statusText}`);
    }
    const text = await res.text();
    if (!text || text.trim() === '') {
      throw new Error('Transcript is empty');
    }
    const parts = text.split('## Transcript');
    let transcriptData = parts.length > 1 ? parts[1].trim() : text.trim();
    transcriptData = transcriptData.replace(/\[\d+:\d+\]/g, '').replace(/\s+/g, ' ').trim();
    return transcriptData;
  } catch (error) {
    console.error('API error:', error);
  }
}
fetchYouTubeTranscript('81PsbDKhoBY').then(t => console.log(t.substring(0, 100)));
