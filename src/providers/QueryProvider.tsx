'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
	children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Global query options
						staleTime: 5 * 60 * 1000, // 5 minutes
						cacheTime: 10 * 60 * 1000, // 10 minutes
						refetchOnWindowFocus: false,
						retry: (failureCount, error: any) => {
							// Don't retry on 401/403 errors
							if (error?.response?.status === 401 || error?.response?.status === 403) {
								return false;
							}
							// Retry up to 2 times for other errors
							return failureCount < 2;
						},
					},
					mutations: {
						// Global mutation options
						retry: 1,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* Show React Query DevTools in development */}
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}