'use client';

import { useState } from 'react';
import { Transaction, Category } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Edit, Trash2, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { EditTransactionDialog } from '@/components/EditTransactionDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteTransaction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionsList({ transactions, categories }: TransactionsListProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteTransaction(deletingTransaction.id);
      if (result.success) {
        toast.success('Transaction deleted successfully!', {
          description: `${deletingTransaction.transaction_type === 'income' ? '+' : '-'}${formatCurrency(deletingTransaction.amount)}`,
        });
        setDeletingTransaction(null);
        router.refresh();
      } else {
        console.error('Failed to delete transaction:', result.error);
        toast.error('Failed to delete transaction', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast.error('Failed to delete transaction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
          categories={categories} 
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
    <>
      <div className="divide-y divide-border">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 sm:p-6 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
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
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <div className={`text-lg sm:text-2xl font-bold ${
                    transaction.transaction_type === 'income' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setEditingTransaction(transaction)}
                    aria-label="Edit transaction"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingTransaction(transaction)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          categories={categories}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-full bg-destructive/10 dark:bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle className="text-left">Delete Transaction</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pl-11">
              This action cannot be undone. The transaction will be permanently removed from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletingTransaction && (
            <div className="mt-2 mb-1 p-4 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  deletingTransaction.transaction_type === 'income' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                }`}>
                  {deletingTransaction.transaction_type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Category
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {deletingTransaction.category?.name || 'Unknown Category'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Amount
                  </div>
                  <div className={`text-lg font-bold ${
                    deletingTransaction.transaction_type === 'income' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {deletingTransaction.transaction_type === 'income' ? '+' : '-'}
                    {formatCurrency(deletingTransaction.amount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Date
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(deletingTransaction.transaction_date)}
                  </div>
                </div>
              </div>

              {deletingTransaction.description && (
                <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Description
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {deletingTransaction.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel onClick={() => setDeletingTransaction(null)} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive/20 dark:focus:ring-destructive/40 shadow-md hover:shadow-lg transition-all"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Transaction
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
