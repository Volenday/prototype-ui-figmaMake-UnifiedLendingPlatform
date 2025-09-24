'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { DealHub } from '@/components/DealHub';
import { OriginationModule } from '@/components/OriginationModule';
import { UnderwritingModule } from '@/components/UnderwritingModule';
import { PortfolioModule } from '@/components/PortfolioModule';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AuthWrapper } from '@/components/AuthWrapper';
import { useAuthStore } from '@/stores/authStore';

type NavigationItem = 'dashboard' | 'deals' | 'origination' | 'underwriting' | 'portfolio';

function AppContent() {
	const { user } = useAuthStore();
	const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
	const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

	const handleViewDeal = (dealId: string) => {
		setSelectedDealId(dealId);
		setActiveView('deals');
	};

	const renderContent = () => {
		if (!user) return null;

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

	if (!user) return null;

	return (
		<div className="h-screen flex bg-background">
			<Sidebar activeView={activeView} onNavigate={setActiveView} />
			<div className="flex-1 flex flex-col">
				<Header user={user} />
				<main className="flex-1 overflow-auto">
					{renderContent()}
				</main>
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<AuthWrapper>
			<AppContent />
		</AuthWrapper>
	);
}