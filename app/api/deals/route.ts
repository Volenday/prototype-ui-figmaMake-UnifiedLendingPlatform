import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
	try {
		// Get authorization header from request
		const authorization = request.headers.get('authorization');
		
		if (!authorization) {
			return NextResponse.json(
				{ error: 'Authorization header is required' },
				{ status: 401 }
			);
		}

		// Get environment variables
		const apiUrl = process.env.AHAMATIC_API_URL;

		if (!apiUrl) {
			console.error('Missing required environment variable: AHAMATIC_API_URL');
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		// Extract query parameters for filtering
		const { searchParams } = new URL(request.url);
		const stage = searchParams.get('stage');
		const status = searchParams.get('status');
		const page = searchParams.get('page') || '1';
		const limit = searchParams.get('limit') || '10';

		// Fetch deals from Ahamatic API
		const dealsResponse = await axios.get(`${apiUrl}/e/NovaDeals`, {
			headers: {
				'Authorization': authorization,
				'Content-Type': 'application/json',
			},
			params: {
				page,
				limit,
				...(stage && { stage }),
				...(status && { status }),
			},
			timeout: 10000 // 10 second timeout
		});

		// Transform the response to match our expected format
		const { data: responseData } = dealsResponse.data;
		
		// Transform deals to match frontend expectations
		const transformedDeals = responseData?.map((deal: any) => ({
			id: deal.Id.toString(),
			name: deal.ClientName,
			amount: `£${(deal.Amount / 1000000).toFixed(1)}M`,
			stage: deal.NextSteps,
			progress: getProgressFromStatus(deal.Status),
			type: deal.Type,
			status: deal.Status,
			createdAt: deal.DateCreated,
			updatedAt: deal.DateUpdated,
			rawAmount: deal.Amount,
		})) || [];

		return NextResponse.json({
			deals: transformedDeals,
			total: dealsResponse.data.total || 0,
			currentPage: dealsResponse.data.currentPage || 1,
			totalPages: dealsResponse.data.totalPages || 1,
			start: dealsResponse.data.start || true,
			end: dealsResponse.data.end || true,
		});

	} catch (error: any) {
		console.error('Error fetching deals:', error);

		// Handle Axios errors
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error status
				const status = error.response.status;
				const message = error.response.data?.message || error.response.data?.error || 'Failed to fetch deals';
				
				if (status === 401) {
					return NextResponse.json(
						{ error: 'Unauthorized - Invalid or expired token' },
						{ status: 401 }
					);
				} else if (status === 403) {
					return NextResponse.json(
						{ error: 'Forbidden - Insufficient permissions' },
						{ status: 403 }
					);
				} else {
					return NextResponse.json(
						{ error: `API error: ${message}` },
						{ status: status }
					);
				}
			} else if (error.request) {
				// Network error
				return NextResponse.json(
					{ error: 'Unable to connect to deals service' },
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

// Helper function to map status to progress percentage
function getProgressFromStatus(status: string): number {
	switch (status?.toLowerCase()) {
		case 'approved':
			return 100;
		case 'pending':
			return 50;
		case 'amendments required':
			return 75;
		case 'rejected':
			return 0;
		default:
			return 25;
	}
}

export async function POST(request: NextRequest) {
	try {
		const dealData = await request.json();

		// Mock creating a new deal
		const newDeal = {
			id: (mockDeals.length + 1).toString(),
			...dealData,
			stage: 'Initial Review',
			progress: 0,
			status: 'Active',
			createdAt: new Date().toISOString().split('T')[0],
		};

		mockDeals.push(newDeal);

		return NextResponse.json(newDeal, { status: 201 });

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}