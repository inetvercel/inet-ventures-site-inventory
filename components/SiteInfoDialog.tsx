"use client";

import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Textarea } from "@ui/components/textarea";
import {
	CheckCircle2Icon,
	Edit2,
	ExternalLinkIcon,
	Loader2,
	Save,
	X,
	XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SiteInfoDialogProps {
	site: any;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SiteInfoDialog({
	site,
	open,
	onOpenChange,
}: SiteInfoDialogProps) {
	const [isOnline, setIsOnline] = useState<boolean | null>(null);
	const [checking, setChecking] = useState(false);
	const [isEditingNotes, setIsEditingNotes] = useState(false);
	const [notes, setNotes] = useState("");
	const [savingNotes, setSavingNotes] = useState(false);

	useEffect(() => {
		if (open && site) {
			checkSiteStatus();
			setNotes(site.notes || "");
			setIsEditingNotes(false);
		}
	}, [open, site]);

	const saveNotes = async () => {
		setSavingNotes(true);
		try {
			const response = await fetch(`/api/admin/sites/${site.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ notes }),
			});

			if (!response.ok) throw new Error("Failed to save notes");

			toast.success("Notes saved successfully");
			setIsEditingNotes(false);
		} catch (error) {
			console.error("Error saving notes:", error);
			toast.error("Failed to save notes");
		} finally {
			setSavingNotes(false);
		}
	};

	const checkSiteStatus = async () => {
		setChecking(true);
		try {
			const response = await fetch(`https://${site.domain}`, {
				method: "HEAD",
				mode: "no-cors",
			});
			setIsOnline(true);
		} catch {
			setIsOnline(false);
		} finally {
			setChecking(false);
		}
	};

	if (!site) return null;

	const getCountryFlag = (countryCode: string) => {
		if (!countryCode) return null;
		return String.fromCodePoint(
			...countryCode
				.toUpperCase()
				.split("")
				.map((char) => 127397 + char.charCodeAt(0)),
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<a
							href={`https://${site.domain}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline flex items-center gap-1"
						>
							{site.domain}
							<ExternalLinkIcon className="h-4 w-4" />
						</a>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Status Section */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<h3 className="text-sm font-semibold text-muted-foreground">
								Status
							</h3>
							<div className="flex items-center gap-2">
								{checking ? (
									<>
										<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
										<span className="text-sm">
											Checking...
										</span>
									</>
								) : isOnline === null ? (
									<span className="text-sm text-muted-foreground">
										Not checked
									</span>
								) : isOnline ? (
									<>
										<CheckCircle2Icon className="h-5 w-5 text-green-500" />
										<span className="text-sm font-medium text-green-600">
											Online
										</span>
									</>
								) : (
									<>
										<XCircleIcon className="h-5 w-5 text-red-500" />
										<span className="text-sm font-medium text-red-600">
											Offline
										</span>
									</>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="text-sm font-semibold text-muted-foreground">
								Location
							</h3>
							<div className="flex items-center gap-2">
								{site.country ? (
									<>
										<span className="text-2xl">
											{getCountryFlag(site.country)}
										</span>
										<span className="text-sm font-medium">
											{site.country}
										</span>
									</>
								) : (
									<span className="text-sm text-muted-foreground">
										Unknown
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-muted-foreground">
							Contact Information
						</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-muted-foreground">
									Contact Name
								</p>
								<p className="text-sm font-medium">
									{site.contactName || "-"}
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Email
								</p>
								<p className="text-sm font-medium">
									{site.email || "-"}
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Company
								</p>
								<p className="text-sm font-medium">
									{site.company || "-"}
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Niche
								</p>
								<p className="text-sm font-medium">
									{site.niche || "-"}
								</p>
							</div>
						</div>
					</div>

					{/* SEO Metrics */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-muted-foreground">
							SEO Metrics
						</h3>
						<div className="grid grid-cols-3 gap-4">
							<div className="rounded-lg border p-3">
								<p className="text-xs text-muted-foreground">
									Ahrefs DR
								</p>
								<p className="text-2xl font-bold">
									{site.ahrefsDR || "-"}
								</p>
							</div>
							<div className="rounded-lg border p-3">
								<p className="text-xs text-muted-foreground">
									Moz DA
								</p>
								<p className="text-2xl font-bold">
									{site.mozDA || "-"}
								</p>
							</div>
							<div className="rounded-lg border p-3">
								<p className="text-xs text-muted-foreground">
									Price
								</p>
								<p className="text-2xl font-bold">
									{site.price ? `$${site.price}` : "-"}
								</p>
							</div>
						</div>
					</div>

					{/* Usage Stats */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-muted-foreground">
							Usage & Status
						</h3>
						<div className="grid grid-cols-3 gap-4">
							<div>
								<p className="text-xs text-muted-foreground">
									Times Used
								</p>
								<p className="text-lg font-semibold">
									{site.timesUsed || 0}
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Stage
								</p>
								<p className="text-sm font-medium">
									{site.stage || "-"}
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Outreach Status
								</p>
								<p className="text-sm font-medium">
									{site.outreachStatus || "uncontacted"}
								</p>
							</div>
						</div>
					</div>

					{/* Additional Details */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-muted-foreground">
							Additional Details
						</h3>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-xs text-muted-foreground">
									Last Contacted
								</p>
								<p className="font-medium">
									{site.lastContactedAt
										? new Date(
												site.lastContactedAt,
											).toLocaleDateString()
										: "Never"}
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Created
								</p>
								<p className="font-medium">
									{site.createdAt
										? new Date(
												site.createdAt,
											).toLocaleDateString()
										: "-"}
								</p>
							</div>
						</div>
					</div>

					{/* Notes Section */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-muted-foreground">
								Notes
							</h3>
							{!isEditingNotes ? (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsEditingNotes(true)}
								>
									<Edit2 className="h-4 w-4 mr-1" />
									Edit
								</Button>
							) : (
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setNotes(site.notes || "");
											setIsEditingNotes(false);
										}}
										disabled={savingNotes}
									>
										<X className="h-4 w-4 mr-1" />
										Cancel
									</Button>
									<Button
										variant="default"
										size="sm"
										onClick={saveNotes}
										disabled={savingNotes}
									>
										{savingNotes ? (
											<Loader2 className="h-4 w-4 mr-1 animate-spin" />
										) : (
											<Save className="h-4 w-4 mr-1" />
										)}
										Save
									</Button>
								</div>
							)}
						</div>
						{isEditingNotes ? (
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Add notes about this site..."
								rows={6}
								className="w-full"
							/>
						) : (
							<div className="rounded-lg border p-4 bg-muted/50 min-h-[100px]">
								{notes ? (
									<p className="text-sm whitespace-pre-wrap">
										{notes}
									</p>
								) : (
									<p className="text-sm text-muted-foreground italic">
										No notes yet. Click Edit to add notes.
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
