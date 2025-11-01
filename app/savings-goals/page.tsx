import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { getSavingsGoals } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { Suspense } from 'react';
import { SavingsGoalsList } from '@/components/SavingsGoalsList';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Savings Goals',
  description: 'Set and track your family\'s savings goals. Monitor progress, set priorities, and achieve your financial targets.',
};

export default async function SavingsGoalsPage() {
  const goals = await getSavingsGoals();

  // Calculate summary statistics
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  const achievedGoals = goals.filter(goal => goal.is_achieved || (goal.current_amount >= goal.target_amount)).length;
  const activeGoals = goals.filter(goal => !goal.is_achieved && goal.current_amount < goal.target_amount).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-primary">Savings Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Savings Goals</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Set and track your family's financial goals</p>
        </div>
        <AddSavingsGoalDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{totalProgress.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achieved Goals</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{achievedGoals}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {goals.length > 0 ? `${((achievedGoals / goals.length) * 100).toFixed(0)}% of all goals` : 'No goals yet'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-full">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{activeGoals}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Goals in progress
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500 shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                <p className="text-xl sm:text-2xl font-bold text-violet-600">{goals.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All savings goals
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-violet-50 dark:bg-violet-950/20 rounded-full">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Your Savings Goals</CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Track your progress towards achieving your financial goals
              </CardDescription>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<SavingsGoalsListSkeleton />}>
            <SavingsGoalsList goals={goals} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton for savings goals list
function SavingsGoalsListSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-gray-100 rounded-xl">
                <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="text-right ml-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
