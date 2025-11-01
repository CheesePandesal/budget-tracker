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

/**
 * Groups transactions by category
 * @param transactions - Array of transactions
 * @returns Object with category names as keys and totals as values
 */
export function groupByCategory(transactions: any[]) {
  const expenses = transactions.filter(t => t.transaction_type === 'expense');
  const grouped: Record<string, number> = {};
  
  expenses.forEach(transaction => {
    const categoryName = transaction.category?.name || 'Uncategorized';
    grouped[categoryName] = (grouped[categoryName] || 0) + transaction.amount;
  });
  
  return grouped;
}

/**
 * Gets top spending categories
 * @param transactions - Array of transactions
 * @param limit - Number of top categories to return
 * @returns Array of category objects with name and total amount
 */
export function getTopCategories(transactions: any[], limit: number = 5) {
  const grouped = groupByCategory(transactions);
  return Object.entries(grouped)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Groups transactions by month
 * @param transactions - Array of transactions
 * @returns Object with month keys (YYYY-MM) and transaction arrays as values
 */
export function groupByMonth(transactions: any[]) {
  const grouped: Record<string, any[]> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.transaction_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(transaction);
  });
  
  return grouped;
}

/**
 * Gets monthly financial summary
 * @param transactions - Array of transactions
 * @returns Array of monthly summaries sorted by date
 */
export function getMonthlySummary(transactions: any[]) {
  const grouped = groupByMonth(transactions);
  return Object.entries(grouped)
    .map(([month, monthTransactions]) => {
      const summary = calculateFinancialSummary(monthTransactions);
      return {
        month,
        ...summary,
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Formats a month string (YYYY-MM) to a readable format
 * @param monthString - Month string in YYYY-MM format
 * @returns Formatted month string (e.g., "Jan 2024")
 */
export function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-PH', { month: 'short', year: 'numeric' });
}

/**
 * Calculates percentage
 * @param value - The value
 * @param total - The total
 * @returns Percentage rounded to 1 decimal place
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
}
