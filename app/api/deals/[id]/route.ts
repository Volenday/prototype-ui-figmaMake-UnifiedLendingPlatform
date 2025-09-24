import { NextRequest, NextResponse } from 'next/server';

// Mock deal details
const mockDealDetails = {
	'1': {
		id: '1',
		name: 'Oakwood Commercial Center',
		amount: '£2.5M',
		stage: 'Underwriting',
		progress: 65,
		type: 'Commercial',
		status: 'Active',
		createdAt: '2024-01-15',
		borrower: {
			name: 'Oakwood Development Ltd',
			contact: 'John Smith',
			email: 'john.smith@oakwood.com',
			phone: '+44 20 1234 5678',
		},
		property: {
			address: '123 Commercial Street, London, EC1A 1BB',
			propertyType: 'Office Building',
			valuation: '£3.2M',
			loanToValue: '78%',
		},
		financials: {
			requestedAmount: '£2.5M',
			interestRate: '4.5%',
			term: '5 years',
			monthlyPayment: '£46,500',
		},
		documents: [
			{ name: 'Property Valuation', status: 'Completed', date: '2024-01-10' },
			{ name: 'Credit Report', status: 'Completed', date: '2024-01-12' },
			{ name: 'Financial Statements', status: 'Pending', date: null },
			{ name: 'Legal Documentation', status: 'In Progress', date: '2024-01-18' },
		],
		timeline: [
			{ date: '2024-01-15', event: 'Application Submitted', status: 'Completed' },
			{ date: '2024-01-16', event: 'Initial Review', status: 'Completed' },
			{ date: '2024-01-18', event: 'Underwriting Started', status: 'In Progress' },
			{ date: '2024-01-25', event: 'Committee Review', status: 'Pending' },
		],
	},
};

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const dealId = params.id;
		const deal = mockDealDetails[dealId as keyof typeof mockDealDetails];

		if (!deal) {
			return NextResponse.json(
				{ error: 'Deal not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(deal);

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const dealId = params.id;
		const updateData = await request.json();

		// Mock updating deal
		const existingDeal = mockDealDetails[dealId as keyof typeof mockDealDetails];
		
		if (!existingDeal) {
			return NextResponse.json(
				{ error: 'Deal not found' },
				{ status: 404 }
			);
		}

		const updatedDeal = {
			...existingDeal,
			...updateData,
		};

		return NextResponse.json(updatedDeal);

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}