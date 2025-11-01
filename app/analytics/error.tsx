'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, BarChart3 } from 'lucide-react';
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
    console.error('Analytics page error:', error);
  }, [error]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Financial Insights</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Get insights into your spending patterns and trends</p>
        </div>
      </div>

      {/* Error Card */}
      <Card className="border-destructive/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive mb-2">
            Failed to Load Analytics
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            We couldn't load your analytics data. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
            <p className="text-sm font-mono text-destructive wrap-break-word">
              {error.message || 'Failed to fetch analytics data'}
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

          {/* Additional Help */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              If this problem persists, please check your internet connection or contact support.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link 
                href="/transactions" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                View Transactions →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

