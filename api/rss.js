// ============================================
// Vercel Serverless Function: /api/rss
// Fetches RSS feeds from major Indian news sources
// No API key required — uses public RSS feeds
// Sources: TOI, NDTV, India Today, The Hindu,
//          Hindustan Times, BBC India, Gadgets360
// ============================================

// Category → list of RSS feeds to fetch
const RSS_FEEDS = {
  all: [
    { url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",       source: "Times of India" },
    { url: "https://feeds.feedburner.com/ndtvnews-top-stories",                source: "NDTV" },
    { url: "https://www.indiatoday.in/rss/home",                               source: "India Today" },
    { url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",  source: "Hindustan Times" },
    { url: "https://www.thehindu.com/news/feeder/default.rss",                 source: "The Hindu" },
    { url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",           source: "BBC India" },
  ],
  politics: [
    { url: "https://feeds.feedburner.com/ndtvnews-india-news",                 source: "NDTV" },
    { url: "https://www.thehindu.com/news/national/feeder/default.rss",        source: "The Hindu" },
    { url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",  source: "Hindustan Times" },
    { url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",       source: "Times of India" },
    { url: "https://www.indiatoday.in/rss/home",                               source: "India Today" },
  ],
  technology: [
    { url: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms",        source: "Times of India" },
    { url: "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",  source: "The Hindu" },
    { url: "https://feeds.feedburner.com/gadgets360-latest",                   source: "Gadgets 360" },
    { url: "https://feeds.feedburner.com/ndtvnews-sci-tech",                   source: "NDTV" },
  ],
  business: [
    { url: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",         source: "Times of India" },
    { url: "https://feeds.feedburner.com/ndtvprofit-latest",                   source: "NDTV Profit" },
    { url: "https://www.thehindu.com/business/feeder/default.rss",             source: "The Hindu" },
    { url: "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml",    source: "Hindustan Times" },
  ],
  science: [
    { url: "https://www.thehindu.com/sci-tech/science/feeder/default.rss",     source: "The Hindu" },
    { url: "https://feeds.feedburner.com/ndtvnews-sci-tech",                   source: "NDTV" },
    { url: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms",        source: "Times of India" },
  ],
  health: [
    { url: "https://feeds.feedburner.com/ndtvnews-health",                     source: "NDTV" },
    { url: "https://www.thehindu.com/sci-tech/health/feeder/default.rss",      source: "The Hindu" },
    { url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",       source: "Times of India" },
  ],
  sports: [
    { url: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",         source: "Times of India" },
    { url: "https://feeds.feedburner.com/ndtvnews-sports",                     source: "NDTV" },
    { url: "https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml",      source: "Hindustan Times" },
    { url: "https://www.thehindu.com/sport/feeder/default.rss",                source: "The Hindu" },
  ],
  entertainment: [
    { url: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",      source: "Times of India" },
    { url: "https://feeds.feedburner.com/ndtvnews-entertainment",              source: "NDTV" },
    { url: "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml", source: "Hindustan Times" },
  ],
  world: [
    { url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",           source: "BBC India" },
    { url: "https://feeds.feedburner.com/ndtvnews-world-news",                 source: "NDTV" },
    { url: "https://www.thehindu.com/news/international/feeder/default.rss",   source: "The Hindu" },
    { url: "https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml",  source: "Hindustan Times" },
  ],
};

// Fallback placeholder images per category (when article has no image)
const PLACEHOLDER_IMAGES = {
  politics:      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80",
  technology:    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  business:      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
  science:       "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&q=80",
  health:        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
  sports:        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  entertainment: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
  world:         "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=600&q=80",
  all:           "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET")    return res.status(405).json({ error: "Method not allowed" });

  const { category = "all" } = req.query;
  const feeds       = RSS_FEEDS[category] || RSS_FEEDS.all;
  const placeholder = PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.all;

  // Fetch all feeds in parallel (each times out after 8 s)
  const results = await Promise.allSettled(
    feeds.map(feed => fetchFeed(feed.url, feed.source, placeholder))
  );

  // Flatten successful results
  const allArticles = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);

  // Deduplicate by normalised title prefix (first 70 chars)
  const seen   = new Set();
  const deduped = allArticles.filter(a => {
    const key = a.title.slice(0, 70).toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort newest → oldest
  deduped.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return res.status(200).json({
    status:   "ok",
    articles: deduped.slice(0, 100),
    total:    deduped.length,
    source:   "rss"
  });
}

// -----------------------------------------------
// Fetch a single RSS feed URL
// -----------------------------------------------
async function fetchFeed(url, sourceName, placeholder) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsBriefAI/1.0)",
        "Accept":     "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, sourceName, placeholder);
  } catch {
    return [];
  }
}

// -----------------------------------------------
// Parse RSS 2.0 / Atom XML → article array
// -----------------------------------------------
function parseRSS(xml, sourceName, placeholder) {
  const items = [];
  const itemRx = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRx.exec(xml)) !== null) {
    const block = match[1];

    const title   = extractCDATA(block, "title");
    const link    = extractLink(block);
    const desc    = stripHtml(extractCDATA(block, "description") || "");
    const rawDate = extractCDATA(block, "pubDate")
                 || extractCDATA(block, "dc:date")
                 || extractCDATA(block, "published")
                 || extractCDATA(block, "updated")
                 || extractText(block,  "pubDate")
                 || extractText(block,  "dc:date");
    const image   = extractImage(block) || placeholder;

    if (!title || title === "[Removed]" || !link) continue;

    let publishedAt;
    try { publishedAt = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString(); }
    catch { publishedAt = new Date().toISOString(); }

    items.push({
      title:       decodeEntities(title).trim(),
      url:         link.trim(),
      description: desc.slice(0, 600).trim() || title,
      publishedAt,
      urlToImage:  image,
      source:      { name: sourceName },
      content:     desc.trim() || null,
    });
  }

  return items;
}

// -----------------------------------------------
// XML helper utilities
// -----------------------------------------------

/** Extract text from a tag, unwrapping CDATA if present */
function extractCDATA(xml, tag) {
  // <tag><![CDATA[...]]></tag>
  const cdRx = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, "i"
  );
  const cdm = xml.match(cdRx);
  if (cdm) return cdm[1].trim();

  // <tag>plain text</tag>
  const plRx = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const plm  = xml.match(plRx);
  if (plm) return decodeEntities(plm[1].trim());

  return "";
}

/** Extract plain text (no CDATA) from a tag */
function extractText(xml, tag) {
  const rx = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i");
  const m  = xml.match(rx);
  return m ? m[1].trim() : "";
}

/** Robustly extract the article URL from an <item> */
function extractLink(item) {
  // CDATA link
  const cdata = item.match(/<link[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/link>/i);
  if (cdata) return cdata[1].trim();

  // Plain <link>url</link>
  const plain = item.match(/<link[^>]*>([^<]+)<\/link>/i);
  if (plain) return plain[1].trim();

  // Atom <link href="..." />
  const href = item.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (href) return href[1].trim();

  // <guid isPermaLink="true">url</guid>
  const guidPerma = item.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>\s*([^<]+)\s*<\/guid>/i);
  if (guidPerma) return guidPerma[1].trim();

  // <guid>url</guid> if it looks like a URL
  const guidAny = item.match(/<guid[^>]*>\s*([^<]+)\s*<\/guid>/i);
  if (guidAny && guidAny[1].trim().startsWith("http")) return guidAny[1].trim();

  return "";
}

/** Try multiple image tag patterns in priority order */
function extractImage(item) {
  // <media:content url="..." />
  const mc = item.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mc) return mc[1];

  // <media:thumbnail url="..." />
  const mt = item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (mt) return mt[1];

  // <enclosure url="..." type="image/..."/>  (either attribute order)
  const enc1 = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\/[^"']*["']/i);
  if (enc1) return enc1[1];
  const enc2 = item.match(/<enclosure[^>]+type=["']image\/[^"']*["'][^>]+url=["']([^"']+)["']/i);
  if (enc2) return enc2[1];

  // <img src="..."> inside description HTML
  const img = item.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (img) return img[1];

  return null;
}

/** Strip all HTML tags and CDATA wrappers from a string */
function stripHtml(html) {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Decode common HTML entities */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
