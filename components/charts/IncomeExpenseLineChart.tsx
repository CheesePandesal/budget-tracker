'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

interface IncomeExpenseLineChartProps {
  data: MonthlyData[];
}

export function IncomeExpenseLineChart({ data }: IncomeExpenseLineChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  // Get chart colors from CSS variables
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const incomeColor = root 
    ? getComputedStyle(root).getPropertyValue('--chart-2').trim() || '#10b981'
    : '#10b981';
  const expenseColor = root
    ? getComputedStyle(root).getPropertyValue('--destructive').trim() || '#ef4444'
    : '#ef4444';

  const chartData = {
    series: [
      {
        name: 'Income',
        data: data.map(item => item.totalIncome),
      },
      {
        name: 'Expenses',
        data: data.map(item => item.totalExpenses),
      },
      {
        name: 'Net Amount',
        data: data.map(item => item.netAmount),
      },
    ],
    options: {
      chart: {
        type: 'line' as const,
        toolbar: {
          show: false,
        },
        fontFamily: 'inherit',
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'smooth' as const,
        width: [2, 2, 3],
      },
      colors: [incomeColor, expenseColor, '#6366f1'],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data.map(item => {
          const [year, month] = item.month.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return date.toLocaleDateString('en-PH', { month: 'short', year: 'numeric' });
        }),
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: 'inherit',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            if (value >= 1000000) {
              return `₱${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `₱${(value / 1000).toFixed(0)}K`;
            }
            return `₱${value.toFixed(0)}`;
          },
          style: {
            fontSize: '12px',
            fontFamily: 'inherit',
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => {
            return new Intl.NumberFormat('en-PH', {
              style: 'currency',
              currency: 'PHP',
              minimumFractionDigits: 2,
            }).format(value);
          },
        },
      },
      legend: {
        position: 'top' as const,
        horizontalAlign: 'right' as const,
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 400,
        labels: {
          colors: undefined,
        },
      },
      grid: {
        borderColor: undefined,
        strokeDashArray: 4,
      },
      markers: {
        size: 4,
        hover: {
          size: 6,
        },
      },
    },
  };

  return (
    <Chart
      options={chartData.options as any}
      series={chartData.series}
      type="line"
      height={350}
    />
  );
}

