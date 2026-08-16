import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

function extractVideoId(url: string): string | null {
  try {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return longMatch[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  } catch { }
  return null;
}

async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  try {
    const res = await fetch(`https://youtube-transcript.ai/transcript/${videoId}.txt`);
    if (!res.ok) {
      throw new Error(`Failed to fetch transcript: ${res.statusText}`);
    }
    const text = await res.text();
    if (!text || text.trim() === '') {
      throw new Error('Transcript is empty');
    }
    // Extract everything after "## Transcript" if present, otherwise just return the text
    const parts = text.split('## Transcript');
    let transcriptData = parts.length > 1 ? parts[1].trim() : text.trim();
    // Remove the timestamps like [0:01] to save tokens and clean it up (optional but good)
    transcriptData = transcriptData.replace(/\[\d+:\d+\]/g, '').replace(/\s+/g, ' ').trim();
    
    return transcriptData;
  } catch (error) {
    console.error('youtube-transcript API error:', error);
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

    let query = supabase.from('content_packs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    let limit = 3;
    const now = new Date();

    if (tier === 'basic') {
      limit = 5;
      const dayOfWeek = now.getUTCDay();
      const diffToMonday = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const startOfWeekUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diffToMonday)).toISOString();
      query = query.gte('created_at', startOfWeekUTC);
    } else if (tier === 'pro') {
      limit = 10;
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Transcript error:', e.message);
      } else {
        console.error('Transcript error:', e);
      }
      return NextResponse.json({ error: 'Failed to extract transcript. Please ensure the video has English closed captions enabled.' }, { status: 400 });
    }

    // 2. Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // 3. Construct the prompt
    let prompt = `You are an elite ghostwriter and content multiplier. 
I will provide you with a raw transcript from a YouTube video. 
Your job is to convert this transcript into a "Content Pack" consisting of 4 parts.

---
RAW VIDEO TRANSCRIPT:
${fullTranscript}
---
`;

    if (voiceSample && voiceSample.trim().length > 0) {
      prompt += `

I am also providing a sample of my own writing. You MUST analyze it to understand my tone, vocabulary, formatting style, and pacing. Write the Content Pack strictly mimicking this exact voice.

---
MY WRITING SAMPLE (Voice Clone):
${voiceSample}
---`;
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
  ],
  "shortScript": "A punchy, viral 60-second script for TikTok/Instagram Reels. Include visual cues in brackets like [Quick Zoom] or [Point to Text] and keep sentences extremely short and engaging."
}`;

    // 4. Generate Content with Retry Logic
    let resultText = '';
    let maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        resultText = result.response.text();
        break; // Success
      } catch (err: any) {
        attempt++;
        console.error(`Gemini API attempt ${attempt} failed:`, err.message);
        if (attempt >= maxRetries) {
          // Check if it's a 503 error
          if (err.message?.includes('503') || err.message?.includes('high demand')) {
            return NextResponse.json({ error: 'The AI model is currently experiencing extremely high demand. Please try again in a minute.' }, { status: 503 });
          }
          throw err;
        }
        // Wait 2 seconds before retrying (exponential backoff would be better, but fixed delay is fine here)
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }
    let contentPack;
    try {
      const jsonStart = resultText.indexOf('{');
      const jsonEnd = resultText.lastIndexOf('}');
      const cleanJson = resultText.substring(jsonStart, jsonEnd + 1);
      contentPack = JSON.parse(cleanJson);
    } catch {
      console.error('Failed to parse JSON:', resultText);
      return NextResponse.json({ error: 'AI returned invalid format.' }, { status: 500 });
    }

    // Save to database
    await supabase.from('content_packs').insert({
      user_id: user.id,
      youtube_url: url,
      blog_post: contentPack.blogPost,
      linkedin_post: contentPack.linkedinPost,
      tweets: contentPack.tweets,
      short_script: contentPack.shortScript,
    });

    return NextResponse.json(contentPack);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating content:', error);
      return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
