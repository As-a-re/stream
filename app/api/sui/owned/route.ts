import { NextRequest, NextResponse } from "next/server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

// Replace with your contract details
const PACKAGE_ID = "0xYOUR_CONTRACT_PACKAGE_ID";
const MODULE_NAME = "content"; // suistream::content
const LIBRARY_STRUCT = "UserLibrary";
const GET_OWNED_FN = "get_owned_content";
const OWNERSHIP_FUNCTION = "owns_content";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { wallet, movieId } = body;

  try {
    if (wallet && !movieId) {
      // Return all owned content for the wallet
      // You need to know the ID of the UserLibrary object for this wallet
      // For demo, assume it's stored off-chain or deterministically derived
      const userLibraryId = await getUserLibraryId(wallet); // Implement this lookup!
      const result = await suiClient.call("suix_callMoveFunction", [
        {
          packageObjectId: PACKAGE_ID,
          module: MODULE_NAME,
          function: GET_OWNED_FN,
          typeArguments: [],
          arguments: [userLibraryId],
        },
      ]);
      return NextResponse.json({ owned: result });
    } else if (wallet && movieId) {
      // Check ownership of a specific movie
      const result = await suiClient.call("suix_callMoveFunction", [
        {
          packageObjectId: PACKAGE_ID,
          module: MODULE_NAME,
          function: OWNERSHIP_FUNCTION,
          typeArguments: [],
          arguments: [wallet, movieId],
        },
      ]);
      return NextResponse.json({ owned: result });
    } else {
      return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ owned: false, error: e.message });
  }
}

import { getUserLibraryId } from '@/lib/objectRegistry';
