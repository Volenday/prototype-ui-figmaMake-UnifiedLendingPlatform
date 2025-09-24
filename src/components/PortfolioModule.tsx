import { useState } from 'react';
import { TrendingUp, AlertTriangle, DollarSign, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PortfolioModuleProps {
  onViewDeal: (dealId: string) => void;
}

export function PortfolioModule({ onViewDeal }: PortfolioModuleProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const portfolioMetrics = {
    totalValue: '£186.5M',
    totalLoans: 45,
    avgLtv: '68.2%',
    weightedDscr: '1.42',
    healthScore: 98.2,
    covenantBreaches: 2,
    monthlyIncome: '£1.2M',
    arrears: '0.3%'
  };

  const activeLoans = [
    {
      id: '1',
      name: 'Oakwood Commercial Center',
      borrower: 'Meridian Properties Ltd',
      balance: '£2,500,000',
      rate: '6.5%',
      maturity: '2026-03-15',
      ltv: '75%',
      dscr: '1.35',
      status: 'Performing',
      nextPayment: '2025-02-15',
      covenantStatus: 'Compliant'
    },
    {
      id: '2',
      name: 'Metro Plaza Development',
      borrower: 'Commercial Estates Ltd',
      balance: '£4,200,000',
      rate: '7.2%',
      maturity: '2025-12-20',
      ltv: '68%',
      dscr: '1.48',
      status: 'Performing',
      nextPayment: '2025-02-20',
      covenantStatus: 'Compliant'
    },
    {
      id: '3',
      name: 'Riverside Industrial Park',
      borrower: 'Industrial Holdings Ltd',
      balance: '£3,800,000',
      rate: '6.8%',
      maturity: '2026-08-10',
      ltv: '72%',
      dscr: '1.15',
      status: 'Watch',
      nextPayment: '2025-02-10',
      covenantStatus: 'Breach'
    }
  ];

  const covenantBreaches = [
    {
      loanId: '3',
      loanName: 'Riverside Industrial Park',
      borrower: 'Industrial Holdings Ltd',
      covenant: 'Minimum DSCR',
      required: '1.25',
      actual: '1.15',
      severity: 'Medium',
      action: 'Borrower meeting scheduled',
      date: '2025-01-08'
    },
    {
      loanId: '4',
      loanName: 'Harbor Point Retail',
      borrower: 'Retail Properties Inc',
      covenant: 'Maximum LTV',
      required: '70%',
      actual: '74%',
      severity: 'Low',
      action: 'Additional security obtained',
      date: '2025-01-05'
    }
  ];

  const upcomingMaturities = [
    {
      id: '2',
      name: 'Metro Plaza Development',
      borrower: 'Commercial Estates Ltd',
      balance: '£4,200,000',
      maturityDate: '2025-12-20',
      daysToMaturity: 342,
      status: 'Renewal discussions',
      risk: 'Low'
    },
    {
      id: '5',
      name: 'Westfield Shopping Center',
      borrower: 'Retail Ventures Ltd',
      balance: '£6,750,000',
      maturityDate: '2025-09-15',
      daysToMaturity: 246,
      status: 'Exit plan active',
      risk: 'Medium'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Portfolio Management</h1>
          <p className="text-muted-foreground">Monitor loan performance and portfolio health</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Portfolio Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioMetrics.totalLoans} active loans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.healthScore}%</div>
            <p className="text-xs text-muted-foreground">
              Avg LTV: {portfolioMetrics.avgLtv}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.monthlyIncome}</div>
            <p className="text-xs text-muted-foreground">
              Arrears: {portfolioMetrics.arrears}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.covenantBreaches}</div>
            <p className="text-xs text-muted-foreground">
              Covenant breaches
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Active Loans</TabsTrigger>
          <TabsTrigger value="covenants">Covenant Monitoring</TabsTrigger>
          <TabsTrigger value="maturities">Upcoming Maturities</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Loan Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeLoans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      <div className="lg:col-span-3">
                        <h4 className="font-medium cursor-pointer hover:text-primary"
                            onClick={() => onViewDeal(loan.id)}>
                          {loan.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{loan.borrower}</p>
                        <p className="text-sm font-medium">{loan.balance}</p>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="text-sm space-y-1">
                          <div>Rate: <span className="font-medium">{loan.rate}</span></div>
                          <div>Maturity: <span className="font-medium">{loan.maturity}</span></div>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="text-sm space-y-1">
                          <div>LTV: <span className="font-medium">{loan.ltv}</span></div>
                          <div>DSCR: <span className="font-medium">{loan.dscr}</span></div>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <Badge variant={
                          loan.status === 'Performing' ? 'default' :
                          loan.status === 'Watch' ? 'secondary' : 'destructive'
                        }>
                          {loan.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Next: {loan.nextPayment}
                        </p>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <Badge variant={
                          loan.covenantStatus === 'Compliant' ? 'default' : 'destructive'
                        }>
                          {loan.covenantStatus}
                        </Badge>
                      </div>
                      
                      <div className="lg:col-span-1">
                        <Button variant="outline" size="sm"
                                onClick={() => onViewDeal(loan.id)}>
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="covenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Covenant Breaches Requiring Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {covenantBreaches.map((breach, index) => (
                  <div key={index} className="border rounded-lg p-4 border-amber-200 bg-amber-50">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h4 className="font-medium cursor-pointer hover:text-primary"
                            onClick={() => onViewDeal(breach.loanId)}>
                          {breach.loanName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{breach.borrower}</p>
                        <p className="text-sm font-medium">{breach.covenant}</p>
                      </div>
                      
                      <div>
                        <div className="text-sm space-y-1">
                          <div>Required: <span className="font-medium">{breach.required}</span></div>
                          <div>Actual: <span className="font-medium text-amber-700">{breach.actual}</span></div>
                        </div>
                      </div>
                      
                      <div>
                        <Badge variant={
                          breach.severity === 'High' ? 'destructive' :
                          breach.severity === 'Medium' ? 'default' : 'secondary'
                        }>
                          {breach.severity} Risk
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{breach.date}</p>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <p className="text-sm text-muted-foreground">{breach.action}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">Update Status</Button>
                          <Button variant="outline" size="sm"
                                  onClick={() => onViewDeal(breach.loanId)}>
                            View Loan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maturities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Loan Maturities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMaturities.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h4 className="font-medium cursor-pointer hover:text-primary"
                            onClick={() => onViewDeal(loan.id)}>
                          {loan.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{loan.borrower}</p>
                        <p className="text-sm font-medium">{loan.balance}</p>
                      </div>
                      
                      <div>
                        <div className="text-sm">
                          <div>Maturity: <span className="font-medium">{loan.maturityDate}</span></div>
                          <div>Days left: <span className="font-medium">{loan.daysToMaturity}</span></div>
                        </div>
                      </div>
                      
                      <div>
                        <Badge variant={
                          loan.risk === 'High' ? 'destructive' :
                          loan.risk === 'Medium' ? 'default' : 'secondary'
                        }>
                          {loan.risk} Risk
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">{loan.status}</p>
                      </div>
                      
                      <div>
                        <Button variant="outline" size="sm"
                                onClick={() => onViewDeal(loan.id)}>
                          Review Exit Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Commercial</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-24" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Residential</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-24" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Industrial</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={10} className="w-24" />
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Low Risk</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-24" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Medium Risk</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={35} className="w-24" />
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>High Risk</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={20} className="w-24" />
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}