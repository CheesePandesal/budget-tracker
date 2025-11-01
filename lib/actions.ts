'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { CreateTransactionData, Transaction, SavingsGoal } from '@/types';

export async function createTransaction(formData: CreateTransactionData) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([formData])
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    // Revalidate the transactions page to show new data
    revalidatePath('/transactions');
    revalidatePath('/');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create transaction' 
    };
  }
}

export async function updateTransaction(id: string, formData: Partial<CreateTransactionData>) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(formData)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    revalidatePath('/transactions');
    revalidatePath('/');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update transaction' 
    };
  }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }

    revalidatePath('/transactions');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete transaction' 
    };
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*)
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getCategories() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Savings Goals Actions
export interface CreateSavingsGoalData {
  name: string;
  description?: string;
  target_amount: number;
  current_amount?: number;
  target_date?: string;
  priority: number;
  is_achieved?: boolean;
}

export async function createSavingsGoal(formData: CreateSavingsGoalData) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([{
        ...formData,
        current_amount: formData.current_amount || 0,
        is_achieved: formData.is_achieved || false,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create savings goal: ${error.message}`);
    }

    revalidatePath('/savings-goals');
    revalidatePath('/');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error creating savings goal:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create savings goal' 
    };
  }
}

export async function updateSavingsGoal(id: string, formData: Partial<CreateSavingsGoalData>) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(formData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update savings goal: ${error.message}`);
    }

    revalidatePath('/savings-goals');
    revalidatePath('/');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating savings goal:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update savings goal' 
    };
  }
}

export async function deleteSavingsGoal(id: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete savings goal: ${error.message}`);
    }

    revalidatePath('/savings-goals');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete savings goal' 
    };
  }
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch savings goals: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    return [];
  }
}
