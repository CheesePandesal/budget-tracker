'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SavingsGoal } from '@/types';
import { Plus, DollarSign, CheckCircle2, Loader2 } from 'lucide-react';
import { updateSavingsGoal } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface AddMoneyDialogProps {
  goal: SavingsGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMoneyDialog({ goal, open, onOpenChange }: AddMoneyDialogProps) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const promiseResolveRef = useRef<(() => void) | null>(null);
  const promiseRejectRef = useRef<((error: Error) => void) | null>(null);

  const handleAddMoney = async (): Promise<void> => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    return new Promise((resolve, reject) => {
      setShowConfirmDialog(true);
      promiseResolveRef.current = resolve;
      promiseRejectRef.current = reject;
    });
  };

  const handleConfirmAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    const newAmount = goal.current_amount + parseFloat(amount);
    const isAchieved = newAmount >= goal.target_amount;
    
    try {
      const result = await updateSavingsGoal(goal.id, {
        current_amount: newAmount,
        is_achieved: isAchieved,
      });
      
      if (result.success) {
        toast.success('Savings updated!', {
          description: `Added ${formatCurrency(parseFloat(amount))} to ${goal.name}`,
        });
        onOpenChange(false);
        setAmount('');
        router.refresh();
        if (promiseResolveRef.current) {
          promiseResolveRef.current();
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
        
        if (isAchieved && !goal.is_achieved) {
          toast.success('🎉 Goal Achieved!', {
            description: `Congratulations! You've reached your target for ${goal.name}`,
            duration: 5000,
          });
        }
      } else {
        toast.error('Failed to update savings', {
          description: result.error,
        });
        if (promiseRejectRef.current) {
          promiseRejectRef.current(new Error(result.error));
          promiseResolveRef.current = null;
          promiseRejectRef.current = null;
        }
      }
    } catch (error) {
      toast.error('Failed to update savings', {
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

  const handleCancel = () => {
    setShowConfirmDialog(false);
    if (promiseRejectRef.current) {
      promiseRejectRef.current(new Error('Cancelled'));
      promiseResolveRef.current = null;
      promiseRejectRef.current = null;
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      onOpenChange(false);
    }
  };

  const newTotal = amount && !isNaN(parseFloat(amount))
    ? goal.current_amount + parseFloat(amount)
    : goal.current_amount;
  const newProgress = goal.target_amount > 0
    ? Math.min(100, (newTotal / goal.target_amount) * 100)
    : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Money to Goal</DialogTitle>
            <DialogDescription>
              Update your progress towards <strong>{goal.name}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddMoney();
            }}
            className="space-y-6"
          >
            {/* Current Status */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current:</span>
                <span className="font-semibold">{formatCurrency(goal.current_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target:</span>
                <span className="font-semibold">{formatCurrency(goal.target_amount)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all ${
                    (goal.current_amount / goal.target_amount) >= 1
                      ? 'bg-emerald-500'
                      : 'bg-primary'
                  }`}
                  style={{
                    width: `${Math.min(100, (goal.current_amount / goal.target_amount) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Amount to Add
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Preview */}
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">After adding:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(newTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New progress:</span>
                  <span className="font-semibold">{newProgress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full transition-all ${
                      newProgress >= 100
                        ? 'bg-emerald-500'
                        : newProgress >= 50
                        ? 'bg-primary'
                        : 'bg-primary/60'
                    }`}
                    style={{ width: `${newProgress}%` }}
                  />
                </div>
                {newTotal >= goal.target_amount && goal.current_amount < goal.target_amount && (
                  <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>You'll reach your goal! 🎉</span>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Money
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-full bg-primary/10 dark:bg-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <AlertDialogTitle className="text-left">Confirm Add Money</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pl-11">
              Add {formatCurrency(parseFloat(amount))} to <strong>{goal.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current:</span>
              <span>{formatCurrency(goal.current_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Adding:</span>
              <span className="font-semibold text-primary">
                +{formatCurrency(parseFloat(amount))}
              </span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">New Total:</span>
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(newTotal)}
                </span>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAdd}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
