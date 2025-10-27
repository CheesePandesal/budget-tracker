import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5">
      <div className="max-w-2xl w-full mx-auto p-6">
        <Card className="shadow-xl border-border">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 p-6 bg-primary/10 rounded-full w-fit">
              <FileX className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold mb-3">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Code */}
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-muted rounded-lg">
                <span className="text-6xl font-bold text-primary">404</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button 
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              
              <Link href="/transactions" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  View Transactions
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold text-center mb-4 text-muted-foreground">
                Popular Pages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium">Dashboard</div>
                      <div className="text-sm text-muted-foreground">Overview of your finances</div>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/transactions">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium">Transactions</div>
                      <div className="text-sm text-muted-foreground">Manage income & expenses</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Still can't find what you're looking for?
              </p>
              <Button variant="link" className="text-primary">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
