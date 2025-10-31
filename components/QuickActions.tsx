'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Target } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Quick Actions</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Get started with your financial tracking</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/transactions">
              <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add Transaction
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base" disabled>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Set Budget
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
