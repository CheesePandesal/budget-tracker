'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { SavingsGoalForm, SavingsGoalFormData } from '@/components/forms/SavingsGoalForm';
import { SavingsGoal, CreateSavingsGoalData } from '@/types';
import { Pencil, Target, DollarSign, FileText } from 'lucide-react';
import { updateSavingsGoal } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface EditSavingsGoalDialogProps {
  goal: SavingsGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSavingsGoalDialog({ 
  goal, 
  open, 
  onOpenChange 
}: EditSavingsGoalDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<CreateSavingsGoalData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const promiseResolveRef = useRef<(() => void) | null>(null);
  const promiseRejectRef = useRef<((error: Error) => void) | null>(null);

  // Convert SavingsGoal to SavingsGoalFormData format
  const initialFormData: SavingsGoalFormData = {
    name: goal.name,
    description: goal.description || '',
    target_amount: goal.target_amount.toString(),
    current_amount: goal.current_amount.toString(),
    target_date: goal.target_date ? goal.target_date.split('T')[0] : '',
    priority: goal.priority.toString(),
  };

  const handleUpdateSavingsGoal = async (data: CreateSavingsGoalData): Promise<void> => {
    // Store the data and show confirmation dialog
    // Return a promise that resolves when the goal is actually updated
    return new Promise((resolve, reject) => {
      setPendingData(data);
      setShowConfirmDialog(true);
      
      // Store resolve/reject to call later
      promiseResolveRef.current = resolve;
      promiseRejectRef.current = reject;
    });
  };

  const handleConfirmUpdate = async () => {
    if (!pendingData) return;
    
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    try {
      const result = await updateSavingsGoal(goal.id, pendingData);
      if (result.success) {
        toast.success('Savings goal updated successfully!', {
          description: `${pendingData.name || goal.name}`,
        });
        onOpenChange(false);
        setPendingData(null);
        router.refresh();
        if (promiseResolveRef.current) {
          promiseResolveRef.current();
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      } else {
        console.error('Failed to update savings goal:', result.error);
        toast.error('Failed to update savings goal', {
          description: result.error,
        });
        if (promiseRejectRef.current) {
          promiseRejectRef.current(new Error(result.error));
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      }
    } catch (error) {
      console.error('Failed to update savings goal:', error);
      toast.error('Failed to update savings goal', {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="lg:w-[95vw] lg:max-w-[700px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-h-[90vh]"
        showCloseButton={true}
      >
        <DialogHeader className="space-y-2 sm:space-y-3 pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground pr-8 sm:pr-0">
            Edit Savings Goal
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Update the details for this savings goal.
          </DialogDescription>
        </DialogHeader>
        <SavingsGoalForm
          key={goal.id}
          onSubmit={handleUpdateSavingsGoal}
          initialData={initialFormData}
          isSubmitting={isSubmitting}
          mode="edit"
        />
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-full bg-primary/10 dark:bg-primary/20">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <AlertDialogTitle className="text-left">Confirm Update Savings Goal</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pl-11">
              Please review the changes before updating this savings goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingData && (
            <div className="mt-2 mb-1 p-4 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Target className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Goal Name
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {pendingData.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Target Amount
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(pendingData.target_amount)}
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
              onClick={handleConfirmUpdate} 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Confirm Update
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
