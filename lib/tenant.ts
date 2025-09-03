import type { NextRequest } from 'next/server';

export function getTenantIdFromRequest(req: NextRequest): string {
	const headerTenant = req.headers.get('x-tenant-id');
	if (headerTenant) return headerTenant;
	return 'public';
} 