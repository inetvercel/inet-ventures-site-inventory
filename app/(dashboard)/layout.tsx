import { Database, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-gray-200">
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center h-16 px-6 border-b border-gray-200">
						<Database className="h-6 w-6 text-blue-600" />
						<span className="ml-2 text-xl font-bold">Site Inventory</span>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-2">
						<Link
							href="/"
							className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
						>
							<Database className="h-5 w-5 mr-3" />
							Inventory
						</Link>
					</nav>

					{/* User section */}
					<div className="p-4 border-t border-gray-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
									A
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-gray-900">Admin</p>
									<p className="text-xs text-gray-500">Staff</p>
								</div>
							</div>
							<button className="text-gray-400 hover:text-gray-600">
								<LogOut className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1 overflow-auto">
				<div className="container mx-auto px-6 py-8">{children}</div>
			</main>
		</div>
	);
}
