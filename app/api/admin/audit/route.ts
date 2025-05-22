import { NextRequest, NextResponse } from "next/server";
import { readAuditLog } from '@/lib/auditLogger';
import { verifyAdminJWT } from '@/lib/jwtAuth';

function getAdminFromJWT(req: NextRequest): string | null {
  const cookie = req.cookies.get('admin_jwt')?.value;
  if (!cookie) return null;
  const payload = verifyAdminJWT(cookie);
  return payload && typeof payload === 'object' && 'username' in payload ? payload.username as string : null;
}

export async function GET(req: NextRequest) {
  const admin = getAdminFromJWT(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const logs = readAuditLog();
  return NextResponse.json({ logs });
}
