const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
  const videoId = 'KIwcSp99PoY';
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log("SUCCESS:", transcript.slice(0, 3).map(t => t.text));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
test();
