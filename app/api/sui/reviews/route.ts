import { NextRequest, NextResponse } from "next/server";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

const PACKAGE_ID = "0xYOUR_CONTRACT_PACKAGE_ID";
const MODULE_NAME = "content";
const REVIEWS_STRUCT = "Reviews";
const ADD_FN = "add_review";
const GET_FN = "get_reviews";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

import { getReviewsId } from '@/lib/objectRegistry';

async function getReviewsId(): Promise<string> {
  return getReviewsId();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const content_id = searchParams.get("content_id");
  if (!content_id) return NextResponse.json({ error: "Missing content_id" }, { status: 400 });
  const reviewsId = await getReviewsId();
  try {
    const result = await suiClient.call("suix_callMoveFunction", [
      {
        packageObjectId: PACKAGE_ID,
        module: MODULE_NAME,
        function: GET_FN,
        typeArguments: [],
        arguments: [reviewsId, content_id],
      },
    ]);
    return NextResponse.json({ reviews: result });
  } catch (e: any) {
    return NextResponse.json({ reviews: [], error: e.message });
  }
}

export async function POST(req: NextRequest) {
  const { wallet, content_id, text } = await req.json();
  if (!wallet || !content_id || !text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const reviewsId = await getReviewsId();
  try {
    // This should be a transaction, signed by the user
    // For demo, just return the tx block
    return NextResponse.json({ success: true, tx: { fn: ADD_FN, reviewsId, content_id, wallet, text } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
