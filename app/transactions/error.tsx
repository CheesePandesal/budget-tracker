'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Transactions page error:', error);
  }, [error]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Financial Management</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">Track your family's income and expenses</p>
        </div>
      </div>

      {/* Error Card */}
      <Card className="border-destructive/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive mb-2">
            Failed to Load Transactions
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            We couldn't load your transaction data. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
            <p className="text-sm font-mono text-destructive wrap-break-word">
              {error.message || 'Failed to fetch transactions'}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset}
              className="flex-1 shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Retry Loading
            </Button>
            
            <Link href="/" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Stats Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
            <Card className="border-l-4 border-l-emerald-500 opacity-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">--</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-full">
                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-500 opacity-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="text-3xl font-bold text-rose-600 mt-1">--</p>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                    <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary opacity-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                    <p className="text-3xl font-bold text-primary mt-1">--</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Help */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              If this problem persists, please check your internet connection or contact support.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link 
                href="/" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
