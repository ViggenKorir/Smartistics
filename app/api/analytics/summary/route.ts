import { NextRequest, NextResponse } from 'next/server';
import { getTenantIdFromRequest } from '@/lib/tenant';

export async function GET(req: NextRequest) {
	const tenantId = getTenantIdFromRequest(req);

	// Placeholder: in real impl, query ClickHouse/Postgres. Here we also ping the Python service if available
	let attribution: any = null;
	try {
		const resp = await fetch(process.env.ATTRIBUTION_URL || 'http://localhost:8001/healthz', { cache: 'no-store' });
		attribution = await resp.json();
	} catch (e) {
		attribution = { status: 'unavailable' };
	}

	return NextResponse.json({
		tenantId,
		kpis: {
			spend: 7240,
			currency: 'KES',
			roi: 2.3,
			clicks: 1823,
			conversions: 117,
		},
		attribution,
	});
} 