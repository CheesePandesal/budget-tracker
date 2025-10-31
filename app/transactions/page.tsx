import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, TrendingDown, Calendar, Tag, Wallet, X } from 'lucide-react';
import { getTransactions, getCategories } from '@/lib/actions';
import { formatCurrency, formatDate, calculateFinancialSummary } from '@/lib/utils';
import { Suspense } from 'react';
import { TransactionsList } from '@/components/TransactionsList';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { StatsCards } from '@/components/StatsCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'View and manage all your family transactions. Track income and expenses with detailed categorization and filtering.',
};

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);

  const { totalIncome, totalExpenses, netAmount } = calculateFinancialSummary(transactions);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-primary">Financial Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Transactions</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Track your family's income and expenses</p>
        </div>
        <AddTransactionDialog categories={categories} />
      </div>

      {/* Summary Cards */}
      <StatsCards 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netAmount={netAmount}
      />

      {/* Transactions List */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Your latest income and expense entries
              </CardDescription>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<TransactionsListSkeleton />}>
            <TransactionsList transactions={transactions} categories={categories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton for transactions list
function TransactionsListSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-gray-100 rounded-xl">
                <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="text-right ml-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}