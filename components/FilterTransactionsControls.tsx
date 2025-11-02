'use client';

import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { formatMonth } from '@/lib/utils';

interface FilterTransactionsControlsProps {
  currentMonth: string;
}

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function FilterTransactionsControls({ 
  currentMonth 
}: FilterTransactionsControlsProps) {
  const router = useRouter();

  // Generate list of available months
  const getAvailableMonths = () => {
    const months: string[] = [];
    const current = new Date();
    
    // Get last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);
    }
    
    return months;
  };

  const availableMonths = getAvailableMonths();
  const currentMonthValue = getCurrentMonth();

  const handleMonthSelect = (value: string) => {
    // Navigate to the new URL with the month parameter
    if (value === 'all') {
      router.push('/transactions?month=all');
    } else if (value === currentMonthValue) {
      // If selected is current month, remove the query param
      router.push('/transactions');
    } else {
      router.push(`/transactions?month=${value}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 sm:flex-initial">
          <Select value={currentMonth} onValueChange={handleMonthSelect}>
            <SelectTrigger className="w-[180px] sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={currentMonthValue}>Current Month ({formatMonth(currentMonthValue)})</SelectItem>
              <SelectItem value="all">All Transactions</SelectItem>
              {availableMonths
                .filter(month => month !== currentMonthValue)
                .map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonth(month)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
