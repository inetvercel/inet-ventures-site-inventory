import { auth } from "@repo/auth";
import { db } from "@repo/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await request.json();

		const site = await db.siteInventory.create({
			data: {
				domain: body.domain,
				contactName: body.contactName || null,
				email: body.email || null,
				price: body.price || null,
				ahrefsDR: body.ahrefsDR || null,
				mozDA: body.mozDA || null,
				niche: body.niche || null,
				company: body.company || null,
				notes: body.notes || null,
				additionalEmails: body.additionalEmails || null,
				contactNames: body.contactNames || null,
				acceptsIGaming: body.acceptsIGaming || false,
				stage: "New",
				outreachStatus: "uncontacted",
			},
		});

		return NextResponse.json(site);
	} catch (error) {
		console.error("Error creating site:", error);
		return NextResponse.json(
			{ error: "Failed to create site" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: Request) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { id, ...data } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Site ID required" },
				{ status: 400 },
			);
		}

		const site = await db.siteInventory.update({
			where: { id },
			data: {
				domain: data.domain,
				contactName: data.contactName || null,
				email: data.email || null,
				price: data.price || null,
				ahrefsDR: data.ahrefsDR || null,
				mozDA: data.mozDA || null,
				niche: data.niche || null,
				company: data.company || null,
			},
		});

		return NextResponse.json(site);
	} catch (error) {
		console.error("Error updating site:", error);
		return NextResponse.json(
			{ error: "Failed to update site" },
			{ status: 500 },
		);
	}
}
