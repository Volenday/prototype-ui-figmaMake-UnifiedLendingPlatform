import { useState } from 'react';
import { Plus, Search, Filter, FileText, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface OriginationModuleProps {
  onViewDeal: (dealId: string) => void;
}

export function OriginationModule({ onViewDeal }: OriginationModuleProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const leads = [
    {
      id: '1',
      name: 'Crossroads Shopping Center',
      client: 'Retail Ventures Ltd',
      amount: '£4,100,000',
      type: 'Acquisition',
      source: 'Referral',
      status: 'New',
      priority: 'High',
      date: '2025-01-10',
      ltv: '70%',
      location: 'Manchester'
    },
    {
      id: '2',
      name: 'Northgate Office Complex',
      client: 'Corporate Estates PLC',
      amount: '£2,900,000',
      type: 'Refinance',
      source: 'Direct',
      status: 'Contacted',
      priority: 'Medium',
      date: '2025-01-09',
      ltv: '65%',
      location: 'Birmingham'
    },
    {
      id: '3',
      name: 'Seaside Hotel Development',
      client: 'Hospitality Group Ltd',
      amount: '£6,750,000',
      type: 'Development',
      source: 'Broker',
      status: 'Proposal Sent',
      priority: 'High',
      date: '2025-01-08',
      ltv: '75%',
      location: 'Brighton'
    },
    {
      id: '4',
      name: 'Industrial Park Expansion',
      client: 'Manufacturing Co',
      amount: '£3,200,000',
      type: 'Development',
      source: 'Website',
      status: 'Under Review',
      priority: 'Low',
      date: '2025-01-07',
      ltv: '60%',
      location: 'Leeds'
    }
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || lead.status.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Origination & CRM</h1>
          <p className="text-muted-foreground">Manage leads and new deal opportunities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 new this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£34.2M</div>
            <p className="text-xs text-muted-foreground">
              Weighted value: £18.4M
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">
              Lead to application
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Target: &lt;2h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="proposal">Proposal Sent</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h4 className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => onViewDeal(lead.id)}>
                      {lead.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{lead.client}</p>
                    <p className="text-sm text-muted-foreground">{lead.location}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">{lead.amount}</p>
                    <p className="text-sm text-muted-foreground">{lead.type}</p>
                  </div>
                  
                  <div>
                    <Badge variant="outline">{lead.source}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">LTV: {lead.ltv}</p>
                  </div>
                  
                  <div>
                    <Badge variant={
                      lead.status === 'New' ? 'default' :
                      lead.status === 'Contacted' ? 'secondary' :
                      lead.status === 'Proposal Sent' ? 'outline' :
                      'secondary'
                    }>
                      {lead.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Priority: {lead.priority}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{lead.date}</p>
                    <Button variant="outline" size="sm" className="mt-2"
                            onClick={() => onViewDeal(lead.id)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}