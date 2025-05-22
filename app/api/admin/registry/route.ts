import { NextRequest, NextResponse } from "next/server";
import { setUserObjectIds, setReviewsId } from '@/lib/objectRegistry';
import { logAudit } from '@/lib/auditLogger';
import { verifyAdminJWT } from '@/lib/jwtAuth';
import { SuiClient, getFullnodeUrl, SuiTransactionBlock } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js';
import fs from 'fs';
import path from 'path';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID || "0xYOUR_CONTRACT_PACKAGE_ID";
const MODULE_NAME = "content";
const ADMIN_KEYPAIR_PATH = path.resolve(process.cwd(), 'admin.key.json');
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const adminKeypair = Ed25519Keypair.fromExportedKeypair(JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8')));

// Simple admin secret for endpoint protection
const ADMIN_SECRET = process.env.ADMIN_SECRET || "changeme";

function getAdminFromJWT(req: NextRequest): string | null {
  const cookie = req.cookies.get('admin_jwt')?.value;
  if (!cookie) return null;
  const payload = verifyAdminJWT(cookie);
  return payload && typeof payload === 'object' && 'username' in payload ? payload.username as string : null;
}

export async function GET(req: NextRequest) {
  const admin = getAdminFromJWT(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const registry = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'object_registry.json'), 'utf-8'));
  return NextResponse.json(registry);
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromJWT(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { wallet } = await req.json();
  if (!wallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });
  // Create UserLibrary
  let tx = new SuiTransactionBlock();
  tx.moveCall({ target: `${PACKAGE_ID}::${MODULE_NAME}::create_user_library`, arguments: [] });
  let result = await suiClient.signAndExecuteTransactionBlock({ signer: adminKeypair, transactionBlock: tx });
  const libraryId = result.objectChanges?.find(obj => obj.objectType?.includes('UserLibrary'))?.objectId;
  if (!libraryId) return NextResponse.json({ error: 'Failed to create UserLibrary' }, { status: 500 });
  // Create Watchlist
  tx = new SuiTransactionBlock();
  tx.moveCall({ target: `${PACKAGE_ID}::${MODULE_NAME}::create_watchlist`, arguments: [] });
  result = await suiClient.signAndExecuteTransactionBlock({ signer: adminKeypair, transactionBlock: tx });
  const watchlistId = result.objectChanges?.find(obj => obj.objectType?.includes('Watchlist'))?.objectId;
  if (!watchlistId) return NextResponse.json({ error: 'Failed to create Watchlist' }, { status: 500 });
  setUserObjectIds(wallet, libraryId, watchlistId);
  logAudit('add_user', admin, { wallet, libraryId, watchlistId });
  return NextResponse.json({ wallet, libraryId, watchlistId });
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminFromJWT(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { wallet } = await req.json();
  if (!wallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });
  const registryPath = path.resolve(process.cwd(), 'object_registry.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  if (registry.users && registry.users[wallet]) {
    delete registry.users[wallet];
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    logAudit('remove_user', admin, { wallet });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromJWT(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { wallet, libraryId, watchlistId } = await req.json();
  if (!wallet || !libraryId || !watchlistId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const registryPath = path.resolve(process.cwd(), 'object_registry.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  registry.users = registry.users || {};
  registry.users[wallet] = { library: libraryId, watchlist: watchlistId };
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  logAudit('update_user', admin, { wallet, libraryId, watchlistId });
  return NextResponse.json({ success: true });
}

