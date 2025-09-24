import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		// In a real app, you would get user ID from JWT token
		const mockUserProfile = {
			id: '1',
			name: 'Sarah Johnson',
			role: 'Senior Credit Analyst',
			email: 'sarah.johnson@lendingco.com',
			department: 'Credit & Risk',
			location: 'London, UK',
			permissions: [
				'view_deals',
				'create_deals',
				'approve_small_loans',
				'view_portfolio',
			],
			preferences: {
				theme: 'system',
				notifications: {
					email: true,
					push: true,
					dealUpdates: true,
				},
			},
		};

		return NextResponse.json(mockUserProfile);

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const updateData = await request.json();

		// Mock updating user profile
		const updatedProfile = {
			id: '1',
			name: 'Sarah Johnson',
			role: 'Senior Credit Analyst',
			email: 'sarah.johnson@lendingco.com',
			...updateData,
		};

		return NextResponse.json(updatedProfile);

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}