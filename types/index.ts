export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_income: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  transaction_date: string;
  transaction_type: 'income' | 'expense';
  payment_method?: string;
  location?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period_type: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  priority: number;
  is_achieved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// Form types
export interface TransactionFormData {
  category_id: string;
  amount: string;
  description: string;
  transaction_date: string;
  transaction_type: 'income' | 'expense';
  payment_method: string;
  location: string;
  tags: string[];
}

export interface CreateTransactionData {
  category_id: string;
  amount: number;
  description?: string;
  transaction_date: string;
  transaction_type: 'income' | 'expense';
  payment_method?: string;
  location?: string;
  tags?: string[];
}

export interface CreateSavingsGoalData {
  name: string;
  description?: string;
  target_amount: number;
  current_amount?: number;
  target_date?: string;
  priority: number;
  is_achieved?: boolean;
}