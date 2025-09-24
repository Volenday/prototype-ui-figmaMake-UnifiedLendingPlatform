import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Deal {
	id: string;
	name: string;
	amount: string;
	stage: string;
	progress: number;
	type: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	rawAmount: number;
}

export interface DealsResponse {
	deals: Deal[];
	total: number;
	currentPage: number;
	totalPages: number;
	start: boolean;
	end: boolean;
}

interface DealsState {
	// State
	deals: Deal[];
	totalDeals: number;
	currentPage: number;
	totalPages: number;
	isLoading: boolean;
	error: string | null;
	lastFetched: number | null;
	selectedDeal: Deal | null;
	
	// Filters
	filters: {
		stage?: string;
		status?: string;
		search?: string;
	};

	// Actions
	setDeals: (response: DealsResponse) => void;
	addDeal: (deal: Deal) => void;
	updateDeal: (id: string, updates: Partial<Deal>) => void;
	removeDeal: (id: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setFilters: (filters: Partial<DealsState['filters']>) => void;
	clearFilters: () => void;
	clearDeals: () => void;
	getDealById: (id: string) => Deal | undefined;
	getFilteredDeals: () => Deal[];
	setSelectedDeal: (deal: Deal | null) => void;
	selectDealById: (id: string) => void;
	clearSelectedDeal: () => void;
}

export const useDealsStore = create<DealsState>()(
	persist(
		(set, get) => ({
			// Initial state
			deals: [],
			totalDeals: 0,
			currentPage: 1,
			totalPages: 1,
			isLoading: false,
			error: null,
			lastFetched: null,
			selectedDeal: null,
			filters: {},

			// Actions
			setDeals: (response: DealsResponse) => {
				set({
					deals: response.deals,
					totalDeals: response.total,
					currentPage: response.currentPage,
					totalPages: response.totalPages,
					lastFetched: Date.now(),
					error: null,
				});
			},

			addDeal: (deal: Deal) => {
				const currentDeals = get().deals;
				set({
					deals: [deal, ...currentDeals],
					totalDeals: get().totalDeals + 1,
				});
			},

			updateDeal: (id: string, updates: Partial<Deal>) => {
				const currentDeals = get().deals;
				const updatedDeals = currentDeals.map(deal => 
					deal.id === id ? { ...deal, ...updates } : deal
				);
				set({ deals: updatedDeals });
			},

			removeDeal: (id: string) => {
				const currentDeals = get().deals;
				const filteredDeals = currentDeals.filter(deal => deal.id !== id);
				set({
					deals: filteredDeals,
					totalDeals: get().totalDeals - 1,
				});
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading });
			},

			setError: (error: string | null) => {
				set({ error, isLoading: false });
			},

			setFilters: (newFilters: Partial<DealsState['filters']>) => {
				set({
					filters: { ...get().filters, ...newFilters },
				});
			},

			clearFilters: () => {
				set({ filters: {} });
			},

			clearDeals: () => {
				set({
					deals: [],
					totalDeals: 0,
					currentPage: 1,
					totalPages: 1,
					error: null,
					lastFetched: null,
					selectedDeal: null,
				});
			},

			getDealById: (id: string) => {
				return get().deals.find(deal => deal.id === id);
			},

			getFilteredDeals: () => {
				const { deals, filters } = get();
				let filtered = [...deals];

				if (filters.stage) {
					filtered = filtered.filter(deal => 
						deal.stage.toLowerCase().includes(filters.stage!.toLowerCase())
					);
				}

				if (filters.status) {
					filtered = filtered.filter(deal => 
						deal.status.toLowerCase() === filters.status!.toLowerCase()
					);
				}

				if (filters.search) {
					filtered = filtered.filter(deal => 
						deal.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
						deal.type.toLowerCase().includes(filters.search!.toLowerCase())
					);
				}

				return filtered;
			},

			setSelectedDeal: (deal: Deal | null) => {
				set({ selectedDeal: deal });
			},

			selectDealById: (id: string) => {
				const deal = get().getDealById(id);
				if (deal) {
					set({ selectedDeal: deal });
				}
			},

			clearSelectedDeal: () => {
				set({ selectedDeal: null });
			},
		}),
		{
			name: 'deals-storage',
			storage: createJSONStorage(() => localStorage),
			// Only persist essential data, not loading states
			partialize: (state) => ({
				deals: state.deals,
				totalDeals: state.totalDeals,
				currentPage: state.currentPage,
				totalPages: state.totalPages,
				lastFetched: state.lastFetched,
				selectedDeal: state.selectedDeal,
				filters: state.filters,
			}),
		}
	)
);