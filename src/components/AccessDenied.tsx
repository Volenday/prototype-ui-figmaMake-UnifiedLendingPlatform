'use client';

import { AlertTriangle, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuthStore } from '@/stores/authStore';

export function AccessDenied() {
	const clearAuth = useAuthStore((state) => state.clearAuth);

	const handleRetryLogin = () => {
		// Clear any stale auth state and force re-authentication
		clearAuth();
		// The page will re-render and show the login form
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-2 text-center">
					<div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
						<AlertTriangle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle className="text-2xl">Access Denied</CardTitle>
					<p className="text-muted-foreground">
						You need to be authenticated to access the Unified Lending Platform
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center text-sm text-muted-foreground">
						<p>Your session may have expired or you may not be logged in.</p>
						<p>Please sign in with your Ahamatic credentials to continue.</p>
					</div>
					<Button onClick={handleRetryLogin} className="w-full">
						<LogIn className="mr-2 h-4 w-4" />
						Sign In
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}