'use client';

import { 
  LayoutDashboard, 
  FileText, 
  UserPlus, 
  TrendingUp, 
  PieChart,
  Search,
  Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type NavigationItem = 'dashboard' | 'deals' | 'origination' | 'underwriting' | 'portfolio';

interface SidebarProps {
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const navigationItems = [
    {
      id: 'dashboard' as NavigationItem,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'deals' as NavigationItem,
      label: 'Deal Hub',
      icon: FileText,
      badge: null
    },
    {
      id: 'origination' as NavigationItem,
      label: 'Origination',
      icon: UserPlus,
      badge: '3'
    },
    {
      id: 'underwriting' as NavigationItem,
      label: 'Underwriting',
      icon: TrendingUp,
      badge: '7'
    },
    {
      id: 'portfolio' as NavigationItem,
      label: 'Portfolio',
      icon: PieChart,
      badge: null
    }
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Lending Platform</h2>
      </div>
      
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Global search..." 
            className="pl-10"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="mr-3 h-4 w-4" />
          Notifications
          <Badge variant="destructive" className="ml-auto">
            2
          </Badge>
        </Button>
      </div>
    </div>
  );
}