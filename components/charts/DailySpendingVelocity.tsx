'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DailyData {
  day: number;
  amount: number;
}

interface DailySpendingVelocityProps {
  data: DailyData[];
}

export function DailySpendingVelocity({ data }: DailySpendingVelocityProps) {
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

  // Filter out days with no spending for cleaner visualization
  const filteredData = data.filter(d => d.amount > 0);

  // Handle empty data state
  if (!data || filteredData.length === 0) {
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no expense transactions for the selected period. Start adding expenses to see daily spending velocity.
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
        name: 'Daily Spending',
        data: data.map(item => item.amount),
      },
    ],
    options: {
      chart: {
        type: 'area' as const,
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
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 100],
        },
      },
      colors: [expenseColor],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data.map(item => item.day),
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: 'inherit',
          },
        },
        title: {
          text: 'Day of Month',
          style: {
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: 600,
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
        title: {
          text: 'Amount',
          style: {
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: 600,
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
      grid: {
        borderColor: undefined,
        strokeDashArray: 4,
      },
      markers: {
        size: 3,
        hover: {
          size: 5,
        },
      },
    },
  };

  return (
    <Chart
      options={chartData.options as any}
      series={chartData.series}
      type="area"
      height={350}
    />
  );
}

