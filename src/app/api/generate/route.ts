import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

type FormatType = 'all' | 'twitter' | 'linkedin' | 'email' | 'instagram' | 'youtube';

const formatPrompts: Record<string, string> = {
  twitter: `Transform this content into a Twitter/X thread (5-10 tweets).
Rules:
- Each tweet must be under 280 characters
- Start with a hook that grabs attention
- Number each tweet (1/, 2/, etc.)
- End with a call to action
- Use line breaks between tweets
- Keep it conversational and punchy
- Include 1-2 relevant emojis per tweet maximum`,

  linkedin: `Transform this content into a professional LinkedIn post.
Rules:
- Start with a compelling hook/first line
- Use short paragraphs (1-2 sentences each)
- Add line breaks between paragraphs for readability
- Include a personal insight or lesson learned
- End with a question to encourage engagement
- Keep professional but personable tone
- 1300 characters max
- No hashtags in the main text (add 3-5 at the very end)`,

  email: `Transform this content into an email newsletter section.
Rules:
- Write a catchy subject line suggestion at the top
- Start with a friendly greeting
- Use conversational but professional tone
- Break into scannable sections
- Include one clear CTA
- Keep it concise (300-500 words)
- Add a P.S. line at the end with an extra nugget`,

  instagram: `Transform this content into an Instagram caption.
Rules:
- Start with a strong hook (first line is crucial)
- Tell a mini-story or share a relatable moment
- Keep paragraphs very short
- Use line breaks between thoughts
- End with a CTA (question, comment prompt, or save reminder)
- Add 20-30 relevant hashtags at the very end (mix of popular and niche)
- Include 2-3 emojis naturally in the text`,

  youtube: `Transform this content into a YouTube video script outline.
Rules:
- Start with a HOOK section (first 30 seconds to grab attention)
- Create clear sections with timestamps placeholder [00:00]
- Include talking points as bullet points under each section
- Add B-ROLL suggestions in [brackets]
- Include a SUBSCRIBE CTA reminder
- End with a strong conclusion and next video teaser
- Keep total length appropriate for 8-12 minute video`,
};

async function generateWithGroq(content: string, formatType: string): Promise<string> {
  const prompt = formatPrompts[formatType];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content repurposer and social media strategist. You transform content into engaging, platform-specific formats that drive engagement. Always follow the formatting rules exactly.',
        },
        {
          role: 'user',
          content: `${prompt}\n\n---\n\nOriginal Content:\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate content');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function POST(request: NextRequest) {
  try {
    const { content, format } = await request.json() as { content: string; format: FormatType };

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const results: Record<string, string> = {};
    const formatsToGenerate = format === 'all'
      ? ['twitter', 'linkedin', 'email', 'instagram', 'youtube']
      : [format];

    // Generate content for each format in parallel
    const generations = await Promise.all(
      formatsToGenerate.map(async (fmt) => {
        try {
          const generated = await generateWithGroq(content, fmt);
          return { format: fmt, content: generated };
        } catch (error) {
          console.error(`Error generating ${fmt}:`, error);
          return { format: fmt, content: `Error generating ${fmt} content. Please try again.` };
        }
      })
    );

    for (const gen of generations) {
      results[gen.format] = gen.content;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
}
