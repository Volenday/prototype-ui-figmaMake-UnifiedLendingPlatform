import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface UnderwritingModuleProps {
  onViewDeal: (dealId: string) => void;
}

export function UnderwritingModule({ onViewDeal }: UnderwritingModuleProps) {
  const [activeTab, setActiveTab] = useState('queue');

  const underwritingQueue = [
    {
      id: '1',
      name: 'Oakwood Commercial Center',
      client: 'Meridian Properties Ltd',
      amount: '£2,500,000',
      analyst: 'Sarah Johnson',
      stage: 'Credit Analysis',
      priority: 'High',
      daysInStage: 3,
      riskScore: 'Medium',
      ltv: '75%',
      dscr: '1.35',
      exceptions: 2,
      progress: 65
    },
    {
      id: '2',
      name: 'City Heights Residential',
      client: 'Urban Development Co',
      amount: '£1,800,000',
      analyst: 'Mike Chen',
      stage: 'Document Review',
      priority: 'Medium',
      daysInStage: 1,
      riskScore: 'Low',
      ltv: '70%',
      dscr: '1.45',
      exceptions: 0,
      progress: 45
    },
    {
      id: '3',
      name: 'Riverside Warehouse',
      client: 'Logistics Holdings Ltd',
      amount: '£3,200,000',
      analyst: 'Emma Davis',
      stage: 'Property Valuation',
      priority: 'High',
      daysInStage: 5,
      riskScore: 'High',
      ltv: '80%',
      dscr: '1.15',
      exceptions: 4,
      progress: 30
    }
  ];

  const policyExceptions = [
    {
      dealId: '1',
      dealName: 'Oakwood Commercial Center',
      exception: 'LTV exceeds policy limit of 70%',
      current: '75%',
      policy: '70%',
      severity: 'Medium',
      justification: 'Strong borrower covenant and prime location'
    },
    {
      dealId: '3',
      dealName: 'Riverside Warehouse',
      exception: 'DSCR below minimum threshold',
      current: '1.15',
      policy: '1.25',
      severity: 'High',
      justification: 'Pending - requires committee approval'
    }
  ];

  const completedDeals = [
    {
      id: '4',
      name: 'Metro Plaza Development',
      client: 'Commercial Estates Ltd',
      amount: '£4,200,000',
      decision: 'Approved',
      finalLtv: '68%',
      completedDate: '2025-01-08',
      analyst: 'Sarah Johnson'
    },
    {
      id: '5',
      name: 'Harbor Point Retail',
      client: 'Retail Properties Inc',
      amount: '£1,950,000',
      decision: 'Declined',
      reason: 'Insufficient covenant strength',
      completedDate: '2025-01-07',
      analyst: 'Mike Chen'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Underwriting & Assessment</h1>
          <p className="text-muted-foreground">Collaborative workspace for deal analysis</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              3 high priority
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5d</div>
            <p className="text-xs text-muted-foreground">
              Target: 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              2 pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="queue">Assessment Queue</TabsTrigger>
          <TabsTrigger value="exceptions">Policy Exceptions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Underwriting Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {underwritingQueue.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      <div className="lg:col-span-3">
                        <h4 className="font-medium cursor-pointer hover:text-primary"
                            onClick={() => onViewDeal(deal.id)}>
                          {deal.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{deal.client}</p>
                        <p className="text-sm font-medium">{deal.amount}</p>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <p className="text-sm font-medium">Analyst: {deal.analyst}</p>
                        <p className="text-sm text-muted-foreground">{deal.stage}</p>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={
                            deal.priority === 'High' ? 'destructive' :
                            deal.priority === 'Medium' ? 'default' : 'secondary'
                          }>
                            {deal.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {deal.daysInStage}d
                          </span>
                        </div>
                        <Badge variant={
                          deal.riskScore === 'High' ? 'destructive' :
                          deal.riskScore === 'Medium' ? 'default' : 'secondary'
                        }>
                          {deal.riskScore} Risk
                        </Badge>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="text-sm space-y-1">
                          <div>LTV: <span className="font-medium">{deal.ltv}</span></div>
                          <div>DSCR: <span className="font-medium">{deal.dscr}</span></div>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Progress</span>
                            <span className="text-sm font-medium">{deal.progress}%</span>
                          </div>
                          <Progress value={deal.progress} className="h-2" />
                          {deal.exceptions > 0 && (
                            <div className="flex items-center text-amber-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              <span className="text-xs">{deal.exceptions} exceptions</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="lg:col-span-1">
                        <Button variant="outline" size="sm"
                                onClick={() => onViewDeal(deal.id)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Exceptions Requiring Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyExceptions.map((exception, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h4 className="font-medium cursor-pointer hover:text-primary"
                            onClick={() => onViewDeal(exception.dealId)}>
                          {exception.dealName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{exception.exception}</p>
                      </div>
                      
                      <div>
                        <div className="text-sm space-y-1">
                          <div>Current: <span className="font-medium">{exception.current}</span></div>
                          <div>Policy: <span className="font-medium">{exception.policy}</span></div>
                        </div>
                      </div>
                      
                      <div>
                        <Badge variant={
                          exception.severity === 'High' ? 'destructive' :
                          exception.severity === 'Medium' ? 'default' : 'secondary'
                        }>
                          {exception.severity} Risk
                        </Badge>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <p className="text-sm text-muted-foreground">{exception.justification}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">Approve</Button>
                          <Button variant="outline" size="sm">Decline</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Completed Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium cursor-pointer hover:text-primary"
                          onClick={() => onViewDeal(deal.id)}>
                        {deal.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{deal.client} • {deal.amount}</p>
                      <p className="text-sm text-muted-foreground">Analyst: {deal.analyst}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {deal.decision === 'Approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={deal.decision === 'Approved' ? 'default' : 'destructive'}>
                          {deal.decision}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{deal.completedDate}</p>
                      {deal.finalLtv && (
                        <p className="text-sm text-muted-foreground">Final LTV: {deal.finalLtv}</p>
                      )}
                      {deal.reason && (
                        <p className="text-sm text-muted-foreground">{deal.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}