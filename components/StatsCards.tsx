'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export function StatsCards({ totalIncome, totalExpenses, netAmount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-full">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-rose-500 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-xl sm:text-2xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(netAmount)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
