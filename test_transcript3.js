const { YouTubeTranscriptApi } = require('youtube-captions-api');

async function test() {
  const videoId = 'NBHxNgFNcz8';
  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetch(videoId);
    console.log(transcript.map(t => t.text).join(' ').substring(0, 100));
  } catch (err) {
    console.error(err);
  }
}
test();
