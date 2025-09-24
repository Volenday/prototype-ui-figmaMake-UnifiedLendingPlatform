import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export const useAuth = () => {
	const { user, token, refreshToken, isAuthenticated, logout, setTokens } = useAuthStore();

	// Set up axios interceptor for authenticated requests
	useEffect(() => {
		if (token) {
			// Add token to all requests
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		} else {
			// Remove token from requests if not authenticated
			delete axios.defaults.headers.common['Authorization'];
		}

		// Response interceptor to handle token refresh
		const responseInterceptor = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				// If we get a 401 and haven't already tried to refresh
				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					if (refreshToken) {
						try {
							// Try to refresh the token
							const refreshResponse = await axios.post('/api/auth/refresh', {
								refreshToken,
							});

							const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;
							
							// Update tokens in store
							setTokens(newToken, newRefreshToken);
							
							// Update the failed request with new token
							originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
							
							// Retry the original request
							return axios(originalRequest);
						} catch (refreshError) {
							// Refresh failed, logout user
							console.error('Token refresh failed:', refreshError);
							logout();
							return Promise.reject(refreshError);
						}
					} else {
						// No refresh token, logout user
						logout();
					}
				}

				return Promise.reject(error);
			}
		);

		// Cleanup interceptor on unmount
		return () => {
			axios.interceptors.response.eject(responseInterceptor);
		};
	}, [token, refreshToken, logout, setTokens]);

	return {
		user,
		token,
		refreshToken,
		isAuthenticated,
		logout,
	};
};