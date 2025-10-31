'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { Category, Transaction, TransactionFormData } from '@/types';
import { X } from 'lucide-react';
import { updateTransaction } from '@/lib/actions';

interface EditTransactionDialogProps {
  transaction: Transaction;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ 
  transaction, 
  categories, 
  open, 
  onOpenChange 
}: EditTransactionDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert Transaction to TransactionFormData format
  const initialFormData: TransactionFormData = {
    category_id: transaction.category_id,
    amount: transaction.amount.toString(),
    description: transaction.description || '',
    transaction_date: transaction.transaction_date.split('T')[0], // Extract date part only
    transaction_type: transaction.transaction_type,
    payment_method: transaction.payment_method || '',
    location: transaction.location || '',
    tags: transaction.tags || []
  };

  const handleUpdateTransaction = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await updateTransaction(transaction.id, data);
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        console.error('Failed to update transaction:', result.error);
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:w-[95vw] lg:max-w-[700px] max-h-[95vh] overflow-y-auto mx-2 sm:mx-0 p-4 sm:p-6 sm:max-h-[90vh]">
        <DialogHeader className="space-y-2 sm:space-y-3 pb-2 sm:pb-4 relative">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground pr-8">
            Edit Transaction
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Update the details for this transaction.
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-8 w-8 p-0 sm:hidden"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <TransactionForm
          key={transaction.id}
          categories={categories}
          onSubmit={handleUpdateTransaction}
          initialData={initialFormData}
          isSubmitting={isSubmitting}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}

