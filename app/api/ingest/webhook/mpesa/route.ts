import { NextRequest, NextResponse } from 'next/server';
import { getTenantIdFromRequest } from '@/lib/tenant';

export async function POST(req: NextRequest) {
	const tenantId = getTenantIdFromRequest(req);
	const idempotencyKey = req.headers.get('x-idempotency-key') || '';
	// TODO: verify HMAC signature from provider
	const payload = await req.json().catch(() => ({}));

	// TODO: enqueue to Redis/BullMQ and persist WebhookLog in Postgres

	return NextResponse.json({ ok: true, tenantId, idempotencyKey }, { status: 202 });
} 