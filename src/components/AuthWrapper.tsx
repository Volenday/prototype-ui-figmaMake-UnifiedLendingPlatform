'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Login } from './Login';

interface AuthWrapperProps {
	children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
	const { isAuthenticated, token } = useAuth();
	const [isHydrated, setIsHydrated] = useState(false);

	// Handle hydration mismatch by waiting for client-side hydration
	useEffect(() => {
		setIsHydrated(true);
	}, []);

	// Don't render anything until hydrated to prevent SSR mismatch
	if (!isHydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/30">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="mt-2 text-sm text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// Show login if not authenticated or no token
	if (!isAuthenticated || !token) {
		return <Login />;
	}

	// Show main app if authenticated
	return <>{children}</>;
}