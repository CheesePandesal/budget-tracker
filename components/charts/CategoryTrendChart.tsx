'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { formatMonth } from '@/lib/utils';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryTrendData {
  month: string;
  amount: number;
}

interface CategoryTrendChartProps {
  data: CategoryTrendData[];
  categoryName: string;
}

export function CategoryTrendChart({ data, categoryName }: CategoryTrendChartProps) {
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no transactions in this category for the selected period.
        </p>
      </div>
    );
  }

  // Get chart colors from CSS variables
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const categoryColor = root
    ? getComputedStyle(root).getPropertyValue('--chart-1').trim() || '#3b82f6'
    : '#3b82f6';

  const chartData = {
    series: [
      {
        name: categoryName,
        data: data.map(item => item.amount),
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
        width: 3,
      },
      colors: [categoryColor],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data.map(item => formatMonth(item.month)),
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
      grid: {
        borderColor: undefined,
        strokeDashArray: 4,
      },
      markers: {
        size: 5,
        hover: {
          size: 7,
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

