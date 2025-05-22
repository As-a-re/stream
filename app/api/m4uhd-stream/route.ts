import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ streamUrl: null });
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    const $ = cheerio.load(html);
    // Try to find the iframe with the video player
    const iframeSrc = $("iframe").first().attr("src");
    if (iframeSrc) {
      // If the src is relative, make it absolute
      const streamUrl = iframeSrc.startsWith("http") ? iframeSrc : `https:${iframeSrc}`;
      return NextResponse.json({ streamUrl });
    }
    return NextResponse.json({ streamUrl: null });
  } catch (e) {
    return NextResponse.json({ streamUrl: null });
  }
}
