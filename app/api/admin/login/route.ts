import { NextRequest, NextResponse } from "next/server";
import { signAdminJWT } from '@/lib/jwtAuth';
import bcrypt from 'bcryptjs';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || '$2a$12$changemechangemechangemechangemechangemechangemechangemechangeme';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (username !== ADMIN_USER) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const ok = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = signAdminJWT({ username });
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_jwt', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  return res;
}
