'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PaymentMethodData {
  method: string;
  amount: number;
}

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    
    // Get chart colors from CSS variables
    const root = document.documentElement;
    const chartColors = [
      getComputedStyle(root).getPropertyValue('--chart-1').trim(),
      getComputedStyle(root).getPropertyValue('--chart-2').trim(),
      getComputedStyle(root).getPropertyValue('--chart-3').trim(),
      getComputedStyle(root).getPropertyValue('--chart-4').trim(),
      getComputedStyle(root).getPropertyValue('--chart-5').trim(),
      '#3b82f6', // blue
      '#8b5cf6', // violet
      '#ec4899', // pink
    ];
    setColors(chartColors);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  // Handle empty data state
  if (!data || data.length === 0) {
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no expense transactions with payment methods. Add payment method information to see the breakdown.
        </p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = {
    series: data.map(item => item.amount),
    options: {
      chart: {
        type: 'donut' as const,
        toolbar: {
          show: false,
        },
        fontFamily: 'inherit',
      },
      labels: data.map(item => item.method),
      colors: colors,
      legend: {
        position: 'bottom' as const,
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 400,
        labels: {
          colors: undefined,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 8,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          return `${val.toFixed(1)}%`;
        },
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 500,
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
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontFamily: 'inherit',
                fontWeight: 600,
              },
              value: {
                show: true,
                fontSize: '20px',
                fontFamily: 'inherit',
                fontWeight: 700,
                formatter: (val: string) => {
                  return new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(parseFloat(val));
                },
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                fontFamily: 'inherit',
                fontWeight: 600,
                formatter: () => {
                  return new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(total);
                },
              },
            },
          },
        },
      },
    },
  };

  return (
    <Chart
      options={chartData.options as any}
      series={chartData.series}
      type="donut"
      height={350}
    />
  );
}

