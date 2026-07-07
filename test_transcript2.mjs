import { extract } from 'extract-youtube';

async function test() {
  const videoId = 'NBHxNgFNcz8';
  try {
    const transcript = await extract(videoId);
    console.log(transcript.substring(0, 100));
  } catch (err) {
    console.error(err);
  }
}
test();
