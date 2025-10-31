'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { Category } from '@/types';
import { Plus, X } from 'lucide-react';
import { createTransaction } from '@/lib/actions';

interface AddTransactionDialogProps {
  categories: Category[];
  trigger?: React.ReactNode;
}

export function AddTransactionDialog({ categories, trigger }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTransaction = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createTransaction(data);
      if (result.success) {
        setOpen(false);
      } else {
        console.error('Failed to create transaction:', result.error);
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    </Dialog>
  );
}
