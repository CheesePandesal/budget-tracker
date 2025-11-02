'use server';

import { GoogleGenAI } from '@google/genai';
import { getCategories } from './actions';
import type { Category } from '@/types';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY is not set in environment variables');
}

// Initialize the client (automatically picks up GEMINI_API_KEY from env)
const ai = new GoogleGenAI({});


export interface CategorySuggestion {
  category_id: string;
  category_name: string;
  confidence: number;
}

export interface ParsedTransaction {
  amount: number;
  description: string;
  category_id: string;
  transaction_type: 'income' | 'expense';
  transaction_date?: string;
  payment_method?: string;
  location?: string;
  tags?: string[];
}

export async function categorizeTransaction(
  description: string,
  isIncome: boolean = false
): Promise<CategorySuggestion> {
  try {
    // Fetch available categories from database
    const allCategories = await getCategories();
    const categories = allCategories.filter(cat => cat.is_income === isIncome);
    
    if (categories.length === 0) {
      return {
        category_id: '',
        category_name: 'Other',
        confidence: 0
      };
    }

    const categoryNames = categories.map(c => c.name).join(', ');

    const prompt = `You are a transaction categorization assistant. Categorize this transaction into ONE of these categories:
${categoryNames}

Transaction description: "${description}"

Return ONLY valid JSON (no markdown, no extra text) with this exact format:
{"category": "category_name", "confidence": 0.95}

Rules:
- Choose the most appropriate category from the list above
- Confidence should be between 0 and 1
- Return the exact category name as listed above`;

    // Check API key
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set. Please add it to your .env.local file.');
    }

    // Use the new SDK API format
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || '';
    
    if (!text) {
      throw new Error('Empty response from AI model');
    }
    
    // Clean the response (remove markdown code blocks if present)
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    let parsed;
    
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }
    
    // Find the category ID from the name
    const matchedCategory = categories.find(
      c => c.name.toLowerCase() === parsed.category.toLowerCase()
    );

    if (!matchedCategory) {
      // Fallback to "Other" category
      const otherCategory = categories.find(c => c.name === 'Other' || c.name === 'Other Income');
      return {
        category_id: otherCategory?.id || categories[0]?.id || '',
        category_name: otherCategory?.name || categories[0]?.name || 'Other',
        confidence: 0
      };
    }

    return {
      category_id: matchedCategory.id,
      category_name: matchedCategory.name,
      confidence: parsed.confidence || 0.7
    };
  } catch (error) {
    console.error('AI categorization error:', error);
    const allCategories = await getCategories();
    const categories = allCategories.filter(cat => cat.is_income === isIncome);
    const otherCategory = categories.find(c => c.name === 'Other' || c.name === 'Other Income');
    return {
      category_id: otherCategory?.id || categories[0]?.id || '',
      category_name: otherCategory?.name || categories[0]?.name || 'Other',
      confidence: 0
    };
  }
}

export async function parseNaturalLanguageTransaction(
  input: string
): Promise<ParsedTransaction> {
  try {
    // Fetch all categories
    const allCategories = await getCategories();
    const incomeCategories = allCategories.filter(c => c.is_income);
    const expenseCategories = allCategories.filter(c => !c.is_income);
    
    const incomeNames = incomeCategories.map(c => c.name).join(', ');
    const expenseNames = expenseCategories.map(c => c.name).join(', ');
    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a transaction parser. Extract transaction details from natural language.

User input: "${input}"

Available income categories: ${incomeNames}
Available expense categories: ${expenseNames}

Today's date: ${today}

Return ONLY valid JSON (no markdown, no extra text) with this exact format:
{
  "amount": 50.00,
  "description": "Grocery shopping at Walmart",
  "category": "Groceries",
  "transaction_type": "expense",
  "transaction_date": "2025-11-02",
  "payment_method": "credit_card",
  "location": "Walmart Downtown",
  "tags": ["grocery", "shopping"]
}

Rules:
- amount: positive number (extract the amount mentioned)
- description: brief description of the transaction
- category: must be one of the categories listed above (choose the most appropriate)
- transaction_type: "income" if money received, "expense" if money spent
- transaction_date: YYYY-MM-DD format. If date mentioned (yesterday, last Monday, specific date), parse it. Otherwise use today: ${today}
- payment_method: optional, one of (Cash, Credit Card, Debit Card, Bank Transfer, GCash, PayMaya, GrabPay, Other) or null
- location: optional, extract location if mentioned
- tags: optional array of relevant tags (max 3 tags)

Extract carefully and return valid JSON only.`;

    // Check API key
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set. Please add it to your .env.local file.');
    }

    // Use the new SDK API format
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || '';
    
    if (!text) {
      throw new Error('Empty response from AI model');
    }
    
    // Clean the response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    let parsed;
    
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }
    
    // Find the category ID
    const typeCategories = parsed.transaction_type === 'income' ? incomeCategories : expenseCategories;
    const matchedCategory = typeCategories.find(
      (c: Category) => c.name.toLowerCase() === parsed.category.toLowerCase()
    );

    if (!matchedCategory) {
      const otherCategory = typeCategories.find((c: Category) => c.name === 'Other' || c.name === 'Other Income');
      parsed.category_id = otherCategory?.id || typeCategories[0]?.id || '';
    } else {
      parsed.category_id = matchedCategory.id;
    }

    // Normalize payment method to match your options
    if (parsed.payment_method) {
      const paymentMethodMap: Record<string, string> = {
        'cash': 'Cash',
        'credit_card': 'Credit Card',
        'credit card': 'Credit Card',
        'debit_card': 'Debit Card',
        'debit card': 'Debit Card',
        'bank_transfer': 'Bank Transfer',
        'bank transfer': 'Bank Transfer',
        'gcash': 'GCash',
        'paymaya': 'PayMaya',
        'grabpay': 'GrabPay',
        'grab pay': 'GrabPay',
      };
      
      const normalized = paymentMethodMap[parsed.payment_method.toLowerCase()];
      if (normalized) {
        parsed.payment_method = normalized;
      }
    }

    return {
      amount: parsed.amount,
      description: parsed.description || input,
      category_id: parsed.category_id,
      transaction_type: parsed.transaction_type,
      transaction_date: parsed.transaction_date || today,
      payment_method: parsed.payment_method || undefined,
      location: parsed.location || undefined,
      tags: parsed.tags || undefined,
    };
  } catch (error) {
    console.error('AI parsing error:', error);
    throw new Error('Failed to parse transaction. Please try rephrasing your input.');
  }
}

