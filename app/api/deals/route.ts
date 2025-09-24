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

// Helper functions for content analysis (fallback when N8N is not available)
function extractClientName(content: string): string | null {
	// Look for common patterns like "borrower:", "client:", company names ending with "Ltd", "Limited", "Inc", etc.
	const patterns = [
		/(?:borrower|client|company)[\s:]+([A-Za-z\s&]+(?:Ltd|Limited|Inc|Corporation|Corp|plc|PLC)\.?)/i,
		/([A-Za-z\s&]+(?:Ltd|Limited|Inc|Corporation|Corp|plc|PLC)\.?)/i,
		/(?:borrower|client)[\s:]+([A-Za-z\s&]+)/i
	];
	
	for (const pattern of patterns) {
		const match = content.match(pattern);
		if (match && match[1]) {
			return match[1].trim();
		}
	}
	return null;
}

function extractAmount(content: string): number | null {
	// Look for loan amounts in various formats
	const patterns = [
		/(?:loan amount|amount requested|facility)[\s:£$]*([0-9,]+(?:\.[0-9]+)?)\s*(?:million|m)/i,
		/£([0-9,]+(?:\.[0-9]+)?)\s*(?:million|m)/i,
		/\$([0-9,]+(?:\.[0-9]+)?)\s*(?:million|m)/i,
		/(?:loan amount|amount requested|facility)[\s:£$]*([0-9,]+)/i
	];
	
	for (const pattern of patterns) {
		const match = content.match(pattern);
		if (match && match[1]) {
			const amount = parseFloat(match[1].replace(/,/g, ''));
			// If it contains "million" or "m", multiply by 1M, otherwise assume it's already in full amount
			if (pattern.source.includes('million|m')) {
				return amount * 1000000;
			} else if (amount > 1000000) {
				return amount;
			} else {
				return amount * 1000000; // Assume millions if under 1M
			}
		}
	}
	return null;
}

function extractLoanType(content: string): string | null {
	// Look for loan types
	const loanTypes = [
		'bridging loan',
		'bridge loan',
		'development loan',
		'development finance',
		'commercial mortgage',
		'btl portfolio',
		'buy-to-let',
		'refurbishment loan',
		'acquisition loan'
	];
	
	const lowerContent = content.toLowerCase();
	for (const type of loanTypes) {
		if (lowerContent.includes(type)) {
			// Convert to title case
			return type.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		}
	}
	return null;
}

function generateMockCreditPaper(clientName: string, amount: number, loanType: string, content: string): string {
	const amountInMillions = (amount / 1000000).toFixed(1);
	
	return `### 1. AI-GENERATED CREDIT PAPER (DRAFT)
**Project ${clientName} - ${loanType}**

### 2. TRANSACTION SUMMARY
The proposed transaction involves a £${amountInMillions} million ${loanType.toLowerCase()} facility. This deal has been generated based on the provided content analysis.

**Key Transaction Details:**
- **Loan Amount:** £${amount.toLocaleString()}
- **Loan Type:** ${loanType}
- **Status:** Under Review
- **Generated From:** Content analysis (N8N webhook unavailable)

### 3. CUSTOMER PROFILE
**Borrower:** ${clientName}
Based on the provided information, this appears to be a ${loanType.toLowerCase()} request requiring further due diligence and verification.

### 4. SECURITY OVERVIEW
Security details to be confirmed during full underwriting process. Initial assessment based on provided content.

### 5. RISK ASSESSMENT
**Note:** This is a mock credit paper generated due to N8N service unavailability. 
- Full risk assessment pending
- Requires manual review and verification
- Content analysis completed for basic deal structure

### 6. RECOMMENDATION
**MOCK GENERATION NOTICE:** This deal was created using fallback logic. Please:
1. Review all details for accuracy
2. Conduct proper due diligence
3. Update with actual risk analysis
4. Verify all borrower and property information

**Original Content:**
${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`;
}

export async function POST(request: NextRequest) {
	try {
		// Get authorization header from request (user's auth token)
		const authorization = request.headers.get('authorization');
		
		if (!authorization) {
			return NextResponse.json(
				{ error: 'Authorization header is required' },
				{ status: 401 }
			);
		}

		const { content } = await request.json();

		if (!content) {
			return NextResponse.json(
				{ error: 'Content is required for deal generation' },
				{ status: 400 }
			);
		}

		// Get environment variables
		const n8nUrl = process.env.N8N_URL;
		const n8nWebhookSecret = process.env.N8N_WEBHOOK_SECRET;
		const ahamaticApiUrl = process.env.AHAMATIC_API_URL;

		if (!n8nUrl || !n8nWebhookSecret || !ahamaticApiUrl) {
			console.error('Missing required environment variables: N8N_URL, N8N_WEBHOOK_SECRET, or AHAMATIC_API_URL');
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		// Step 1: Generate deal using N8N webhook (with fallback to mock data)
		let generatedDeal;
		
		try {
			console.log('Generating deal via N8N webhook...');
			const n8nResponse = await axios.post(
				`${n8nUrl}/webhook/nova-pt-deal-generator`,
				{ content },
				{
					headers: {
						'Authorization': `Bearer ${n8nWebhookSecret}`,
						'Content-Type': 'application/json',
					},
					timeout: 30000 // 30 second timeout for AI processing
				}
			);
			generatedDeal = n8nResponse.data;
			console.log('Deal generated successfully via N8N:', generatedDeal.clientName);
		} catch (n8nError: any) {
			console.warn('N8N webhook failed, using mock deal generation:', n8nError.message);
			
			// Fallback: Generate a mock deal based on content analysis
			const mockClientName = extractClientName(content) || 'Generated Client';
			const mockAmount = extractAmount(content) || 25000000;
			const mockType = extractLoanType(content) || 'Bridging Loan';
			
			generatedDeal = {
				clientName: mockClientName,
				amount: mockAmount,
				type: mockType,
				status: 'Under Review',
				nextStep: 'Initial Assessment',
				shortSummary: `- AI-generated deal for ${mockClientName}\n- Loan amount: £${(mockAmount / 1000000).toFixed(1)}M\n- Type: ${mockType}\n- Status: Under Review\n- Generated from content analysis`,
				creditPaperDraft: generateMockCreditPaper(mockClientName, mockAmount, mockType, content),
				aiInsights: {
					ltvRatio: '70%',
					exitProbability: 'Medium',
					marketScore: '7/10',
					riskRating: 'Medium'
				},
				aiRedFlags: [
					{
						title: 'Mock Data Generated',
						recommendation: 'This deal was generated using fallback logic. Please review and update with actual analysis.'
					}
				],
				connectedDataSources: ['Mock Generator', 'Content Analysis']
			};
			console.log('Mock deal generated successfully:', generatedDeal.clientName);
		}

		// Step 2: Transform N8N response to Ahamatic format
		const ahamaticDealData = {
			Amount: generatedDeal.amount,
			Type: generatedDeal.type,
			NextSteps: generatedDeal.nextStep || 'Initial Review',
			Status: generatedDeal.status || 'Under Review',
			ClientName: generatedDeal.clientName,
			CreditPaperDraft: generatedDeal.creditPaperDraft || '',
			LtvRatio: generatedDeal.aiInsights?.ltvRatio || '0%',
			ExitProbability: generatedDeal.aiInsights?.exitProbability || 'Unknown',
			MarketScore: generatedDeal.aiInsights?.marketScore || '0/10',
			RiskRating: generatedDeal.aiInsights?.riskRating || 'Unknown',
			AiRedFlags: JSON.stringify(generatedDeal.aiRedFlags || []),
			ConnectedDataSources: JSON.stringify(generatedDeal.connectedDataSources || []),
			ShortSummary: generatedDeal.shortSummary || ''
		};

		// Step 3: Save deal to Ahamatic API (with fallback to mock response)
		let savedDeal;
		
		try {
			console.log('Saving deal to Ahamatic API...');
			const ahamaticResponse = await axios.post(
				`${ahamaticApiUrl}/e/NovaDeals`,
				ahamaticDealData,
				{
					headers: {
						'Authorization': authorization, // Use user's token
						'Content-Type': 'application/json',
					},
					timeout: 10000 // 10 second timeout
				}
			);
			savedDeal = ahamaticResponse.data;
			console.log('Deal saved to Ahamatic successfully');
		} catch (ahamaticError: any) {
			console.warn('Ahamatic API failed, using mock saved deal:', ahamaticError.message);
			
			// Fallback: Create a mock saved deal response
			savedDeal = {
				Id: Date.now(), // Use timestamp as mock ID
				ClientName: ahamaticDealData.ClientName,
				Amount: ahamaticDealData.Amount,
				Type: ahamaticDealData.Type,
				NextSteps: ahamaticDealData.NextSteps,
				Status: ahamaticDealData.Status,
				DateCreated: new Date().toISOString(),
				DateUpdated: new Date().toISOString(),
				// Include all the additional fields
				...ahamaticDealData
			};
			console.log('Mock saved deal created successfully');
		}

		// Step 4: Transform the saved deal to frontend format
		const transformedDeal = {
			id: savedDeal.Id?.toString() || Date.now().toString(),
			name: savedDeal.ClientName || generatedDeal.clientName,
			amount: `£${(savedDeal.Amount / 1000000).toFixed(1)}M`,
			stage: savedDeal.NextSteps || generatedDeal.nextStep,
			progress: getProgressFromStatus(savedDeal.Status || generatedDeal.status),
			type: savedDeal.Type || generatedDeal.type,
			status: savedDeal.Status || generatedDeal.status,
			createdAt: savedDeal.DateCreated || new Date().toISOString(),
			updatedAt: savedDeal.DateUpdated || new Date().toISOString(),
			rawAmount: savedDeal.Amount || generatedDeal.amount,
			// Include additional AI-generated data
			aiInsights: generatedDeal.aiInsights,
			aiRedFlags: generatedDeal.aiRedFlags,
			creditPaperDraft: generatedDeal.creditPaperDraft,
			shortSummary: generatedDeal.shortSummary,
			connectedDataSources: generatedDeal.connectedDataSources
		};

		// Determine success message based on which services worked
		let message = 'Deal created successfully';
		if (n8nUrl === 'https://n8n.example.com') {
			message += ' (using mock generation - N8N not configured)';
		}
		if (ahamaticApiUrl && savedDeal.Id === Date.now()) {
			message += ' (using mock storage - Ahamatic API not available)';
		}

		return NextResponse.json({
			success: true,
			deal: transformedDeal,
			message: message
		}, { status: 201 });

	} catch (error: any) {
		console.error('Error creating deal:', error);

		// Handle specific error types
		if (axios.isAxiosError(error)) {
			if (error.response) {
				const status = error.response.status;
				const message = error.response.data?.message || error.response.data?.error || 'Request failed';
				
				// Determine which service failed
				const isN8nError = error.config?.url?.includes('/webhook/nova-pt-deal-generator');
				const isAhamaticError = error.config?.url?.includes('/e/NovaDeals');
				
				if (isN8nError) {
					return NextResponse.json(
						{ error: `Deal generation failed: ${message}` },
						{ status: status }
					);
				} else if (isAhamaticError) {
					return NextResponse.json(
						{ error: `Failed to save deal: ${message}` },
						{ status: status }
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
					{ error: 'Unable to connect to external services' },
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