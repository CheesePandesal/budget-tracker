'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types';
import { Plus, TrendingUp, TrendingDown, Calendar, Tag, Wallet } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, categories, loading, error, createTransaction } = useTransactions();
  const [open, setOpen] = useState(false);

  const handleCreateTransaction = async (data: any) => {
    try {
      await createTransaction(data);
      setOpen(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Financial Management</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">Track your family's income and expenses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-foreground">Add New Transaction</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Enter the details for your income or expense transaction.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm
              categories={categories}
              onSubmit={handleCreateTransaction}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-bold text-rose-600 mt-1">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${netAmount >= 0 ? 'border-l-primary' : 'border-l-amber-500'} shadow-md hover:shadow-lg transition-shadow`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                <p className={`text-3xl font-bold mt-1 ${netAmount >= 0 ? 'text-primary' : 'text-amber-600'}`}>
                  {formatCurrency(netAmount)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${netAmount >= 0 ? 'bg-primary/10' : 'bg-amber-50 dark:bg-amber-950/20'}`}>
                {netAmount >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-primary" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Transactions List */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <CardDescription className="mt-1">
                Your latest income and expense entries
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-6">Start tracking your family's finances by adding your first transaction</p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="shadow-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-foreground">Add New Transaction</DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">
                      Enter the details for your income or expense transaction.
                    </DialogDescription>
                  </DialogHeader>
                  <TransactionForm
                    categories={categories}
                    onSubmit={handleCreateTransaction}
                    loading={loading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.transaction_type === 'income' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30' 
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-950/30'
                      } transition-colors`}>
                        {transaction.transaction_type === 'income' ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-lg truncate">
                            {transaction.category?.name || 'Unknown Category'}
                          </h4>
                          {transaction.tags && transaction.tags.length > 0 && (
                            <div className="flex space-x-1">
                              {transaction.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {transaction.tags.length > 2 && (
                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                  +{transaction.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2 line-clamp-2">
                          {transaction.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(transaction.transaction_date)}</span>
                          </div>
                          {transaction.location && (
                            <div className="flex items-center space-x-1">
                              <span>📍</span>
                              <span>{transaction.location}</span>
                            </div>
                          )}
                          {transaction.payment_method && (
                            <div className="flex items-center space-x-1">
                              <span>💳</span>
                              <span>{transaction.payment_method}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        transaction.transaction_type === 'income' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {transaction.transaction_type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
