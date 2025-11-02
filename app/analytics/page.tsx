import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Calendar, Wallet, LineChart, CreditCard, Target, Activity } from 'lucide-react';
import { getTransactions, getCategories } from '@/lib/actions';
import { 
  formatCurrency, 
  calculateFinancialSummary,
  getTopCategories,
  getMonthlySummary,
  formatMonth,
  calculatePercentage,
  groupByCategory,
  groupByDayOfWeek,
  groupByPaymentMethod,
  getDailySpendingVelocity,
  getCategoryTrends,
  calculateSavingsRate,
  calculateAverageTransaction,
  calculateGrowthRate
} from '@/lib/utils';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { IncomeExpenseLineChart } from '@/components/charts/IncomeExpenseLineChart';
import { WeeklySpendingPattern } from '@/components/charts/WeeklySpendingPattern';
import { PaymentMethodChart } from '@/components/charts/PaymentMethodChart';
import { DailySpendingVelocity } from '@/components/charts/DailySpendingVelocity';
import { CategoryTrendChart } from '@/components/charts/CategoryTrendChart';
import { FilterAnalyticsControls } from '@/components/FilterAnalyticsControls';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Get insights into your spending patterns, track trends, and analyze your financial data.',
};

function getMonthDateRange(monthKey: string) {
  if (monthKey === 'all') {
    return { startDate: undefined, endDate: undefined };
  }
  
  const [year, month] = monthKey.split('-');
  const startDate = `${year}-${month}-01`;
  
  // Get last day of the month
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  
  return { startDate, endDate };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const selectedMonth = params?.month || 'all';
  const { startDate, endDate } = getMonthDateRange(selectedMonth);
  
  // Fetch transactions based on filter
  // If "all" is selected, fetch all transactions; otherwise filter by the selected month
  const [allTransactions, filteredTransactions, categories] = await Promise.all([
    getTransactions(), // Always fetch all for charts to show historical context
    selectedMonth === 'all' 
      ? getTransactions() // If "all" selected, get all transactions
      : getTransactions(startDate, endDate), // Otherwise filter by selected month
    getCategories()
  ]);

  // For charts, use all transactions but filter the display when a specific month is selected
  // This provides historical context while still respecting the filter
  const monthlySummary = getMonthlySummary(allTransactions);

  // Use filtered transactions for summary cards and category breakdown
  // The filter applies to all analytics on the page
  const { totalIncome, totalExpenses, netAmount } = calculateFinancialSummary(filteredTransactions);
  const topCategories = getTopCategories(filteredTransactions, 8);
  const categoryTotals = groupByCategory(filteredTransactions);
  const totalExpensesForPercentage = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  // Additional metrics for budgeting insights
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  const avgExpenseTransaction = calculateAverageTransaction(filteredTransactions, 'expense');
  const avgIncomeTransaction = calculateAverageTransaction(filteredTransactions, 'income');
  
  // Weekly spending pattern
  const weeklySpending = groupByDayOfWeek(filteredTransactions);
  
  // Payment method breakdown
  const paymentMethods = groupByPaymentMethod(filteredTransactions);
  
  // Daily spending velocity (for current/selected month)
  const dailySpending = getDailySpendingVelocity(filteredTransactions, selectedMonth);
  
  // Month-over-month growth calculations
  const currentMonthData = monthlySummary[monthlySummary.length - 1];
  const previousMonthData = monthlySummary[monthlySummary.length - 2];
  const expenseGrowth = previousMonthData 
    ? calculateGrowthRate(currentMonthData?.totalExpenses || 0, previousMonthData.totalExpenses)
    : 0;
  const incomeGrowth = previousMonthData
    ? calculateGrowthRate(currentMonthData?.totalIncome || 0, previousMonthData.totalIncome)
    : 0;
  
  // Category trends for top 3 categories
  const top3Categories = topCategories.slice(0, 3);
  
  // Determine which months to display in charts
  let recentMonths = monthlySummary;
  
  if (selectedMonth !== 'all') {
    // When filtering by a specific month, show that month plus previous months for context
    // This allows users to see trends while focusing on the selected period
    const selectedIndex = monthlySummary.findIndex(m => m.month === selectedMonth);
    if (selectedIndex !== -1) {
      // Show selected month and up to 5 previous months (6 total) for context
      recentMonths = monthlySummary.slice(Math.max(0, selectedIndex - 5), selectedIndex + 1);
    } else {
      // If selected month not found in data, just show last 6 months
      recentMonths = monthlySummary.slice(-6);
    }
  } else {
    // When "all" is selected, show last 12 months for better readability
    recentMonths = monthlySummary.slice(-12);
  }

  // Determine page title based on selected month
  const pageTitle = selectedMonth === 'all' 
    ? 'Analytics' 
    : `Analytics - ${formatMonth(selectedMonth)}`;
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-primary">Financial Insights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{pageTitle}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {selectedMonth === 'all' 
                ? 'Get insights into your spending patterns and trends' 
                : `Analytics for ${formatMonth(selectedMonth)}`}
            </p>
          </div>
        </div>
        
        {/* Filter Controls - Integrated in Header Area */}
        <Card className="shadow-md">
          <CardContent className="p-4 sm:p-6">
            <FilterAnalyticsControls currentMonth={selectedMonth} />
          </CardContent>
        </Card>
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
                  {filteredTransactions.filter(t => t.transaction_type === 'income').length} transactions
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
                  {filteredTransactions.filter(t => t.transaction_type === 'expense').length} transactions
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
                <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
                <p className={`text-xl sm:text-2xl font-bold ${savingsRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {savingsRate >= 0 ? '+' : ''}{savingsRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {savingsRate >= 0 ? 'Positive savings' : 'Spending exceeds income'}
                </p>
              </div>
              <div className={`p-2 sm:p-3 ${savingsRate >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'} rounded-full`}>
                <Target className={`h-5 w-5 sm:h-6 sm:w-6 ${savingsRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Expense</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(avgExpenseTransaction)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Per transaction
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Income</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{formatCurrency(avgIncomeTransaction)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Per transaction
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-amber-50 dark:bg-amber-950/20 rounded-full">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expense Growth</p>
                <p className={`text-xl sm:text-2xl font-bold ${expenseGrowth >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {expenseGrowth >= 0 ? '+' : ''}{expenseGrowth.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Month-over-month
                </p>
              </div>
              <div className={`p-2 sm:p-3 ${expenseGrowth >= 0 ? 'bg-rose-50 dark:bg-rose-950/20' : 'bg-emerald-50 dark:bg-emerald-950/20'} rounded-full`}>
                {expenseGrowth >= 0 ? (
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 dark:text-rose-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Income Growth</p>
                <p className={`text-xl sm:text-2xl font-bold ${incomeGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {incomeGrowth >= 0 ? '+' : ''}{incomeGrowth.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Month-over-month
                </p>
              </div>
              <div className={`p-2 sm:p-3 ${incomeGrowth >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'} rounded-full`}>
                {incomeGrowth >= 0 ? (
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution - Donut Chart */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Spending by Category
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                {selectedMonth === 'all' 
                  ? 'Distribution of expenses across categories' 
                  : `Distribution of expenses for ${formatMonth(selectedMonth)}`}
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

      {/* Monthly Trends - Bar Chart */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Monthly Income vs Expenses
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                {selectedMonth === 'all' 
                  ? 'Compare income and expenses by month (last 12 months)' 
                  : `Monthly trends including ${formatMonth(selectedMonth)} and historical context`}
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
                {selectedMonth === 'all' 
                  ? 'Track income, expenses, and net amount over time (last 12 months)' 
                  : `Financial trends including ${formatMonth(selectedMonth)} and historical context`}
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

      {/* Weekly Spending Pattern */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Spending Pattern
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                {selectedMonth === 'all' 
                  ? 'Identify which days of the week you spend the most' 
                  : `Weekly spending pattern for ${formatMonth(selectedMonth)}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
            <WeeklySpendingPattern data={weeklySpending} />
          </Suspense>
        </CardContent>
      </Card>

      {/* Payment Method Breakdown */}
      {paymentMethods.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method Breakdown
                </CardTitle>
                <CardDescription className="mt-1 text-sm sm:text-base">
                  {selectedMonth === 'all' 
                    ? 'See how you pay for expenses' 
                    : `Payment methods used in ${formatMonth(selectedMonth)}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
              <PaymentMethodChart data={paymentMethods} />
            </Suspense>
          </CardContent>
        </Card>
      )}

      {/* Daily Spending Velocity */}
      {selectedMonth !== 'all' && (
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Daily Spending Velocity
                </CardTitle>
                <CardDescription className="mt-1 text-sm sm:text-base">
                  Track your spending throughout the month to identify spending patterns
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
              <DailySpendingVelocity data={dailySpending} />
            </Suspense>
          </CardContent>
        </Card>
      )}

      {/* Category Trends - Top Categories */}
      {top3Categories.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {top3Categories.map((category) => {
            const categoryTrend = getCategoryTrends(allTransactions, category.name, 6);
            return (
              <Card key={category.name} className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-primary" />
                        {category.name} Trend
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm">
                        Last 6 months spending trend
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>}>
                    <CategoryTrendChart data={categoryTrend} categoryName={category.name} />
                  </Suspense>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
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

