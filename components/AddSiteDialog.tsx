"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddSiteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function AddSiteDialog({
	open,
	onOpenChange,
	onSuccess,
}: AddSiteDialogProps) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		domain: "",
		contactName: "",
		email: "",
		price: "",
		ahrefsDR: "",
		mozDA: "",
		niche: "",
		company: "",
		notes: "",
		acceptsIGaming: false,
	});
	const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
	const [contactNames, setContactNames] = useState<string[]>([]);
	const [newEmail, setNewEmail] = useState("");
	const [newContactName, setNewContactName] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch("/api/admin/sites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					price: formData.price
						? Number.parseFloat(formData.price)
						: null,
					ahrefsDR: formData.ahrefsDR
						? Number.parseInt(formData.ahrefsDR)
						: null,
					mozDA: formData.mozDA
						? Number.parseInt(formData.mozDA)
						: null,
					additionalEmails:
						additionalEmails.length > 0 ? additionalEmails : null,
					contactNames: contactNames.length > 0 ? contactNames : null,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to add site");
			}

			toast.success("Site added successfully!");
			onSuccess();
			onOpenChange(false);
			setFormData({
				domain: "",
				contactName: "",
				email: "",
				price: "",
				ahrefsDR: "",
				mozDA: "",
				niche: "",
				company: "",
				notes: "",
				acceptsIGaming: false,
			});
			setAdditionalEmails([]);
			setContactNames([]);
			setNewEmail("");
			setNewContactName("");
		} catch (error) {
			toast.error("Failed to add site");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Site</DialogTitle>
					<DialogDescription>
						Add a new website to your inventory
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<Label htmlFor="domain">Domain *</Label>
							<Input
								id="domain"
								value={formData.domain}
								onChange={(e) =>
									setFormData({
										...formData,
										domain: e.target.value,
									})
								}
								placeholder="example.com"
								required
							/>
						</div>

						<div>
							<Label htmlFor="contactName">Contact Name</Label>
							<Input
								id="contactName"
								value={formData.contactName}
								onChange={(e) =>
									setFormData({
										...formData,
										contactName: e.target.value,
									})
								}
								placeholder="John Doe"
							/>
						</div>

						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								placeholder="contact@example.com"
							/>
						</div>

						<div>
							<Label htmlFor="company">Company</Label>
							<Input
								id="company"
								value={formData.company}
								onChange={(e) =>
									setFormData({
										...formData,
										company: e.target.value,
									})
								}
								placeholder="Company Name"
							/>
						</div>

						<div>
							<Label htmlFor="niche">Niche</Label>
							<Input
								id="niche"
								value={formData.niche}
								onChange={(e) =>
									setFormData({
										...formData,
										niche: e.target.value,
									})
								}
								placeholder="Technology, Health, etc."
							/>
						</div>

						<div>
							<Label htmlFor="price">Price ($)</Label>
							<Input
								id="price"
								type="number"
								step="0.01"
								value={formData.price}
								onChange={(e) =>
									setFormData({
										...formData,
										price: e.target.value,
									})
								}
								placeholder="100.00"
							/>
						</div>

						<div>
							<Label htmlFor="ahrefsDR">Ahrefs DR</Label>
							<Input
								id="ahrefsDR"
								type="number"
								value={formData.ahrefsDR}
								onChange={(e) =>
									setFormData({
										...formData,
										ahrefsDR: e.target.value,
									})
								}
								placeholder="50"
							/>
						</div>

						<div>
							<Label htmlFor="mozDA">Moz DA</Label>
							<Input
								id="mozDA"
								type="number"
								value={formData.mozDA}
								onChange={(e) =>
									setFormData({
										...formData,
										mozDA: e.target.value,
									})
								}
								placeholder="45"
							/>
						</div>
					</div>

					{/* Additional Contact Names */}
					<div>
						<Label>Additional Contact Names</Label>
						<div className="space-y-2">
							{contactNames.map((name, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={name}
										disabled
										className="flex-1"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => {
											setContactNames(
												contactNames.filter(
													(_, i) => i !== index,
												),
											);
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
							<div className="flex gap-2">
								<Input
									value={newContactName}
									onChange={(e) =>
										setNewContactName(e.target.value)
									}
									placeholder="Add another contact name"
									className="flex-1"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										if (newContactName.trim()) {
											setContactNames([
												...contactNames,
												newContactName.trim(),
											]);
											setNewContactName("");
										}
									}}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Additional Emails */}
					<div>
						<Label>Additional Emails</Label>
						<div className="space-y-2">
							{additionalEmails.map((email, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={email}
										disabled
										className="flex-1"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => {
											setAdditionalEmails(
												additionalEmails.filter(
													(_, i) => i !== index,
												),
											);
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
							<div className="flex gap-2">
								<Input
									type="email"
									value={newEmail}
									onChange={(e) =>
										setNewEmail(e.target.value)
									}
									placeholder="Add another email"
									className="flex-1"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										if (newEmail.trim()) {
											setAdditionalEmails([
												...additionalEmails,
												newEmail.trim(),
											]);
											setNewEmail("");
										}
									}}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* iGaming Acceptance */}
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="acceptsIGaming"
							checked={formData.acceptsIGaming}
							onChange={(e) =>
								setFormData({
									...formData,
									acceptsIGaming: e.target.checked,
								})
							}
							className="h-4 w-4 rounded border-gray-300"
						/>
						<Label
							htmlFor="acceptsIGaming"
							className="cursor-pointer"
						>
							Accepts iGaming Content
						</Label>
					</div>

					{/* Notes */}
					<div className="col-span-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							value={formData.notes}
							onChange={(e) =>
								setFormData({
									...formData,
									notes: e.target.value,
								})
							}
							placeholder="Add any additional notes about this site..."
							rows={4}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Add Site
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
