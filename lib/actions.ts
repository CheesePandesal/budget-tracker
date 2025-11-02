'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { CreateTransactionData, Transaction, SavingsGoal, CreateSavingsGoalData } from '@/types';

export async function createTransaction(formData: CreateTransactionData) {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // TEMPORARY: For development - allow transactions without auth
    // TODO: Remove this and implement proper authentication
    const isAuthenticated = !authError && user;
    
    if (!isAuthenticated) {
      console.warn('⚠️ Creating transaction without authentication (development mode)');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...formData,
        user_id: isAuthenticated ? user.id : null
      }])
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
    revalidatePath('/analytics');
    
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // TEMPORARY: For development - allow updates without auth
    const isAuthenticated = !authError && user;
    
    let query = supabase
      .from('transactions')
      .update(formData)
      .eq('id', id);
    
    // Only filter by user_id if authenticated
    if (isAuthenticated) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query
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
    revalidatePath('/analytics');
    
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // TEMPORARY: For development - allow deletes without auth
    const isAuthenticated = !authError && user;
    
    let query = supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    // Only filter by user_id if authenticated
    if (isAuthenticated) {
      query = query.eq('user_id', user.id);
    }

    const { error } = await query;

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }

    revalidatePath('/transactions');
    revalidatePath('/');
    revalidatePath('/analytics');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete transaction' 
    };
  }
}

export async function getTransactions(startDate?: string, endDate?: string): Promise<Transaction[]> {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // TEMPORARY: For development - show all transactions if not authenticated
    // TODO: Remove this and implement proper authentication
    const isAuthenticated = !authError && user;

    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*)
      `);

    // Only filter by user_id if authenticated
    if (isAuthenticated) {
      query = query.eq('user_id', user.id);
    }

    // Apply date range filters if provided
    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query.order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
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
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Savings Goals Actions
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // TEMPORARY: For development - show all goals if not authenticated
    const isAuthenticated = !authError && user;

    let query = supabase
      .from('savings_goals')
      .select('*');

    // Only filter by user_id if authenticated
    if (isAuthenticated) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching savings goals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    return [];
  }
}
