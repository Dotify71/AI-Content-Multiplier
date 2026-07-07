import { extract } from 'extract-youtube';

async function test() {
  try {
    const videoId = 'NBHxNgFNcz8';
    const transcript = await extract(videoId);
    console.log(transcript.substring(0, 100));
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test();
