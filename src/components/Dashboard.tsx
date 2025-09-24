'use client';

import { Plus, TrendingUp, Users, DollarSign, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { useDeals } from '@/hooks/useDeals';
import { NoSSR } from './NoSSR';
import { useEffect } from 'react';

interface DashboardProps {
  user: {
    name: string;
    role: string;
  };
  onViewDeal: (dealId: string) => void;
}

export function Dashboard({ user, onViewDeal }: DashboardProps) {
  const { deals, totalDeals, isLoading, error, refetch } = useDeals({ limit: 10 });

  // Get pipeline deals (active deals)
  const pipelineDeals = deals.filter(deal => 
    deal.status === 'Pending' || deal.status === 'Amendments Required'
  ).slice(0, 3);

  // Get deals for review (deals needing action)
  const reviewQueue = deals.filter(deal => 
    deal.status === 'Amendments Required' || deal.stage.toLowerCase().includes('review')
  ).slice(0, 3);

  // Get new leads (recently created deals)
  const newLeads = deals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  // Calculate metrics from real data
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.rawAmount, 0);
  const approvedDeals = deals.filter(deal => deal.status === 'Approved').length;
  const pendingDeals = deals.filter(deal => deal.status === 'Pending').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here's what's happening with your deals today</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `£${(totalPipelineValue / 1000000).toFixed(1)}M`}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalDeals} total deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals in Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : totalDeals}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingDeals} awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Deals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : approvedDeals}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : totalDeals > 0 ? `${Math.round((approvedDeals / totalDeals) * 100)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>My Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="h-4 bg-muted rounded w-40"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-12"></div>
                    </div>
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : pipelineDeals.length > 0 ? (
              pipelineDeals.map((deal) => (
                <div key={deal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium cursor-pointer hover:text-primary" 
                         onClick={() => onViewDeal(deal.id)}>
                        {deal.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{deal.amount} • {deal.stage}</p>
                    </div>
                    <Badge variant="outline">{deal.progress}%</Badge>
                  </div>
                  <Progress value={deal.progress} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active pipeline deals
              </p>
            )}
          </CardContent>
        </Card>

        {/* Deals for Review */}
        <Card>
          <CardHeader>
            <CardTitle>Deals for Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded w-36"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviewQueue.length > 0 ? (
              reviewQueue.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium cursor-pointer hover:text-primary"
                       onClick={() => onViewDeal(deal.id)}>
                      {deal.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{deal.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={deal.status === 'Amendments Required' ? 'destructive' : 'default'}>
                      {deal.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <NoSSR fallback="...">
                        {Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24))}d
                      </NoSSR>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No deals for review
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : newLeads.length > 0 ? (
              newLeads.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium cursor-pointer hover:text-primary"
                       onClick={() => onViewDeal(deal.id)}>
                      {deal.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{deal.amount} • {deal.type}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <NoSSR fallback="...">
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </NoSSR>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent deals
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}