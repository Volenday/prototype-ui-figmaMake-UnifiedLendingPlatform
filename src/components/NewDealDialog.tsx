'use client';

import { useState } from 'react';
import * as React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';

interface NewDealDialogProps {
	trigger?: React.ReactNode;
	onDealCreated?: (deal: any) => void;
}

export function NewDealDialog({ trigger, onDealCreated }: NewDealDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState('');
	
	const { createDeal, isCreating, createError, createSuccess, resetCreateMutation } = useDeals();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!content.trim()) {
			return;
		}

		createDeal(content);
	};

	// Handle successful creation
	React.useEffect(() => {
		if (createSuccess) {
			// Close dialog and reset form after showing success message
			const timer = setTimeout(() => {
				setIsOpen(false);
				setContent('');
				resetCreateMutation();
			}, 3000); // Give user time to see success message

			return () => clearTimeout(timer);
		}
	}, [createSuccess, resetCreateMutation]);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			// Reset form and mutation state when closing
			setContent('');
			resetCreateMutation();
		}
	};

	const defaultTrigger = (
		<Button>
			<Plus className="mr-2 h-4 w-4" />
			New Deal
		</Button>
	);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || defaultTrigger}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] bg-background border">
				<DialogHeader>
					<DialogTitle>Generate New Deal</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="content">Deal Description</Label>
						<Textarea
							id="content"
							placeholder="Describe the deal details including borrower information, property details, loan amount, terms, and any other relevant information..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={8}
							disabled={isCreating}
							className="resize-none"
						/>
						<p className="text-sm text-muted-foreground">
							Provide comprehensive details about the borrower, property, loan requirements, and exit strategy. The AI will use this information to generate a complete deal structure.
						</p>
					</div>

					{/* Success Message */}
					{createSuccess && (
						<Alert className="border-green-200 bg-green-50 text-green-800">
							<CheckCircle className="h-4 w-4" />
							<AlertDescription>
								Deal generated and saved successfully! The new deal will appear in your dashboard shortly.
							</AlertDescription>
						</Alert>
					)}

					{/* Error Message */}
					{createError && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								{createError}
							</AlertDescription>
						</Alert>
					)}

					<div className="flex justify-end space-x-2 pt-4">
						<Button 
							type="button" 
							variant="outline" 
							onClick={() => setIsOpen(false)}
							disabled={isCreating}
						>
							Cancel
						</Button>
						<Button 
							type="submit" 
							disabled={!content.trim() || isCreating}
						>
							{isCreating ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Generating Deal...
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Generate Deal
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}