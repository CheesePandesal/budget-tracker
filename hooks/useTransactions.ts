'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Transaction, CreateTransactionData, Category } from '@/types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Using the supabase client from lib

  // Fetch transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*)
      `)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    setTransactions(data || []);
  };

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    setCategories(data || []);
  };

  // Create transaction
  const createTransaction = async (transactionData: CreateTransactionData) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    setTransactions(prev => [data, ...prev]);
    return data;
  };

  // Update transaction
  const updateTransaction = async (id: string, transactionData: Partial<CreateTransactionData>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(transactionData)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    setTransactions(prev => 
      prev.map(t => t.id === id ? data : t)
    );
    return data;
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  return {
    transactions,
    categories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
}
