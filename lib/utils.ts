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

/**
 * Groups transactions by day of week
 * @param transactions - Array of transactions
 * @returns Object with day names as keys and totals as values
 */
export function groupByDayOfWeek(transactions: any[]) {
  const expenses = transactions.filter(t => t.transaction_type === 'expense');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const grouped: Record<string, number> = {};
  
  days.forEach(day => grouped[day] = 0);
  
  expenses.forEach(transaction => {
    const date = new Date(transaction.transaction_date);
    const dayName = days[date.getDay()];
    grouped[dayName] = (grouped[dayName] || 0) + transaction.amount;
  });
  
  return days.map(day => ({ day, amount: grouped[day] }));
}

/**
 * Groups transactions by payment method
 * @param transactions - Array of transactions
 * @returns Array of payment methods with totals
 */
export function groupByPaymentMethod(transactions: any[]) {
  const expenses = transactions.filter(t => t.transaction_type === 'expense');
  const grouped: Record<string, number> = {};
  
  expenses.forEach(transaction => {
    const method = transaction.payment_method || 'Not specified';
    grouped[method] = (grouped[method] || 0) + transaction.amount;
  });
  
  return Object.entries(grouped)
    .map(([method, amount]) => ({ method, amount }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Groups transactions by day of month for spending velocity
 * @param transactions - Array of transactions
 * @param monthKey - Month key in YYYY-MM format (optional)
 * @returns Array of day totals
 */
export function getDailySpendingVelocity(transactions: any[], monthKey?: string) {
  let filtered = transactions.filter(t => t.transaction_type === 'expense');
  
  if (monthKey && monthKey !== 'all') {
    const [year, month] = monthKey.split('-');
    filtered = filtered.filter(t => {
      const date = new Date(t.transaction_date);
      return date.getFullYear() === parseInt(year) && 
             date.getMonth() + 1 === parseInt(month);
    });
  }
  
  const dailyTotals: Record<number, number> = {};
  
  filtered.forEach(transaction => {
    const date = new Date(transaction.transaction_date);
    const day = date.getDate();
    dailyTotals[day] = (dailyTotals[day] || 0) + transaction.amount;
  });
  
  // Return array for all days in month (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return days.map(day => ({
    day,
    amount: dailyTotals[day] || 0
  }));
}

/**
 * Gets category trends over time
 * @param transactions - Array of transactions
 * @param categoryName - Name of the category
 * @param monthsCount - Number of recent months to analyze
 * @returns Array of monthly totals for the category
 */
export function getCategoryTrends(transactions: any[], categoryName: string, monthsCount: number = 6) {
  const expenses = transactions.filter(
    t => t.transaction_type === 'expense' && 
    (t.category?.name || 'Uncategorized') === categoryName
  );
  
  const monthlyData: Record<string, number> = {};
  
  expenses.forEach(transaction => {
    const date = new Date(transaction.transaction_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + transaction.amount;
  });
  
  const sortedMonths = Object.keys(monthlyData)
    .sort()
    .slice(-monthsCount);
  
  return sortedMonths.map(month => ({
    month,
    amount: monthlyData[month] || 0
  }));
}

/**
 * Calculates savings rate
 * @param totalIncome - Total income
 * @param totalExpenses - Total expenses
 * @returns Savings rate as percentage
 */
export function calculateSavingsRate(totalIncome: number, totalExpenses: number): number {
  if (totalIncome === 0) return 0;
  const savings = totalIncome - totalExpenses;
  return Math.round((savings / totalIncome) * 100 * 10) / 10;
}

/**
 * Calculates average transaction size
 * @param transactions - Array of transactions
 * @param type - Transaction type ('income' or 'expense')
 * @returns Average transaction amount
 */
export function calculateAverageTransaction(transactions: any[], type: 'income' | 'expense'): number {
  const filtered = transactions.filter(t => t.transaction_type === type);
  if (filtered.length === 0) return 0;
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  return Math.round((total / filtered.length) * 100) / 100;
}

/**
 * Calculates month-over-month growth rate
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Growth rate as percentage
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}
