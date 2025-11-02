import { NextResponse } from 'next/server';
import { categorizeTransaction } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { description, transaction_type } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const isIncome = transaction_type === 'income';
    const result = await categorizeTransaction(description, isIncome);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Categorization error:', error);
    return NextResponse.json(
      { error: 'Failed to categorize transaction' },
      { status: 500 }
    );
  }
}

