import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'

const Home = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 lg:p-12">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Welcome Back</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Family Budget Tracker
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Take control of your family's finances. Track expenses, set budgets, and achieve your savings goals together.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">₱0.00</p>
              </div>
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-full">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-xl sm:text-2xl font-bold text-rose-600">₱0.00</p>
              </div>
              <div className="p-2 sm:p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">₱0.00</p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 sm:p-4 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
              <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">Track Transactions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Record income and expenses with detailed categorization
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <Link href="/transactions">
              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm sm:text-base">
                View Transactions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl w-fit group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30 transition-colors">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-base sm:text-lg">Income Tracking</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Monitor all sources of family income
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <Link href="/transactions">
              <Button variant="outline" className="w-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/10 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 transition-colors text-sm sm:text-base">
                Add Income
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md opacity-60">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 sm:p-4 bg-primary/10 rounded-2xl w-fit">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">Savings Goals</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Set and track your family's financial goals
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md opacity-60">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 sm:p-4 bg-violet-50 dark:bg-violet-950/20 rounded-2xl w-fit">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-base sm:text-lg">Analytics</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Get insights into your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
    </div>
  )
}

export default Home