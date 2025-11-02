import { NextResponse } from 'next/server';
import { parseNaturalLanguageTransaction } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    const result = await parseNaturalLanguageTransaction(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Parse error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse transaction';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

