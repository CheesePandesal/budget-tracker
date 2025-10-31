'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { TransactionForm } from '@/components/forms/TransactionForm';
import { Category, CreateTransactionData } from '@/types';
import { Plus, X, CheckCircle2, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { createTransaction } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  categories: Category[];
  trigger?: React.ReactNode;
}

export function AddTransactionDialog({ categories, trigger }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<CreateTransactionData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const promiseResolveRef = useRef<(() => void) | null>(null);
  const promiseRejectRef = useRef<((error: Error) => void) | null>(null);

  const handleCreateTransaction = async (data: CreateTransactionData): Promise<void> => {
    // Store the data and show confirmation dialog
    // Return a promise that resolves when the transaction is actually created
    return new Promise((resolve, reject) => {
      setPendingData(data);
      setShowConfirmDialog(true);
      
      // Store resolve/reject to call later
      promiseResolveRef.current = resolve;
      promiseRejectRef.current = reject;
    });
  };

  const handleConfirmCreate = async () => {
    if (!pendingData) return;
    
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    try {
      const result = await createTransaction(pendingData);
      if (result.success) {
        toast.success('Transaction added successfully!', {
          description: `${pendingData.transaction_type === 'income' ? '+' : '-'}${formatCurrency(pendingData.amount)}`,
        });
        setOpen(false);
        setPendingData(null);
        if (promiseResolveRef.current) {
          promiseResolveRef.current();
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      } else {
        console.error('Failed to create transaction:', result.error);
        toast.error('Failed to add transaction', {
          description: result.error,
        });
        if (promiseRejectRef.current) {
          promiseRejectRef.current(new Error(result.error));
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      toast.error('Failed to add transaction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      if (promiseRejectRef.current) {
        promiseRejectRef.current(error as Error);
        promiseResolveRef.current = null;
        promiseRejectRef.current = null;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    if (promiseRejectRef.current) {
      promiseRejectRef.current(new Error('Cancelled'));
      promiseResolveRef.current = null;
      promiseRejectRef.current = null;
    }
    setPendingData(null);
  };

  const defaultTrigger = (
    <Button 
      size="lg"
      className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
    >
      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      Add Transaction
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="lg:w-[95vw] lg:max-w-[700px] max-h-[95vh] overflow-y-auto mx-2 sm:mx-0 p-4 sm:p-6 sm:max-h-[90vh]">
        <DialogHeader className="space-y-2 sm:space-y-3 pb-2 sm:pb-4 relative">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground pr-8">Add New Transaction</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Enter the details for your income or expense transaction.
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-8 w-8 p-0 sm:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <TransactionForm
          categories={categories}
          onSubmit={handleCreateTransaction}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-full bg-primary/10 dark:bg-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <AlertDialogTitle className="text-left">Confirm Add Transaction</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pl-11">
              Please review the transaction details before confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingData && (
            <div className="mt-2 mb-1 p-4 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  pendingData.transaction_type === 'income' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                }`}>
                  {pendingData.transaction_type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Transaction Type
                  </div>
                  <div className="text-sm font-semibold text-foreground capitalize">
                    {pendingData.transaction_type}
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
                    pendingData.transaction_type === 'income' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {pendingData.transaction_type === 'income' ? '+' : '-'}
                    {formatCurrency(pendingData.amount)}
                  </div>
                </div>
              </div>

              {pendingData.description && (
                <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Description
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {pendingData.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel onClick={handleCancelConfirm} disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCreate} 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Add
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
