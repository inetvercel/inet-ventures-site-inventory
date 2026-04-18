"use client";

import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import {
	DownloadIcon,
	InfoIcon,
	Loader2,
	PlusIcon,
	SearchIcon,
	UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddSiteDialog } from "./AddSiteDialog";
import { SiteInfoDialog } from "./SiteInfoDialog";

interface SiteInventory {
	id: string;
	domain: string;
	title?: string | null;
	company?: string | null;
	contactName?: string | null;
	email?: string | null;
	price?: number | null;
	currency: string;
	ahrefsDR?: number | null;
	mozDA?: number | null;
	country?: string | null;
	stage?: string | null;
	niche?: string | null;
	timesUsed: number;
}

export function SiteInventoryList() {
	const [sites, setSites] = useState<SiteInventory[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [minDR, setMinDR] = useState("");
	const [maxDR, setMaxDR] = useState("");
	const [minDA, setMinDA] = useState("");
	const [maxDA, setMaxDA] = useState("");
	const [selectedNiche, setSelectedNiche] = useState("");
	const [selectedCountry, setSelectedCountry] = useState("");
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [checkingLocations, setCheckingLocations] = useState(false);
	const [selectedSite, setSelectedSite] = useState<SiteInventory | null>(
		null,
	);
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);

	useEffect(() => {
		fetchSites();
	}, []);

	const fetchSites = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (searchTerm) params.append("search", searchTerm);
			if (minDR) params.append("minDR", minDR);
			if (maxDR) params.append("maxDR", maxDR);
			if (minDA) params.append("minDA", minDA);
			if (maxDA) params.append("maxDA", maxDA);
			if (selectedNiche) params.append("niche", selectedNiche);
			if (selectedCountry) params.append("country", selectedCountry);

			const response = await fetch(
				`/api/admin/site-inventory?${params.toString()}`,
			);
			if (!response.ok) throw new Error("Failed to fetch sites");

			const data = await response.json();
			setSites(data.sites || []);
		} catch (error) {
			console.error("Error fetching sites:", error);
			toast.error("Failed to load site inventory");
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		fetchSites();
	};

	const handleClearFilters = () => {
		setSearchTerm("");
		setMinDR("");
		setMaxDR("");
		setMinDA("");
		setMaxDA("");
		setSelectedNiche("");
		setSelectedCountry("");
	};

	const handleCheckLocations = async () => {
		try {
			setCheckingLocations(true);
			const response = await fetch("/api/admin/check-locations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ limit: 10 }),
			});

			if (!response.ok) throw new Error("Failed to check locations");

			const data = await response.json();
			toast.success(
				`Updated ${data.processed} sites. ${data.remaining} remaining.`,
			);

			// Refresh the list
			fetchSites();
		} catch (error) {
			console.error("Error checking locations:", error);
			toast.error("Failed to check locations");
		} finally {
			setCheckingLocations(false);
		}
	};

	const handleExportCSV = async () => {
		try {
			const response = await fetch("/api/admin/site-inventory/export");
			if (!response.ok) throw new Error("Failed to export");

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `site-inventory-${new Date().toISOString().split("T")[0]}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			toast.success("Site inventory exported successfully");
		} catch (error) {
			console.error("Error exporting:", error);
			toast.error("Failed to export site inventory");
		}
	};

	const handleImportCSV = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".csv";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const formData = new FormData();
			formData.append("file", file);

			try {
				toast.loading("Importing CSV...", { id: "csv-import" });

				const response = await fetch(
					"/api/admin/site-inventory/import",
					{
						method: "POST",
						body: formData,
					},
				);

				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.details || data.error || "Failed to import",
					);
				}

				toast.success(
					`Successfully imported ${data.imported} sites (${data.skipped} skipped)`,
					{ id: "csv-import" },
				);
				fetchSites();
			} catch (error: any) {
				console.error("Error importing:", error);
				toast.error(`Failed to import CSV: ${error.message}`, {
					id: "csv-import",
				});
			}
		};
		input.click();
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Site Inventory</CardTitle>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={() => setAddDialogOpen(true)}
							>
								<PlusIcon className="mr-2 size-4" />
								Add Site
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCheckLocations}
								disabled={checkingLocations}
							>
								{checkingLocations ? (
									<Loader2 className="mr-2 size-4 animate-spin" />
								) : (
									<span className="mr-2">≡ƒîì</span>
								)}
								Check Locations (10)
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleImportCSV}
							>
								<UploadIcon className="mr-2 size-4" />
								Import CSV
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleExportCSV}
							>
								<DownloadIcon className="mr-2 size-4" />
								Export CSV
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Search and Filters */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<div className="col-span-2">
								<Input
									placeholder="Search by domain, company, or email..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleSearch();
									}}
								/>
							</div>
							<div className="flex gap-2">
								<Input
									type="number"
									placeholder="Min DR"
									value={minDR}
									onChange={(e) => setMinDR(e.target.value)}
								/>
								<Input
									type="number"
									placeholder="Max DR"
									value={maxDR}
									onChange={(e) => setMaxDR(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<Input
									type="number"
									placeholder="Min DA"
									value={minDA}
									onChange={(e) => setMinDA(e.target.value)}
								/>
								<Input
									type="number"
									placeholder="Max DA"
									value={maxDA}
									onChange={(e) => setMaxDA(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex gap-2">
							<Button onClick={handleSearch} size="sm">
								<SearchIcon className="mr-2 size-4" />
								Search
							</Button>
							<Button
								variant="outline"
								onClick={handleClearFilters}
								size="sm"
							>
								Clear Filters
							</Button>
						</div>

						{/* Results Table */}
						<div className="rounded-md border">
							{loading ? (
								<div className="flex items-center justify-center p-8">
									<Loader2 className="size-8 animate-spin text-muted-foreground" />
								</div>
							) : sites.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									No sites found. Import your CSV to get
									started.
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Domain</TableHead>
											<TableHead>Country</TableHead>
											<TableHead>Company</TableHead>
											<TableHead>Email</TableHead>
											<TableHead className="text-right">
												DR
											</TableHead>
											<TableHead className="text-right">
												DA
											</TableHead>
											<TableHead className="text-right">
												Price
											</TableHead>
											<TableHead>Country</TableHead>
											<TableHead>Niche</TableHead>
											<TableHead className="text-right">
												Used
											</TableHead>
											<TableHead />
										</TableRow>
									</TableHeader>
									<TableBody>
										{sites.map((site) => (
											<TableRow key={site.id}>
												<TableCell className="font-medium">
													<Link
														href={`/dashboard/admin/websites/${site.id}`}
														className="text-primary hover:underline"
													>
														{site.domain}
													</Link>
												</TableCell>
												<TableCell>
													{site.country ? (
														<span
															className="text-2xl"
															title={site.country}
														>
															{String.fromCodePoint(
																...site.country
																	.toUpperCase()
																	.split("")
																	.map(
																		(
																			char,
																		) =>
																			127397 +
																			char.charCodeAt(
																				0,
																			),
																	),
															)}
														</span>
													) : (
														<span className="text-muted-foreground">
															-
														</span>
													)}
												</TableCell>
												<TableCell>
													{site.company || "-"}
												</TableCell>
												<TableCell className="text-sm text-muted-foreground">
													{site.email || "-"}
												</TableCell>
												<TableCell className="text-right">
													{site.ahrefsDR || "-"}
												</TableCell>
												<TableCell className="text-right">
													{site.mozDA || "-"}
												</TableCell>
												<TableCell className="text-right">
													{site.price
														? `${site.currency === "USD" ? "$" : site.currency === "EUR" ? "Γé¼" : "┬ú"}${site.price}`
														: "-"}
												</TableCell>
												<TableCell>
													{site.country || "-"}
												</TableCell>
												<TableCell>
													{site.niche || "-"}
												</TableCell>
												<TableCell className="text-right">
													{site.timesUsed}
												</TableCell>
												<TableCell>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => {
															setSelectedSite(
																site,
															);
															setInfoDialogOpen(
																true,
															);
														}}
													>
														<InfoIcon className="mr-1 h-4 w-4" />
														Full Info
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</div>

						<div className="text-sm text-muted-foreground">
							Showing {sites.length} site
							{sites.length !== 1 ? "s" : ""}
						</div>
					</div>
				</CardContent>
			</Card>

			<AddSiteDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				onSuccess={fetchSites}
			/>

			<SiteInfoDialog
				site={selectedSite}
				open={infoDialogOpen}
				onOpenChange={setInfoDialogOpen}
			/>
		</div>
	);
}
