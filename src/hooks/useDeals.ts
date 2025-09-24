import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from 'axios';
import { useDealsStore, Deal, DealsResponse } from '@/stores/dealsStore';
import { useAuthStore } from '@/stores/authStore';

interface FetchDealsParams {
	page?: number;
	limit?: number;
	stage?: string;
	status?: string;
}

// Fetch deals from API
const fetchDeals = async (params: FetchDealsParams = {}): Promise<DealsResponse> => {
	const token = useAuthStore.getState().token;
	
	if (!token) {
		throw new Error('No authentication token available');
	}

	const response = await axios.get('/api/deals', {
		headers: {
			'Authorization': `Bearer ${token}`,
		},
		params,
	});

	return response.data;
};

// Create a new deal
const createDeal = async (dealData: Partial<Deal>): Promise<Deal> => {
	const token = useAuthStore.getState().token;
	
	if (!token) {
		throw new Error('No authentication token available');
	}

	const response = await axios.post('/api/deals', dealData, {
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	});

	return response.data;
};

export const useDeals = (params: FetchDealsParams = {}) => {
	const { setDeals, setLoading, setError, deals } = useDealsStore();
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ['deals', params],
		queryFn: () => fetchDeals(params),
		// Cache for 5 minutes
		staleTime: 5 * 60 * 1000,
		// Keep in cache for 10 minutes (renamed in v5)
		gcTime: 10 * 60 * 1000,
		// Refetch on window focus
		refetchOnWindowFocus: true,
		// Retry failed requests
		retry: 2,
	});

	// Handle success/error effects
	React.useEffect(() => {
		if (query.data) {
			setDeals(query.data);
			setLoading(false);
		}
	}, [query.data, setDeals, setLoading]);

	React.useEffect(() => {
		if (query.error) {
			console.error('Error fetching deals:', query.error);
			const errorMessage = query.error?.response?.data?.error || query.error?.message || 'Failed to fetch deals';
			setError(errorMessage);
		}
	}, [query.error, setError]);

	React.useEffect(() => {
		setLoading(query.isLoading);
	}, [query.isLoading, setLoading]);

	const createDealMutation = useMutation({
		mutationFn: createDeal,
		onSuccess: (newDeal: Deal) => {
			// Add to store
			useDealsStore.getState().addDeal(newDeal);
			// Invalidate and refetch deals
			queryClient.invalidateQueries({ queryKey: ['deals'] });
		},
		onError: (error: any) => {
			console.error('Error creating deal:', error);
			const errorMessage = error.response?.data?.error || error.message || 'Failed to create deal';
			setError(errorMessage);
		},
	});

	const refetch = () => {
		return query.refetch();
	};

	return {
		// Query state
		deals: query.data?.deals || deals,
		totalDeals: query.data?.total || 0,
		currentPage: query.data?.currentPage || 1,
		totalPages: query.data?.totalPages || 1,
		isLoading: query.isLoading,
		error: query.error?.message || null,
		
		// Actions
		refetch,
		createDeal: createDealMutation.mutate,
		isCreating: createDealMutation.isLoading,
		createError: createDealMutation.error?.message || null,
	};
};

// Hook for getting a single deal
export const useDeal = (id: string) => {
	const getDealById = useDealsStore((state) => state.getDealById);
	return getDealById(id);
};

// Hook for filtered deals
export const useFilteredDeals = () => {
	const getFilteredDeals = useDealsStore((state) => state.getFilteredDeals);
	const filters = useDealsStore((state) => state.filters);
	const setFilters = useDealsStore((state) => state.setFilters);
	const clearFilters = useDealsStore((state) => state.clearFilters);

	return {
		deals: getFilteredDeals(),
		filters,
		setFilters,
		clearFilters,
	};
};

// Hook for selected deal
export const useSelectedDeal = () => {
	const selectedDeal = useDealsStore((state) => state.selectedDeal);
	const setSelectedDeal = useDealsStore((state) => state.setSelectedDeal);
	const selectDealById = useDealsStore((state) => state.selectDealById);
	const clearSelectedDeal = useDealsStore((state) => state.clearSelectedDeal);

	return {
		selectedDeal,
		setSelectedDeal,
		selectDealById,
		clearSelectedDeal,
	};
};