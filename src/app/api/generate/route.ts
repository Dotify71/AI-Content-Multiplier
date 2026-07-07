import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

// --- Custom YouTube Transcript Fetcher ---
function extractVideoId(url: string): string | null {
  try {
    // Handle youtu.be/ID format
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    // Handle youtube.com/watch?v=ID format
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return longMatch[1];
    // Handle bare 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  } catch { }
  return null;
}

async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  const INNERTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://www.youtube.com',
    'X-YouTube-Client-Name': '1',
    'X-YouTube-Client-Version': '2.20240701.00.00',
  };

  // Use YouTube InnerTube API (used by YouTube's own web client)
  const playerRes = await fetch(
    `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_API_KEY}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240701.00.00',
            hl: 'en',
            gl: 'US',
          },
        },
        videoId,
      }),
    }
  );

  if (!playerRes.ok) throw new Error(`InnerTube API returned ${playerRes.status}`);
  const playerData = await playerRes.json();

  const captionTracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!captionTracks || captionTracks.length === 0) {
    throw new Error('No captions available for this video');
  }

  // Prefer English, fallback to first available
  const track = captionTracks.find((t: any) => t.languageCode === 'en')
    || captionTracks.find((t: any) => t.languageCode?.startsWith('en'))
    || captionTracks[0];

  const captionUrl = `${track.baseUrl}&fmt=json3`;
  const captionRes = await fetch(captionUrl, { headers: { 'User-Agent': headers['User-Agent'] } });
  if (!captionRes.ok) throw new Error(`Caption fetch returned ${captionRes.status}`);

  const captionData = await captionRes.json();
  const text = captionData.events
    ?.filter((e: any) => e.segs)
    .flatMap((e: any) => e.segs.map((s: any) => s.utf8 || ''))
    .join(' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text || text.length < 50) throw new Error('Transcript is empty or too short');
  return text;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to generate content.' }, { status: 401 });
    }

    const { url, voiceSample } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Check usage limits
    const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single();
    const tier = profile?.tier || 'free';
    
    // Quick MVP rate limiting based on tier
    let query = supabase.from('content_packs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    let limit = 3;
    const now = new Date();
    
    if (tier === 'basic') {
        limit = 5; // 5 per week
        const dayOfWeek = now.getUTCDay();
        const diffToMonday = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeekUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diffToMonday)).toISOString();
        query = query.gte('created_at', startOfWeekUTC);
    } else if (tier === 'pro') {
        limit = 10; // 10 per day
        const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
        query = query.gte('created_at', startOfDayUTC);
    } else if (tier === 'unlimited') {
        limit = Infinity;
    }
    
    const { count } = await query;
    
    if (count !== null && count >= limit) {
        return NextResponse.json({ error: `You have reached your limit for the ${tier} tier. Please upgrade to generate more.` }, { status: 403 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    // 1. Extract Video ID & Fetch Transcript
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL. Please paste a valid YouTube link.' }, { status: 400 });
    }

    let fullTranscript = '';
    try {
      fullTranscript = await fetchYouTubeTranscript(videoId);
    } catch (e: any) {
      console.error('Transcript error:', e?.message);
      return NextResponse.json({ error: 'Failed to extract transcript. Please ensure the video has English closed captions enabled.' }, { status: 400 });
    }

    // 2. Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // 3. Construct the prompt
    let prompt = `You are an elite ghostwriter and content multiplier. 
I will provide you with a raw transcript from a YouTube video. 
Your job is to convert this transcript into a "Content Pack" consisting of 3 parts.

---
RAW VIDEO TRANSCRIPT:
${fullTranscript}
---
`;

    if (voiceSample && voiceSample.trim().length > 0) {
      prompt += `
I am also providing you with a sample of my own writing. You MUST analyze this writing sample to understand my tone, vocabulary, formatting style, and pacing. You MUST write the Content Pack strictly mimicking this exact voice.

---
MY WRITING SAMPLE (Voice Clone):
${voiceSample}
---
`;
    }

    prompt += `
Please output a JSON object with exactly the following structure (do NOT wrap it in markdown code blocks, just raw JSON):
{
  "blogPost": "A well-structured, SEO-friendly blog post with a catchy title, H2s, H3s, and short paragraphs.",
  "linkedinPost": "An engaging, viral-style LinkedIn post with a hook, punchy one-liners, spacing, and a clear takeaway.",
  "tweets": [
    "Tweet 1...",
    "Tweet 2...",
    "Tweet 3..."
  ]
}
`;

    // 4. Generate Content
    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    let contentPack;
    try {
       // Find the first { and last } to extract JSON
       const jsonStart = resultText.indexOf('{');
       const jsonEnd = resultText.lastIndexOf('}');
       const cleanJson = resultText.substring(jsonStart, jsonEnd + 1);
       contentPack = JSON.parse(cleanJson);
    } catch (e) {
       console.error("Failed to parse JSON:", resultText);
       return NextResponse.json({ error: 'AI returned invalid format.' }, { status: 500 });
    }

    // Save the generation to the database
    await supabase.from('content_packs').insert({
        user_id: user.id,
        youtube_url: url,
        blog_post: contentPack.blogPost,
        linkedin_post: contentPack.linkedinPost,
        tweets: contentPack.tweets
    });

    return NextResponse.json(contentPack);

  } catch (error: any) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
