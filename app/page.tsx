import { SiteInventoryList } from "@/components/SiteInventoryList";

export default function HomePage() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Site Inventory</h1>
				<p className="text-muted-foreground mt-2">
					Manage and track your website inventory
				</p>
			</div>
			<SiteInventoryList />
		</div>
	);
}
