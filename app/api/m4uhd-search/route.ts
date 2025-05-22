import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  if (!query) return NextResponse.json({ results: [] });

  const url = `https://m4uhd.onl/search/${encodeURIComponent(query)}.html`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results: any[] = [];
    $(".search-page .search-list .search-movie-item").each((_, el) => {
      const title = $(el).find(".search-movie-title a").text().trim();
      const url = $(el).find(".search-movie-title a").attr("href");
      if (title && url) {
        results.push({ title, url: `https://m4uhd.onl${url}` });
      }
    });
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [] });
  }
}
