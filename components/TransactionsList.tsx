'use client';

import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">No transactions yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Start tracking your family's finances by adding your first transaction
        </p>
        <AddTransactionDialog 
          categories={[]} 
          trigger={
            <Button size="lg" className="shadow-lg w-full sm:w-auto">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Your First Transaction
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 sm:p-6 hover:bg-muted/30 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className={`p-2 sm:p-3 rounded-xl ${
                transaction.transaction_type === 'income' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30' 
                  : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-950/30'
              } transition-colors`}>
                {transaction.transaction_type === 'income' ? (
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-base sm:text-lg truncate">
                    {transaction.category?.name || 'Unknown Category'}
                  </h4>
                  {transaction.tags && transaction.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {transaction.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {transaction.tags.length > 2 && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{transaction.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-2 line-clamp-2">
                  {transaction.description || 'No description'}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{formatDate(transaction.transaction_date)}</span>
                  </div>
                  {transaction.location && (
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span className="truncate">{transaction.location}</span>
                    </div>
                  )}
                  {transaction.payment_method && (
                    <div className="flex items-center space-x-1">
                      <span>💳</span>
                      <span className="truncate">{transaction.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right ml-2">
              <div className={`text-lg sm:text-2xl font-bold ${
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
  );
}
