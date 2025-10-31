'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Transaction, CreateTransactionData, Category } from '@/types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Using the supabase client from lib

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      console.log('Fetched transactions:', data);
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
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
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTransactions(), fetchCategories()]);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    transactions,
    categories,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
}
