// ============================================
// Vercel Serverless Function: /api/news
// Fetches top headlines from NewsAPI
// Your API key stays SECRET on the server
// ============================================

// Map frontend category names → NewsAPI categories
const CATEGORY_MAP = {
  all:           "",
  technology:    "technology",
  business:      "business",
  science:       "science",
  health:        "health",
  sports:        "sports",
  entertainment: "entertainment",
  world:         "general"
};

export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Read the key from Vercel Environment Variables (never exposed to users)
  const newsApiKey = process.env.NEWS_API_KEY;

  if (!newsApiKey) {
    return res.status(500).json({
      error: "NEWS_API_KEY is not set. Please add it in your Vercel project settings."
    });
  }

  // Get category from query string: /api/news?category=technology
  const { category = "all" } = req.query;

  let url;
  const params = new URLSearchParams({
    pageSize: "12",
    apiKey:   newsApiKey
  });

  if (category === "politics") {
    // NewsAPI top-headlines doesn't have a "politics" category.
    // We use the /everything endpoint to search for Indian/Tamil Nadu politics.
    url = "https://newsapi.org/v2/everything";
    params.set("q", "(politics OR government OR election OR minister OR DMK OR BJP OR Congress OR Stalin) AND (India OR \"Tamil Nadu\" OR Tamilnadu)");
    params.set("language", "en");
    params.set("sortBy", "publishedAt");
  } else {
    url = "https://newsapi.org/v2/top-headlines";
    params.set("country", "in"); // Focus on India top headlines
    const newsCategory = CATEGORY_MAP[category] ?? "";
    if (newsCategory) {
      params.set("category", newsCategory);
    }
  }

  try {
    const response = await fetch(
      `${url}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "NewsAPI returned an error");
    }

    // Return the articles to the frontend
    return res.status(200).json({
      status:   "ok",
      articles: data.articles,
      total:    data.totalResults
    });

  } catch (error) {
    console.error("[/api/news] Error:", error.message);
    return res.status(500).json({
      error:   "Failed to fetch news",
      details: error.message
    });
  }
}
