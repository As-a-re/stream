import { NextRequest, NextResponse } from "next/server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

// Replace with your deployed contract details
const PACKAGE_ID = "0xYOUR_CONTRACT_PACKAGE_ID";
const MODULE_NAME = "movie_marketplace";
const BUY_FUNCTION = "buy_movie";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function POST(req: NextRequest) {
  const { movieId, wallet } = await req.json();

  try {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${BUY_FUNCTION}`,
      arguments: [
        txb.pure(movieId),
        txb.pure(wallet)
      ],
      typeArguments: [],
    });

    // Return the serialized transaction block for the frontend to sign
    return NextResponse.json({ success: true, txb: txb.serialize() });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
