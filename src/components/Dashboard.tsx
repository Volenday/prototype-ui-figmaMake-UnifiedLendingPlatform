'use client';

import { Plus, TrendingUp, Users, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface DashboardProps {
  user: {
    name: string;
    role: string;
  };
  onViewDeal: (dealId: string) => void;
}

export function Dashboard({ user, onViewDeal }: DashboardProps) {
  const pipelineDeals = [
    { id: '1', name: 'Oakwood Commercial Center', amount: '£2.5M', stage: 'Underwriting', progress: 65 },
    { id: '2', name: 'City Heights Residential', amount: '£1.8M', stage: 'Committee Review', progress: 85 },
    { id: '3', name: 'Riverside Warehouse', amount: '£3.2M', stage: 'Due Diligence', progress: 40 },
  ];

  const reviewQueue = [
    { id: '4', name: 'Metro Plaza Development', type: 'Credit Review', priority: 'High', daysOpen: 2 },
    { id: '5', name: 'Harbor Point Retail', type: 'Documentation', priority: 'Medium', daysOpen: 1 },
    { id: '6', name: 'Gateway Business Park', type: 'Valuation Review', priority: 'Low', daysOpen: 5 },
  ];

  const newLeads = [
    { id: '7', name: 'Crossroads Shopping Center', amount: '£4.1M', source: 'Referral', date: '2 hours ago' },
    { id: '8', name: 'Northgate Office Complex', amount: '£2.9M', source: 'Direct', date: '5 hours ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here's what's happening with your deals today</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£24.7M</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals in Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              7 awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Origination</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£8.2M</div>
            <p className="text-xs text-muted-foreground">
              Target: £10M
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              2 covenant breaches
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
            {pipelineDeals.map((deal) => (
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
            ))}
          </CardContent>
        </Card>

        {/* Deals for Review */}
        <Card>
          <CardHeader>
            <CardTitle>Deals for Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium cursor-pointer hover:text-primary"
                     onClick={() => onViewDeal(item.id)}>
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.priority === 'High' ? 'destructive' : 
                                 item.priority === 'Medium' ? 'default' : 'secondary'}>
                    {item.priority}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.daysOpen}d
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* New Leads */}
      <Card>
        <CardHeader>
          <CardTitle>New Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {newLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium cursor-pointer hover:text-primary"
                     onClick={() => onViewDeal(lead.id)}>
                    {lead.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{lead.amount} • {lead.source}</p>
                </div>
                <div className="text-sm text-muted-foreground">{lead.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}