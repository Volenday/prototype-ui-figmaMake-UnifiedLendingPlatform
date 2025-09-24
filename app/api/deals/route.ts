import { NextRequest, NextResponse } from 'next/server';

// Mock deals data
const mockDeals = [
	{
		id: '1',
		name: 'Oakwood Commercial Center',
		amount: '£2.5M',
		stage: 'Underwriting',
		progress: 65,
		type: 'Commercial',
		status: 'Active',
		createdAt: '2024-01-15',
	},
	{
		id: '2',
		name: 'City Heights Residential',
		amount: '£1.8M',
		stage: 'Committee Review',
		progress: 85,
		type: 'Residential',
		status: 'Active',
		createdAt: '2024-01-10',
	},
	{
		id: '3',
		name: 'Riverside Warehouse',
		amount: '£3.2M',
		stage: 'Due Diligence',
		progress: 40,
		type: 'Industrial',
		status: 'Active',
		createdAt: '2024-01-20',
	},
];

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const stage = searchParams.get('stage');
		const status = searchParams.get('status');

		let filteredDeals = mockDeals;

		if (stage) {
			filteredDeals = filteredDeals.filter(deal => 
				deal.stage.toLowerCase().includes(stage.toLowerCase())
			);
		}

		if (status) {
			filteredDeals = filteredDeals.filter(deal => 
				deal.status.toLowerCase() === status.toLowerCase()
			);
		}

		return NextResponse.json({
			deals: filteredDeals,
			total: filteredDeals.length,
		});

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
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