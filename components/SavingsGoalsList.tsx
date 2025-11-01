'use client';

import { useState } from 'react';
import { SavingsGoal } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Target, Calendar, Edit, Trash2, AlertTriangle, DollarSign, FileText, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
import { EditSavingsGoalDialog } from '@/components/EditSavingsGoalDialog';
import { AddMoneyDialog } from '@/components/AddMoneyDialog';
import { Button } from '@/components/ui/button';
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
import { deleteSavingsGoal } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SavingsGoalsListProps {
  goals: SavingsGoal[];
}

export function SavingsGoalsList({ goals }: SavingsGoalsListProps) {
  const router = useRouter();
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoal | null>(null);
  const [addingMoneyGoal, setAddingMoneyGoal] = useState<SavingsGoal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingGoal) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteSavingsGoal(deletingGoal.id);
      if (result.success) {
        toast.success('Savings goal deleted successfully!', {
          description: `${deletingGoal.name}`,
        });
        setDeletingGoal(null);
        router.refresh();
      } else {
        console.error('Failed to delete savings goal:', result.error);
        toast.error('Failed to delete savings goal', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Failed to delete savings goal:', error);
      toast.error('Failed to delete savings goal', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateProgress = (goal: SavingsGoal) => {
    if (goal.target_amount === 0) return 0;
    return Math.min(100, (goal.current_amount / goal.target_amount) * 100);
  };

  const getDaysRemaining = (targetDate?: string) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Target className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">No savings goals yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Start tracking your savings progress by creating your first goal
        </p>
        <AddSavingsGoalDialog 
          trigger={
            <Button size="lg" className="shadow-lg w-full sm:w-auto">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Your First Goal
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="divide-y divide-border">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          const daysRemaining = getDaysRemaining(goal.target_date);
          const isAchieved = goal.is_achieved || progress >= 100;
          
          return (
            <div
              key={goal.id}
              className="p-4 sm:p-6 hover:bg-muted/30 transition-colors group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-xl shrink-0 ${
                      isAchieved
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30' 
                        : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                    } transition-colors`}>
                      {isAchieved ? (
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-base sm:text-lg truncate">
                          {goal.name}
                        </h4>
                        {isAchieved && (
                          <span className="px-2 py-0.5 sm:py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full font-medium">
                            Achieved
                          </span>
                        )}
                      </div>
                      {goal.description && (
                        <p className="text-sm sm:text-base text-muted-foreground mb-2 line-clamp-2">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                        {goal.target_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{formatDate(goal.target_date)}</span>
                            {daysRemaining !== null && daysRemaining >= 0 && (
                              <span className="ml-1">
                                ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
                              </span>
                            )}
                            {daysRemaining !== null && daysRemaining < 0 && (
                              <span className="ml-1 text-rose-600">
                                ({Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'day' : 'days'} overdue)
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span>Priority:</span>
                          <span className={`font-medium ${
                            goal.priority === 1 ? 'text-rose-600' :
                            goal.priority === 2 ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right sm:text-left">
                      <div className="text-sm sm:text-base text-muted-foreground mb-1">
                        {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                      </div>
                      <div className={`text-lg sm:text-2xl font-bold whitespace-nowrap ${
                        isAchieved
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-primary'
                      }`}>
                        {progress.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(goal.target_amount - goal.current_amount)} remaining
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {!isAchieved && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 sm:h-8 sm:w-8 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 active:bg-emerald-100 dark:active:bg-emerald-950/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddingMoneyGoal(goal);
                              }}
                              aria-label="Add money to goal"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={8} align="center">
                            Add money
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingGoal(goal);
                            }}
                            aria-label="Edit savings goal"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} align="center">
                          Edit goal
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingGoal(goal);
                            }}
                            aria-label="Delete savings goal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} align="center">
                          Delete goal
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isAchieved
                          ? 'bg-emerald-500'
                          : progress >= 75
                          ? 'bg-primary'
                          : progress >= 50
                          ? 'bg-primary/80'
                          : progress >= 25
                          ? 'bg-primary/60'
                          : 'bg-primary/40'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Money Dialog */}
      {addingMoneyGoal && (
        <AddMoneyDialog
          goal={addingMoneyGoal}
          open={!!addingMoneyGoal}
          onOpenChange={(open) => !open && setAddingMoneyGoal(null)}
        />
      )}

      {/* Edit Dialog */}
      {editingGoal && (
        <EditSavingsGoalDialog
          goal={editingGoal}
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingGoal} onOpenChange={(open) => !open && setDeletingGoal(null)}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-full bg-destructive/10 dark:bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle className="text-left">Delete Savings Goal</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pl-11">
              This action cannot be undone. The savings goal will be permanently removed from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletingGoal && (
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
                    {deletingGoal.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Progress
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(deletingGoal.current_amount)} / {formatCurrency(deletingGoal.target_amount)}
                  </div>
                </div>
              </div>

              {deletingGoal.description && (
                <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Description
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {deletingGoal.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel onClick={() => setDeletingGoal(null)} disabled={isDeleting}>
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
                  Delete Goal
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
