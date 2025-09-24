import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
	id: string;
	name: string;
	role: string;
	email: string;
}

interface AuthState {
	// State
	user: User | null;
	token: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	
	// Actions
	login: (user: User, token: string, refreshToken: string) => void;
	logout: () => void;
	updateUser: (user: Partial<User>) => void;
	setTokens: (token: string, refreshToken: string) => void;
	clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			token: null,
			refreshToken: null,
			isAuthenticated: false,

			// Actions
			login: (user: User, token: string, refreshToken: string) => {
				set({
					user,
					token,
					refreshToken,
					isAuthenticated: true,
				});
			},

			logout: () => {
				set({
					user: null,
					token: null,
					refreshToken: null,
					isAuthenticated: false,
				});
				// Clear localStorage as well
				if (typeof window !== 'undefined') {
					localStorage.removeItem('authToken');
					localStorage.removeItem('refreshToken');
				}
			},

			updateUser: (updatedUser: Partial<User>) => {
				const currentUser = get().user;
				if (currentUser) {
					set({
						user: { ...currentUser, ...updatedUser },
					});
				}
			},

			setTokens: (token: string, refreshToken: string) => {
				set({
					token,
					refreshToken,
				});
			},

			clearAuth: () => {
				set({
					user: null,
					token: null,
					refreshToken: null,
					isAuthenticated: false,
				});
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			// Only persist essential data
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);