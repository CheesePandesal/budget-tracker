import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-8 lg:p-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-6 w-80" />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
