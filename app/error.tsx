'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
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
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5">
      <div className="max-w-2xl w-full mx-auto p-6">
        <Card className="border-destructive/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-fit">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold text-destructive mb-2">
              Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
              <p className="text-sm font-mono text-destructive wrap-break-word">
                {error.message || 'An unknown error occurred'}
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
                Try Again
              </Button>
              
              <Link href="/" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                If this problem persists, please contact support.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link 
                  href="/" 
                  className="flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
