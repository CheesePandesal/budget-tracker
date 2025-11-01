'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryPieChartProps {
  data: Array<{ name: string; amount: number }>;
  total: number;
}

export function CategoryPieChart({ data, total }: CategoryPieChartProps) {
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
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

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
      labels: data.map(item => item.name),
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

