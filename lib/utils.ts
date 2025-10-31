import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency in Philippine Peso (PHP)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculates the total amount for a specific transaction type
 * @param transactions - Array of transactions
 * @param type - Transaction type ('income' or 'expense')
 * @returns Total amount for the specified type
 */
export function calculateTotalByType(transactions: any[], type: 'income' | 'expense'): number {
  return transactions
    .filter(t => t.transaction_type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculates financial summary from transactions
 * @param transactions - Array of transactions
 * @returns Object containing total income, expenses, and net amount
 */
export function calculateFinancialSummary(transactions: any[]) {
  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpenses = calculateTotalByType(transactions, 'expense');
  const netAmount = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netAmount,
  };
}
