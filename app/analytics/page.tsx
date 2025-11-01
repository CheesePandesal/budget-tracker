import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Calendar, Wallet, LineChart } from 'lucide-react';
import { getTransactions, getCategories } from '@/lib/actions';
import { 
  formatCurrency, 
  calculateFinancialSummary,
  getTopCategories,
  getMonthlySummary,
  formatMonth,
  calculatePercentage,
  groupByCategory
} from '@/lib/utils';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { IncomeExpenseLineChart } from '@/components/charts/IncomeExpenseLineChart';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Get insights into your spending patterns, track trends, and analyze your financial data.',
};

export default async function AnalyticsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);

  const { totalIncome, totalExpenses, netAmount } = calculateFinancialSummary(transactions);
  const topCategories = getTopCategories(transactions, 8);
  const monthlySummary = getMonthlySummary(transactions);
  const categoryTotals = groupByCategory(transactions);
  const totalExpensesForPercentage = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Get last 6 months of data
  const recentMonths = monthlySummary.slice(-6);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-primary">Financial Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Get insights into your spending patterns and trends</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {transactions.filter(t => t.transaction_type === 'income').length} transactions
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-full">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-xl sm:text-2xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {transactions.filter(t => t.transaction_type === 'expense').length} transactions
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                <p className={`text-xl sm:text-2xl font-bold ${netAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(netAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {netAmount >= 0 ? 'Positive balance' : 'Negative balance'}
                </p>
              </div>
              <div className={`p-2 sm:p-3 ${netAmount >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'} rounded-full`}>
                {netAmount >= 0 ? (
                  <TrendingUp className={`h-5 w-5 sm:h-6 sm:w-6 ${netAmount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                ) : (
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-xl sm:text-2xl font-bold text-violet-600">{Object.keys(categoryTotals).length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active expense categories
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-violet-50 dark:bg-violet-950/20 rounded-full">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution - Donut Chart */}
      {topCategories.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Spending by Category
                </CardTitle>
                <CardDescription className="mt-1 text-sm sm:text-base">
                  Distribution of expenses across categories
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
              <CategoryPieChart data={topCategories} total={totalExpensesForPercentage} />
            </Suspense>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trends - Bar Chart */}
      {recentMonths.length > 0 && (
        <>
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Monthly Income vs Expenses
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm sm:text-base">
                    Compare income and expenses by month
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
                <MonthlyBarChart data={recentMonths} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Income vs Expenses Trend - Line Chart */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Financial Trend
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm sm:text-base">
                    Track income, expenses, and net amount over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
                <IncomeExpenseLineChart data={recentMonths} />
              </Suspense>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 p-4 bg-muted rounded-full w-fit">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start adding transactions to see analytics and insights
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

