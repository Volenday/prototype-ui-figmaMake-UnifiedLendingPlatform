import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		// Validate required fields
		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		// Get environment variables
		const apiUrl = process.env.AHAMATIC_API_URL;
		const apiKey = process.env.AHAMATIC_API_KEY;

		if (!apiUrl || !apiKey) {
			console.error('Missing required environment variables: AHAMATIC_API_URL or AHAMATIC_API_KEY');
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		// Authenticate with Ahamatic API
		const authResponse = await axios.post(`${apiUrl}/auth/email`, {
			apiKey: apiKey,
			emailAddress: email,
			password: password
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: 10000 // 10 second timeout
		});

		// Extract tokens from response
		const { token, refreshToken } = authResponse.data;

		if (!token) {
			return NextResponse.json(
				{ error: 'Authentication failed - no token received' },
				{ status: 401 }
			);
		}

		// Create user object (you may need to adjust based on actual API response)
		const user = {
			id: authResponse.data.userId || '1',
			name: authResponse.data.name || 'User',
			role: authResponse.data.role || 'Credit Analyst',
			email: email,
		};

		// Return successful response
		return NextResponse.json({
			user,
			token,
			refreshToken,
			message: 'Login successful'
		});

	} catch (error: any) {
		console.error('Authentication error:', error);

		// Handle Axios errors
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error status
				const status = error.response.status;
				const message = error.response.data?.message || error.response.data?.error || 'Authentication failed';
				
				if (status === 401) {
					return NextResponse.json(
						{ error: 'Invalid email or password' },
						{ status: 401 }
					);
				} else if (status === 400) {
					return NextResponse.json(
						{ error: message },
						{ status: 400 }
					);
				} else {
					return NextResponse.json(
						{ error: `Authentication service error: ${message}` },
						{ status: status }
					);
				}
			} else if (error.request) {
				// Network error
				return NextResponse.json(
					{ error: 'Unable to connect to authentication service' },
					{ status: 503 }
				);
			}
		}

		// Generic error fallback
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}