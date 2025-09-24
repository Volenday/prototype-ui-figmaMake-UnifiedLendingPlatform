'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Users, Building, DollarSign, TrendingUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useDealsStore } from '@/stores/dealsStore';
import { NoSSR } from './NoSSR';

interface DealHubProps {
  dealId: string | null;
  onBack: () => void;
}

export function DealHub({ dealId, onBack }: DealHubProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const selectedDeal = useDealsStore((state) => state.selectedDeal);
  const getDealById = useDealsStore((state) => state.getDealById);

  // If we have a dealId but no selected deal, try to select it
  useEffect(() => {
    if (dealId && !selectedDeal) {
      console.log('DealHub: Attempting to select deal with ID:', dealId);
      const deal = getDealById ? getDealById(dealId) : null;
      if (deal) {
        console.log('DealHub: Found and selecting deal:', deal.name);
        useDealsStore.setState({ selectedDeal: deal });
      } else {
        console.log('DealHub: Deal not found in store with ID:', dealId);
      }
    }
  }, [dealId, selectedDeal, getDealById]);

  // Get the deal to display (prioritize selectedDeal, fallback to getDealById)
  const dealToDisplay = selectedDeal || (dealId && getDealById ? getDealById(dealId) : null);

  if (!dealToDisplay) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Select a deal to view details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use real deal data from store
  const deal = {
    id: dealToDisplay.id,
    name: dealToDisplay.name,
    amount: dealToDisplay.amount,
    client: dealToDisplay.name, // Using name as client for now
    stage: dealToDisplay.stage,
    progress: dealToDisplay.progress,
    status: dealToDisplay.status,
    type: dealToDisplay.type,
    createdAt: dealToDisplay.createdAt,
    updatedAt: dealToDisplay.updatedAt,
    rawAmount: dealToDisplay.rawAmount,
    // Mock data for fields not available from API yet
    ltv: '75%',
    ltc: '68%',
    dscr: '1.35',
    rom: '18%',
    team: [
      { name: 'Sarah Johnson', role: 'Credit Analyst', initials: 'SJ' },
      { name: 'Mike Chen', role: 'Risk Manager', initials: 'MC' },
      { name: 'Emma Davis', role: 'Legal Counsel', initials: 'ED' },
    ],
    riskFlags: [
      { type: 'Market Risk', severity: 'Medium', description: 'Market conditions assessment' },
      { type: 'Credit Risk', severity: dealToDisplay.status === 'Approved' ? 'Low' : 'Medium', description: `Deal status: ${dealToDisplay.status}` },
    ]
  };

  // Generate stages based on deal status
  const getStagesFromStatus = (status: string, stage: string) => {
    const allStages = [
      { name: 'Initial Assessment', completed: false, active: false },
      { name: 'Due Diligence', completed: false, active: false },
      { name: 'Underwriting', completed: false, active: false },
      { name: 'Committee Review', completed: false, active: false },
      { name: 'Approved', completed: false, active: false },
    ];

    switch (status.toLowerCase()) {
      case 'approved':
        return allStages.map((s, i) => ({ ...s, completed: i < 4, active: i === 4 }));
      case 'pending':
        if (stage.toLowerCase().includes('committee')) {
          return allStages.map((s, i) => ({ ...s, completed: i < 3, active: i === 3 }));
        } else {
          return allStages.map((s, i) => ({ ...s, completed: i < 2, active: i === 2 }));
        }
      case 'amendments required':
        return allStages.map((s, i) => ({ ...s, completed: i < 2, active: i === 2 }));
      default:
        return allStages.map((s, i) => ({ ...s, completed: i < 1, active: i === 1 }));
    }
  };

  const stages = getStagesFromStatus(deal.status, deal.stage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Deal Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{deal.name}</h1>
            <p className="text-muted-foreground">{deal.amount} • {deal.client}</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {deal.stage}
          </Badge>
        </div>

        {/* Status Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Progress</span>
                <span className="text-sm font-medium">{deal.progress}%</span>
              </div>
              <Progress value={deal.progress} />
              <div className="flex justify-between">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.completed ? 'bg-primary text-primary-foreground' :
                      stage.active ? 'bg-secondary text-secondary-foreground border-2 border-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-xs text-center max-w-20">{stage.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold">{deal.ltv}</div>
              <div className="text-sm text-muted-foreground">LTV</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold">{deal.ltc}</div>
              <div className="text-sm text-muted-foreground">LTC</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold">{deal.dscr}</div>
              <div className="text-sm text-muted-foreground">DSCR</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold">{deal.rom}</div>
              <div className="text-sm text-muted-foreground">ROM</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="borrower">Borrower</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  AI Deal Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  This is a £2.5M acquisition and refurbishment loan for a mixed-use commercial property 
                  in Central London. The borrower, Meridian Properties Ltd, has a strong track record 
                  with 12 years of successful property development. The property consists of 8,500 sq ft 
                  of retail space with 12 residential units above. Current tenancy is 85% occupied with 
                  weighted average lease expiry of 4.2 years.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deal.riskFlags.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{risk.type}</span>
                        <Badge variant={risk.severity === 'High' ? 'destructive' : 
                                      risk.severity === 'Medium' ? 'default' : 'secondary'}>
                          {risk.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="borrower">
          <Card>
            <CardHeader>
              <CardTitle>Borrower Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <p className="text-sm text-muted-foreground">Meridian Properties Ltd</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Registration Number</label>
                    <p className="text-sm text-muted-foreground">08429156</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Credit Rating</label>
                    <p className="text-sm text-muted-foreground">A-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Years Trading</label>
                    <p className="text-sm text-muted-foreground">12 years</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <p className="text-sm text-muted-foreground">45-47 High Street, London, W1K 2HG</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Property Type</label>
                    <p className="text-sm text-muted-foreground">Mixed Use Commercial</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Size</label>
                    <p className="text-sm text-muted-foreground">8,500 sq ft retail + 12 residential units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valuation</label>
                    <p className="text-sm text-muted-foreground">£3,850,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-semibold">£2,500,000</div>
                    <div className="text-sm text-muted-foreground">Loan Amount</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-semibold">6.5%</div>
                    <div className="text-sm text-muted-foreground">Interest Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-semibold">24 months</div>
                    <div className="text-sm text-muted-foreground">Term</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Financial Statements (2021-2023)',
                  'Property Valuation Report',
                  'Planning Permission Documents',
                  'Insurance Certificate',
                  'Directors Personal Guarantees'
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Badge variant="outline">Uploaded</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Assigned Team Members</h4>
                  <div className="space-y-3">
                    {deal.team.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <strong>Sarah Johnson</strong> updated the financial model
                        </p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">MC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <strong>Mike Chen</strong> flagged a medium risk item
                        </p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}