// ============================================
// Vercel Serverless Function: /api/news
// Fetches top headlines from NewsAPI
// Your API key stays SECRET on the server
// ============================================

// Map frontend category names → NewsAPI categories
const CATEGORY_MAP = {
  all:           "",
  politics:      "general",
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
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");

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

  // Custom search queries to get rich news focusing on India and Tamil Nadu for each category
  const SEARCH_QUERIES = {
    all:           "(India OR \"Tamil Nadu\" OR Tamilnadu OR Chennai OR Stalin OR Modi)",
    politics:      "(politics OR government OR election OR minister OR DMK OR BJP OR Congress OR Stalin) AND (India OR \"Tamil Nadu\" OR Tamilnadu)",
    technology:    "(technology OR tech OR software OR gadget OR startup OR mobile) AND (India OR \"Tamil Nadu\" OR Chennai)",
    business:      "(business OR finance OR economy OR stock OR market OR startup) AND (India OR \"Tamil Nadu\" OR Chennai)",
    science:       "(science OR space OR research OR discovery OR physics) AND (India OR \"Tamil Nadu\" OR Chennai)",
    health:        "(health OR medicine OR hospital OR disease OR drug OR covid) AND (India OR \"Tamil Nadu\" OR Chennai)",
    sports:        "(sports OR cricket OR football OR tennis OR match OR league) AND (India OR \"Tamil Nadu\" OR Chennai)",
    entertainment: "(entertainment OR movie OR cinema OR music OR celebrity OR actor OR kollywood) AND (India OR \"Tamil Nadu\" OR Chennai)",
    world:         "(world OR global OR international) AND (India OR \"Tamil Nadu\" OR Chennai)"
  };

  const url = "https://newsapi.org/v2/everything";
  const params = new URLSearchParams({
    q:        SEARCH_QUERIES[category] || SEARCH_QUERIES.all,
    language: "en",
    sortBy:   "publishedAt",
    pageSize: "25",
    apiKey:   newsApiKey
  });

  try {
    const response = await fetch(
      `${url}?${params.toString()}`,
      {
        headers: {
          "User-Agent": "NewsBriefAI/1.0"
        }
      }
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
