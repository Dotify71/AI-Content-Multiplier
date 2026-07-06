import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

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
    const { count } = await supabase.from('content_packs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    const limit = tier === 'unlimited' ? Infinity : tier === 'pro' ? 100 : tier === 'basic' ? 10 : 1;
    
    if (count !== null && count >= limit) {
        return NextResponse.json({ error: `You have reached your limit for the ${tier} tier. Please upgrade to generate more.` }, { status: 403 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    // 1. Fetch Transcript
    let transcriptItems = [];
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(url);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Failed to extract transcript. Please ensure the video has closed captions.' }, { status: 400 });
    }

    const fullTranscript = transcriptItems.map((item: any) => item.text).join(' ');

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
