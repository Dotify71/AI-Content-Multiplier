import { NextResponse } from 'next/server';
// @ts-ignore
import { extract } from 'extract-youtube';
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
  try {
    const transcript = await extract(videoId);
    if (!transcript || transcript.length < 50) {
      throw new Error('Transcript is empty or too short');
    }
    return transcript;
  } catch (error) {
    console.error('extract-youtube error:', error);
    throw new Error('No captions available for this video');
  }
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
