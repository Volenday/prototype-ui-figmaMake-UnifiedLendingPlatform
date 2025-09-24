import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { DealHub } from './components/DealHub';
import { OriginationModule } from './components/OriginationModule';
import { UnderwritingModule } from './components/UnderwritingModule';
import { PortfolioModule } from './components/PortfolioModule';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

type User = {
  id: string;
  name: string;
  role: string;
  email: string;
};

type NavigationItem = 'dashboard' | 'deals' | 'origination' | 'underwriting' | 'portfolio';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('dashboard');
    setSelectedDealId(null);
  };

  const handleViewDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    setActiveView('deals');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={user} onViewDeal={handleViewDeal} />;
      case 'deals':
        return <DealHub dealId={selectedDealId} onBack={() => setActiveView('dashboard')} />;
      case 'origination':
        return <OriginationModule onViewDeal={handleViewDeal} />;
      case 'underwriting':
        return <UnderwritingModule onViewDeal={handleViewDeal} />;
      case 'portfolio':
        return <PortfolioModule onViewDeal={handleViewDeal} />;
      default:
        return <Dashboard user={user} onViewDeal={handleViewDeal} />;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}