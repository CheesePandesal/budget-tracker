'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WeeklyData {
  day: string;
  amount: number;
}

interface WeeklySpendingPatternProps {
  data: WeeklyData[];
}

export function WeeklySpendingPattern({ data }: WeeklySpendingPatternProps) {
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

  // Handle empty data state
  if (!data || data.length === 0 || data.every(d => d.amount === 0)) {
    return (
      <div className="w-full h-[350px] flex flex-col items-center justify-center text-center p-6">
        <div className="mb-4 p-4 bg-muted rounded-full">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no expense transactions for the selected period. Start adding expenses to see weekly spending patterns.
        </p>
      </div>
    );
  }

  // Get chart colors from CSS variables
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const expenseColor = root
    ? getComputedStyle(root).getPropertyValue('--destructive').trim() || '#ef4444'
    : '#ef4444';

  const chartData = {
    series: [
      {
        name: 'Spending',
        data: data.map(item => item.amount),
      },
    ],
    options: {
      chart: {
        type: 'bar' as const,
        toolbar: {
          show: false,
        },
        fontFamily: 'inherit',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 6,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: data.map(item => item.day.substring(0, 3)), // Short day names
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
      fill: {
        opacity: 1,
        colors: [expenseColor],
      },
      colors: [expenseColor],
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
      grid: {
        borderColor: undefined,
        strokeDashArray: 4,
      },
    },
  };

  return (
    <Chart
      options={chartData.options as any}
      series={chartData.series}
      type="bar"
      height={350}
    />
  );
}

