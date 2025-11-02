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
import { SavingsGoalForm } from '@/components/forms/SavingsGoalForm';
import { CreateSavingsGoalData } from '@/types';
import { Plus, CheckCircle2, Target, DollarSign, FileText, Calendar, Star } from 'lucide-react';
import { createSavingsGoal } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface AddSavingsGoalDialogProps {
  trigger?: React.ReactNode;
}

export function AddSavingsGoalDialog({ trigger }: AddSavingsGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<CreateSavingsGoalData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const promiseResolveRef = useRef<(() => void) | null>(null);
  const promiseRejectRef = useRef<((error: Error) => void) | null>(null);

  const handleCreateSavingsGoal = async (data: CreateSavingsGoalData): Promise<void> => {
    // Store the data and show confirmation dialog
    // Return a promise that resolves when the goal is actually created
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
      const result = await createSavingsGoal(pendingData);
      if (result.success) {
        toast.success('Savings goal created successfully!', {
          description: `${pendingData.name} - ${formatCurrency(pendingData.current_amount || 0)} / ${formatCurrency(pendingData.target_amount)}`,
        });
        setOpen(false);
        setPendingData(null);
        if (promiseResolveRef.current) {
          promiseResolveRef.current();
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      } else {
        console.error('Failed to create savings goal:', result.error);
        toast.error('Failed to create savings goal', {
          description: result.error,
        });
        if (promiseRejectRef.current) {
          promiseRejectRef.current(new Error(result.error));
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      }
    } catch (error) {
      console.error('Failed to create savings goal:', error);
      toast.error('Failed to create savings goal', {
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
      Add Goal
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent 
        className="lg:w-[95vw] lg:max-w-[700px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-h-[90vh]"
        showCloseButton={true}
      >
        <DialogHeader className="space-y-2 sm:space-y-3 pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground pr-8 sm:pr-0">Add New Savings Goal</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Create a new savings goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <SavingsGoalForm
          onSubmit={handleCreateSavingsGoal}
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
              <AlertDialogTitle className="text-left">Confirm Add Savings Goal</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pl-11">
              Please review the savings goal details before confirming.
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

              {pendingData.current_amount !== undefined && pendingData.current_amount > 0 && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Current Amount
                    </div>
                    <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(pendingData.current_amount)}
                    </div>
                  </div>
                </div>
              )}

              {pendingData.target_date && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Target Date
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {new Date(pendingData.target_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              )}

              {pendingData.priority && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className={`p-2 rounded-lg ${
                    pendingData.priority === 1
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                      : pendingData.priority === 2
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400'
                  }`}>
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Priority
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {pendingData.priority === 1 ? 'High Priority' : pendingData.priority === 2 ? 'Medium Priority' : 'Low Priority'}
                    </div>
                  </div>
                </div>
              )}

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
                  Creating...
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
