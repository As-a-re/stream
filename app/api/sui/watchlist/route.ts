import { NextRequest, NextResponse } from "next/server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

const PACKAGE_ID = "0xYOUR_CONTRACT_PACKAGE_ID";
const MODULE_NAME = "content";
const WATCHLIST_STRUCT = "Watchlist";
const ADD_FN = "add_to_watchlist";
const REMOVE_FN = "remove_from_watchlist";
const GET_FN = "get_watchlist";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

import { getUserWatchlistId } from '@/lib/objectRegistry';

async function getWatchlistId(wallet: string): Promise<string> {
  return getUserWatchlistId(wallet);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
  const watchlistId = await getWatchlistId(wallet);
  try {
    const result = await suiClient.call("suix_callMoveFunction", [
      {
        packageObjectId: PACKAGE_ID,
        module: MODULE_NAME,
        function: GET_FN,
        typeArguments: [],
        arguments: [watchlistId],
      },
    ]);
    return NextResponse.json({ watchlist: result });
  } catch (e: any) {
    return NextResponse.json({ watchlist: [], error: e.message });
  }
}

export async function POST(req: NextRequest) {
  const { wallet, action, content_id } = await req.json();
  if (!wallet || !action || !content_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const watchlistId = await getWatchlistId(wallet);
  try {
    const fn = action === "add" ? ADD_FN : REMOVE_FN;
    // This should be a transaction, signed by the user
    // For demo, just return the tx block
    return NextResponse.json({ success: true, tx: { fn, watchlistId, content_id } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
