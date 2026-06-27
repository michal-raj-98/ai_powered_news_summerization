// ============================================
// Vercel Serverless Function: /api/search
// Searches news articles using NewsAPI
// /api/search?q=bitcoin
// ============================================

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET")     return res.status(405).json({ error: "Method not allowed" });

  const newsApiKey = process.env.NEWS_API_KEY;
  if (!newsApiKey) {
    return res.status(500).json({ error: "NEWS_API_KEY is not set on the server." });
  }

  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Search query 'q' is required." });
  }

  try {
    const params = new URLSearchParams({
      q:        q.trim(),
      language: "en",
      sortBy:   "publishedAt",
      pageSize: "12",
      apiKey:   newsApiKey
    });

    const response = await fetch(
      `https://newsapi.org/v2/everything?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "NewsAPI returned an error");
    }

    return res.status(200).json({
      status:   "ok",
      articles: data.articles,
      total:    data.totalResults
    });

  } catch (error) {
    console.error("[/api/search] Error:", error.message);
    return res.status(500).json({
      error:   "Search failed",
      details: error.message
    });
  }
}
