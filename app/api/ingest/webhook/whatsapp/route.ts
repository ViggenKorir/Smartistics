import { NextRequest, NextResponse } from 'next/server';
import { getTenantIdFromRequest } from '@/lib/tenant';

export async function POST(req: NextRequest) {
	const tenantId = getTenantIdFromRequest(req);
	const idempotencyKey = req.headers.get('x-idempotency-key') || '';
	// TODO: verify WhatsApp Business API signature
	const payload = await req.json().catch(() => ({}));

	// TODO: enqueue to Redis/BullMQ for ETL processing
	// TODO: persist WebhookLog to Postgres

	return NextResponse.json({ ok: true, tenantId, idempotencyKey }, { status: 202 });
} 