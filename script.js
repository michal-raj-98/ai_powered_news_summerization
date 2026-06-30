/* ============================================
   NewsBrief AI — Frontend JavaScript
   Calls backend API functions (no API keys
   needed on the client — they live on Vercel)
   ============================================ */

// ============================================
// FALLBACK MOCK DATA
// Shown when running locally without Vercel dev
// ============================================
const MOCK_NEWS = [
  {
    id: "m1", category: "technology",
    title: "Google Unveils Next-Generation Gemini AI with Unprecedented Reasoning",
    source: "TechCrunch", date: "2 hours ago", readTime: "4 min read", url: "#",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    description: "Google has officially unveiled its next-generation Gemini AI model, claiming it surpasses all existing benchmarks in reasoning, coding, and multimodal understanding. The new model can process text, images, audio, and video simultaneously, opening doors to entirely new categories of AI applications.",
    aiSummary: "Google launched a major upgrade to its Gemini AI, boasting superior performance across reasoning and coding tasks. The model supports text, images, audio, and video at once. Developers can access it through the Gemini API starting today.",
    aiSummaryGenerated: true
  },
  {
    id: "m2", category: "business",
    title: "Global Stock Markets Surge as Inflation Data Shows Significant Cooling",
    source: "Financial Times", date: "4 hours ago", readTime: "3 min read", url: "#",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    description: "World stock markets rallied sharply today after new inflation data showed consumer prices grew at a slower-than-expected pace. Investors reacted positively, pushing major indices to multi-month highs.",
    aiSummary: "Stock markets jumped globally after inflation cooled more than expected. The S&P 500 rose 2.3% and European markets hit multi-month highs. Central banks are now expected to consider rate cuts earlier than previously planned.",
    aiSummaryGenerated: true
  },
  {
    id: "m3", category: "science",
    title: "Scientists Discover Earth-Like Exoplanet With Potential Signs of Liquid Water",
    source: "Nature Journal", date: "6 hours ago", readTime: "5 min read", url: "#",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&q=80",
    description: "Astronomers using the James Webb Space Telescope have identified a potentially habitable exoplanet 40 light-years away showing spectroscopic signatures consistent with liquid water on its surface.",
    aiSummary: "The James Webb Telescope found signs of liquid water on K2-18b, 40 light-years away. This makes it the strongest candidate for extraterrestrial life discovered to date. Scientists plan follow-up observations to confirm the findings.",
    aiSummaryGenerated: true
  },
  {
    id: "m4", category: "health",
    title: "Breakthrough Alzheimer's Drug Shows 40% Slowdown in Cognitive Decline",
    source: "Medical News Today", date: "8 hours ago", readTime: "4 min read", url: "#",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
    description: "A new experimental Alzheimer's drug demonstrated a 40% reduction in cognitive decline in a large Phase 3 clinical trial at Johns Hopkins University.",
    aiSummary: "A new Alzheimer's drug slowed cognitive decline by 40% in a major clinical trial. Researchers called it the biggest breakthrough in decades. The drug targets amyloid plaques and is expected to seek FDA approval by 2026.",
    aiSummaryGenerated: true
  },
  {
    id: "m5", category: "sports",
    title: "India Clinches ICC World Cup Title in a Thrilling Last-Ball Victory",
    source: "ESPN", date: "10 hours ago", readTime: "3 min read", url: "#",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80",
    description: "India claimed the ICC Cricket World Cup in a nail-biting final against Australia that went down to the very last delivery of the match.",
    aiSummary: "India won the ICC Cricket World Cup by defeating Australia on the final ball. Kohli's century was the match-winning performance. Millions of fans celebrated across the country in an all-night street party.",
    aiSummaryGenerated: true
  },
  {
    id: "m6", category: "technology",
    title: "Apple Announces M4 Ultra Chip: A 400% Performance Leap Over Previous Gen",
    source: "The Verge", date: "12 hours ago", readTime: "5 min read", url: "#",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    description: "Apple's M4 Ultra chip delivers 400% improvement in AI processing tasks over the M3 generation, with 192GB unified memory for running large models on-device.",
    aiSummary: "Apple's M4 Ultra chip offers 400% faster AI performance than M3. It packs 192GB of memory and can run large AI models locally on-device. The chip is expected to appear in the next Mac Pro and MacBook Pro lineup.",
    aiSummaryGenerated: true
  },
  {
    id: "m7", category: "world",
    title: "UN Climate Summit Reaches Landmark Agreement on Carbon Emission Reductions",
    source: "Reuters", date: "14 hours ago", readTime: "4 min read", url: "#",
    image: "https://images.unsplash.com/photo-1580741569373-b8f8c06eab3b?w=600&q=80",
    description: "150 nations signed a binding deal to cut carbon emissions 65% before 2040, including a $2 trillion fund for developing nations and penalties for non-compliance.",
    aiSummary: "150 countries signed a binding climate deal to cut emissions by 65% by 2040. The agreement includes financial penalties for non-compliance and a $2 trillion fund for developing nations. Experts say it's the strongest climate commitment in history.",
    aiSummaryGenerated: true
  },
  {
    id: "m8", category: "entertainment",
    title: "Netflix's Epic Fantasy Series Sets All-Time Streaming Record with 400M Views",
    source: "Variety", date: "1 day ago", readTime: "2 min read", url: "#",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    description: "Netflix's new epic fantasy series shattered all-time streaming records with 400 million views in its first 30 days. Two spinoff series have already been greenlit.",
    aiSummary: "Netflix broke its own streaming record with its fantasy series hitting 400M views in 30 days. The show cost $200M per episode to produce. Netflix has already greenlit two spinoff series based on its massive success.",
    aiSummaryGenerated: true
  }
];

// Category color map (must match CSS)
const CATEGORY_COLORS = {
  technology:    "category-technology",
  politics:      "category-politics",
  business:      "category-business",
  science:       "category-science",
  health:        "category-health",
  sports:        "category-sports",
  entertainment: "category-entertainment",
  world:         "category-world",
  general:       "category-world",
  all:           "category-all"
};

// ============================================
// STATE
// ============================================
let currentCategory = "all";
let currentSearch   = "";
let isListView      = false;
let displayedCount  = 100;
let currentArticles = [];
const PAGE_SIZE     = 4;
let newsCache       = {};  // category → article[]
let summaryCache    = {};  // id/url → AI summary

// Is the site running on Vercel (deployed or vercel dev)?
const IS_DEPLOYED = !window.location.protocol.startsWith("file");

// ============================================
// DOM REFERENCES
// ============================================
const newsGrid       = document.getElementById("news-grid");
const categoryBtns   = document.querySelectorAll(".category-btn");
const searchInput    = document.getElementById("search-input");
const searchClear    = document.getElementById("search-clear");
const refreshBtn     = document.getElementById("refresh-btn");
const gridViewBtn    = document.getElementById("grid-view-btn");
const listViewBtn    = document.getElementById("list-view-btn");
const loadMoreBtn    = document.getElementById("load-more-btn");
const loadMoreWrap   = document.getElementById("load-more-wrapper");
const emptyState     = document.getElementById("empty-state");
const clearSearchBtn = document.getElementById("clear-search-btn");
const resultsText    = document.getElementById("results-count-text");
const modalOverlay   = document.getElementById("modal-overlay");
const modalClose     = document.getElementById("modal-close");
const articlesCount  = document.getElementById("articles-count");
const header         = document.getElementById("header");
const toast          = document.getElementById("toast");
const toastMsg       = document.getElementById("toast-message");

// ============================================
// INIT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  bindEvents();

  if (IS_DEPLOYED) {
    // Running on Vercel — call real backend API
    fetchNews("all");
  } else {
    // Running as file:// locally — show demo data + help banner
    currentArticles = MOCK_NEWS;
    renderSkeletons(8);
    setTimeout(() => {
      renderNews();
      updateLastUpdated();
      showLocalBanner();
    }, 900);
  }
});

// ============================================
// LOCAL DEV BANNER (file:// protocol)
// ============================================
function showLocalBanner() {
  if (document.getElementById("local-banner")) return;
  const banner = document.createElement("div");
  banner.id = "local-banner";
  banner.className = "demo-banner";
  banner.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>
      <strong>Demo mode</strong> — you are running the file locally.
      Deploy to Vercel to get real live news and AI summaries for everyone.
    </span>
  `;
  const section = document.getElementById("categories-section");
  section.parentNode.insertBefore(banner, section);
}

// ============================================
// FETCH NEWS from /api/news (Vercel function)
// ============================================
async function fetchNews(category) {
  // Use cache if available
  if (newsCache[category]) {
    currentArticles = newsCache[category];
    renderNews();
    return;
  }

  renderSkeletons(8);

  try {
    // ── Fetch NewsAPI + RSS feeds in parallel ──────────────────────────────
    const [newsResult, rssResult] = await Promise.allSettled([
      fetch(`/api/news?category=${encodeURIComponent(category)}`).then(r => r.json()),
      fetch(`/api/rss?category=${encodeURIComponent(category)}`).then(r => r.json())
    ]);

    // ── Extract raw article arrays (fail gracefully) ───────────────────────
    const rawNews = (newsResult.status === "fulfilled" && !newsResult.value?.error)
      ? (newsResult.value.articles || []) : [];
    const rawRSS  = (rssResult.status  === "fulfilled" && !rssResult.value?.error)
      ? (rssResult.value.articles  || []) : [];

    // ── Transform NewsAPI articles ─────────────────────────────────────────
    const fromNews = rawNews
      .filter(a => a.urlToImage && (a.description || a.content) && a.title !== "[Removed]")
      .map((a, i) => ({
        id:                 `live-${i}-${Date.now()}`,
        category:           category === "all" ? guessCategory(a) : category,
        title:              a.title,
        source:             a.source?.name || "Unknown",
        date:               formatRelativeDate(a.publishedAt),
        readTime:           estimateReadTime(a.content || a.description),
        url:                a.url,
        image:              a.urlToImage,
        description:        a.content || a.description,
        aiSummary:          a.description,
        aiSummaryGenerated: false
      }));

    // ── Transform RSS articles ─────────────────────────────────────────────
    const fromRSS = rawRSS
      .filter(a => a.title && a.title !== "[Removed]" && a.url)
      .map((a, i) => ({
        id:                 `rss-${i}-${Date.now()}`,
        category:           category === "all" ? guessCategory(a) : category,
        title:              a.title,
        source:             a.source?.name || "Unknown",
        date:               formatRelativeDate(a.publishedAt),
        readTime:           estimateReadTime(a.content || a.description),
        url:                a.url,
        image:              a.urlToImage,
        description:        a.content || a.description,
        aiSummary:          a.description || a.title,
        aiSummaryGenerated: false
      }));

    // ── Merge: NewsAPI first, then RSS; deduplicate by title ───────────────
    const seen   = new Set();
    const merged = [...fromNews, ...fromRSS].filter(a => {
      const key = a.title.slice(0, 70).toLowerCase().replace(/\s+/g, " ").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // ── Sort newest → oldest using the relative date string ────────────────
    merged.sort((a, b) => parseRelativeDate(b.date) - parseRelativeDate(a.date));

    if (merged.length === 0) throw new Error("No articles found from any source");

    const sourceCount = [rawNews.length > 0 ? "NewsAPI" : null, rawRSS.length > 0 ? "RSS feeds" : null]
      .filter(Boolean).join(" + ");

    newsCache[category] = merged;
    currentArticles     = merged;

    renderNews();
    updateLastUpdated();
    showToast(`Loaded ${merged.length} articles from ${sourceCount} ✓`);

  } catch (err) {
    console.error("[fetchNews]", err.message);
    showToast("⚠️ Could not load live news. Using demo data.");
    currentArticles = MOCK_NEWS;
    renderNews();
  }
}

// ============================================
// GEMINI AI SUMMARIZATION via /api/summarize
// ============================================
async function generateSummary(article) {
  const cacheKey = article.url || article.id;
  if (summaryCache[cacheKey]) return summaryCache[cacheKey];

  try {
    const res = await fetch("/api/summarize", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:       article.title,
        description: article.description
      })
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    const summary = data.summary;
    summaryCache[cacheKey] = summary;
    return summary;

  } catch (err) {
    console.error("[generateSummary]", err.message);
    return null;
  }
}

// ============================================
// RENDER SKELETONS (loading state)
// ============================================
function renderSkeletons(count = 8) {
  newsGrid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton-card";
    sk.style.animationDelay = `${i * 0.06}s`;
    sk.innerHTML = `
      <div class="skeleton skel-image"></div>
      <div class="skel-body">
        <div class="skeleton skel-line" style="width:50%"></div>
        <div class="skeleton skel-title"></div>
        <div class="skeleton skel-title-2"></div>
        <div class="skeleton skel-text"></div>
        <div class="skeleton skel-text-2"></div>
        <div class="skeleton skel-text-3"></div>
        <div class="skeleton skel-btn"></div>
      </div>
    `;
    newsGrid.appendChild(sk);
  }
}

// ============================================
// FILTERED DATA
// ============================================
function getFilteredData() {
  return currentArticles.filter(article => {
    const matchesCat = currentCategory === "all" || article.category === currentCategory;
    const q = currentSearch.toLowerCase();
    const matchesSearch = !q ||
      article.title.toLowerCase().includes(q) ||
      article.aiSummary.toLowerCase().includes(q) ||
      article.source.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });
}

// ============================================
// RENDER NEWS CARDS
// ============================================
function renderNews(append = false) {
  const filtered = getFilteredData();

  if (!append) {
    newsGrid.innerHTML = "";
    emptyState.classList.add("hidden");
  }

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    loadMoreWrap.classList.add("hidden");
    updateResultsBar(0);
    return;
  }

  const slice = append
    ? filtered.slice(displayedCount - PAGE_SIZE, displayedCount)
    : filtered.slice(0, displayedCount);

  slice.forEach((article, i) => {
    newsGrid.appendChild(createCard(article, i));
  });

  loadMoreWrap.classList.toggle("hidden", displayedCount >= filtered.length);
  updateResultsBar(filtered.length);
}

// ============================================
// CREATE CARD
// ============================================
function createCard(article, index) {
  const card = document.createElement("div");
  card.className = "news-card";
  card.style.animationDelay = `${index * 0.07}s`;
  card.setAttribute("role", "article");
  card.id = `card-${article.id}`;

  const colorClass    = CATEGORY_COLORS[article.category] || "category-all";
  const categoryLabel = capitalize(article.category);
  const summary       = article.aiSummary || article.description || "";
  const truncSummary  = summary.length > 160 ? summary.slice(0, 160) + "…" : summary;

  card.innerHTML = `
    <div class="card-image-wrap">
      <img
        class="card-image"
        src="${escapeHtml(article.image)}"
        alt="${escapeHtml(article.title)}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80'"
      />
      <div class="card-image-overlay"></div>
      <span class="card-category ${colorClass}">${categoryLabel}</span>
      <span class="card-read-time">${article.readTime}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-source">${escapeHtml(article.source)}</span>
        <span class="card-date">${article.date}</span>
      </div>
      <h3 class="card-title">${escapeHtml(article.title)}</h3>
      <div class="card-ai-tag">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        AI Summary
      </div>
      <p class="card-summary">${escapeHtml(truncSummary)}</p>
      <div class="card-footer">
        <button class="card-read-btn" onclick="openModal('${escapeHtml(String(article.id))}')">
          Read More
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <button class="card-share-btn" title="Share article" onclick="shareArticle(event,'${escapeHtml(String(article.id))}')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  return card;
}

// ============================================
// OPEN MODAL — lazy Gemini summarization
// ============================================
async function openModal(id) {
  const article = currentArticles.find(a => String(a.id) === String(id));
  if (!article) return;

  const colorClass    = CATEGORY_COLORS[article.category] || "category-all";
  const categoryLabel = capitalize(article.category);

  document.getElementById("modal-image").src           = article.image;
  document.getElementById("modal-image").alt           = article.title;
  document.getElementById("modal-category-badge").textContent = categoryLabel;
  document.getElementById("modal-category-badge").className   = `modal-category-badge ${colorClass}`;
  document.getElementById("modal-meta").innerHTML = `
    <span class="source">${escapeHtml(article.source)}</span>
    <span>•</span><span>${article.date}</span>
    <span>•</span><span>${article.readTime}</span>
  `;
  document.getElementById("modal-title").textContent       = article.title;
  document.getElementById("modal-description").textContent = article.description || "";
  document.getElementById("modal-read-btn").href           = article.url || "#";

  const summaryEl = document.getElementById("modal-summary-text");

  // If already AI-summarized, show immediately
  if (article.aiSummaryGenerated) {
    summaryEl.textContent = article.aiSummary;
    openModalOverlay();
    return;
  }

  // Show spinner while generating
  summaryEl.innerHTML = `
    <span class="ai-generating">
      <span class="ai-spinner"></span>
      Generating AI summary with Gemini…
    </span>
  `;
  openModalOverlay();

  // Call our /api/summarize backend function
  if (IS_DEPLOYED) {
    const summary = await generateSummary(article);
    if (summary) {
      article.aiSummary          = summary;
      article.aiSummaryGenerated = true;
      summaryEl.textContent      = summary;

      // Also update the card text
      const cardEl = document.getElementById(`card-${article.id}`);
      if (cardEl) {
        const cardSummaryEl = cardEl.querySelector(".card-summary");
        if (cardSummaryEl) {
          cardSummaryEl.textContent = summary.length > 160 ? summary.slice(0, 160) + "…" : summary;
        }
      }
    } else {
      summaryEl.textContent = article.description || "Summary not available.";
    }
  } else {
    // Demo mode: just show the description
    summaryEl.textContent = article.description || "Deploy to Vercel to see AI-generated summaries.";
  }
}

function openModalOverlay() {
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ============================================
// SHARE
// ============================================
function shareArticle(event, id) {
  event.stopPropagation();
  const article = currentArticles.find(a => String(a.id) === String(id));
  if (!article) return;
  const text = `${article.title} — Read on NewsBrief AI`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    showToast("Link copied to clipboard!");
  }
}

// ============================================
// CATEGORY FILTER
// ============================================
function setCategory(category) {
  currentCategory = category;
  displayedCount  = 100;
  categoryBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  if (IS_DEPLOYED) {
    fetchNews(category);
  } else {
    renderSkeletons(6);
    setTimeout(renderNews, 300);
  }
}

// ============================================
// SEARCH — calls /api/search for real results
// ============================================
let searchTimer;

async function handleSearch() {
  currentSearch  = searchInput.value.trim();
  displayedCount = 100;
  searchClear.classList.toggle("visible", currentSearch.length > 0);

  // If search cleared, go back to category news
  if (!currentSearch) {
    restoreCategoryNews();
    return;
  }

  if (!IS_DEPLOYED) {
    // Local / file:// mode — filter mock data
    renderSkeletons(4);
    setTimeout(renderNews, 300);
    return;
  }

  // Call real search API
  renderSkeletons(6);

  try {
    const res  = await fetch(`/api/search?q=${encodeURIComponent(currentSearch)}`);
    const data = await res.json();

    if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);

    const articles = (data.articles || [])
      .filter(a => a.urlToImage && (a.description || a.content) && a.title !== "[Removed]")
      .map((a, i) => ({
        id:                 `search-${i}-${Date.now()}`,
        category:           guessCategory(a),
        title:              a.title,
        source:             a.source?.name || "Unknown",
        date:               formatRelativeDate(a.publishedAt),
        readTime:           estimateReadTime(a.content || a.description),
        url:                a.url,
        image:              a.urlToImage,
        description:        a.content || a.description,
        aiSummary:          a.description,
        aiSummaryGenerated: false
      }));

    currentArticles = articles;
    renderNews();

    if (articles.length === 0) {
      showToast(`No results found for "${currentSearch}"`);
    } else {
      showToast(`Found ${articles.length} results for "${currentSearch}"`);
    }

  } catch (err) {
    console.error("[handleSearch]", err.message);
    showToast("⚠️ Search failed. Please try again.");
  }
}

function clearSearch() {
  searchInput.value = "";
  currentSearch     = "";
  searchClear.classList.remove("visible");
  displayedCount    = 100;
  restoreCategoryNews();
}

// Restore news for the active category after clearing search
function restoreCategoryNews() {
  if (!IS_DEPLOYED) {
    currentArticles = MOCK_NEWS;
    renderSkeletons(4);
    setTimeout(renderNews, 300);
    return;
  }
  if (newsCache[currentCategory]) {
    currentArticles = newsCache[currentCategory];
    renderNews();
  } else {
    fetchNews(currentCategory);
  }
}

// ============================================
// RESULTS BAR
// ============================================
function updateResultsBar(total) {
  const shown    = Math.min(displayedCount, total);
  const catLabel = currentCategory === "all" ? "all categories" : currentCategory;
  if (currentSearch) {
    resultsText.innerHTML = `Found <strong>${total}</strong> results for "<em>${escapeHtml(currentSearch)}</em>"`;
  } else {
    resultsText.innerHTML = `Showing <strong>${shown}</strong> of <strong>${total}</strong> in <strong>${catLabel}</strong>`;
  }
}

// ============================================
// VIEW TOGGLE
// ============================================
function setGridView() {
  isListView = false;
  newsGrid.classList.remove("list-view");
  gridViewBtn.classList.add("active");
  listViewBtn.classList.remove("active");
}

function setListView() {
  isListView = true;
  newsGrid.classList.add("list-view");
  listViewBtn.classList.add("active");
  gridViewBtn.classList.remove("active");
}

// ============================================
// LOAD MORE
// ============================================
function loadMore() {
  displayedCount += PAGE_SIZE;
  renderNews(true);
}

// ============================================
// REFRESH
// ============================================
function refreshFeed() {
  refreshBtn.classList.add("spinning");
  newsCache      = {};
  summaryCache   = {};
  displayedCount = 100;

  if (IS_DEPLOYED) {
    fetchNews(currentCategory).then(() => {
      refreshBtn.classList.remove("spinning");
      showToast("Feed refreshed with live news ✓");
    });
  } else {
    setTimeout(() => {
      currentArticles = MOCK_NEWS;
      renderNews();
      updateLastUpdated();
      refreshBtn.classList.remove("spinning");
      showToast("Demo feed refreshed.");
    }, 800);
  }
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(el, from, to, duration) {
  if (!el) return;
  const start = performance.now();
  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(from + (to - from) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ============================================
// LAST UPDATED
// ============================================
function updateLastUpdated() {
  const now = new Date();
  const h   = now.getHours().toString().padStart(2, "0");
  const m   = now.getMinutes().toString().padStart(2, "0");
  const el  = document.getElementById("last-updated");
  if (el) el.textContent = `Today at ${h}:${m}`;
}

// ============================================
// UTILITY HELPERS
// ============================================
function formatRelativeDate(isoDate) {
  if (!isoDate) return "Recently";
  const ts   = new Date(isoDate).getTime();
  if (isNaN(ts)) return "Recently";
  const diff = (Date.now() - ts) / 1000;
  if (diff < 0)       return "Just now";          // future timestamp (clock skew)
  if (diff < 60)      return "Just now";
  if (diff < 3600)    return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)   return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  if (diff < 172800)  return "1 day ago";
  return `${Math.floor(diff / 86400)} days ago`;
}

/** Convert a relative date string back to a timestamp for sorting */
function parseRelativeDate(dateStr) {
  if (!dateStr || dateStr === "Recently") return 0;
  const min  = dateStr.match(/(\d+)\s*min/);
  if (min)  return Date.now() - parseInt(min[1])  * 60       * 1000;
  const hr   = dateStr.match(/(\d+)\s*hour/);
  if (hr)   return Date.now() - parseInt(hr[1])   * 3600     * 1000;
  const day  = dateStr.match(/(\d+)\s*day/);
  if (day)  return Date.now() - parseInt(day[1])  * 86400    * 1000;
  return 0;
}

function estimateReadTime(text) {
  if (!text) return "2 min read";
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function guessCategory(article) {
  const text = ((article.title || "") + " " + (article.description || "")).toLowerCase();
  // Politics — must come first (high-priority, specific terms)
  if (/(\bpolitics\b|\bminister\b|\belection\b|\bvoting\b|\bballot\b|\bcongress\b|\bsenate\b|\bparliament\b|\bgovernment\b|\bgovt\b|\bpm modi\b|\bprime minister\b|\bcabinet\b|\bbjp\b|\bdmk\b|\baiadmk\b|\bstroke\b|\bstali|\bcm \b|\bchief minister\b|\bopposition\b|\blegislat|\bpresident\b|\bwhite house\b|\bmanifest|\bcampaign\b|\bvote\b|\bdemocrat\b|\brepublican\b|\btrump\b|\bbiden\b|\bmodiji\b|\bswaraj\b|\brahul gandhi\b|\bamnesty\b|\braj\b)/i.test(text)) return "politics";
  // Technology
  if (/(\btech\b|\btechnology\b|\bai\b|\bartificial intelligence\b|\bsoftware\b|\bapple\b|\bgoogle\b|\bmicrosoft\b|\bsamsung\b|\brobot\b|\bgadget\b|\bchip\b|\bsmartphone\b|\bapp\b|\bcybersecurity\b|\binternet\b|\bcloud\b|\bdata\b|\bblockchain\b|\bcrypto\b|\belectric vehicle\b|\bev \b|\bsemiconductor\b|\bcomputer\b|\blaptop\b|\bdigital\b|\btesla\b|\bnvidia\b|\bmetaverse\b|\bgaming\b|\biphone\b|\bandroid\b)/i.test(text)) return "technology";
  // Business & Finance
  if (/(\bstock\b|\bmarket\b|\beconomy\b|\bfinance\b|\bbusiness\b|\bprofit\b|\btrade\b|\bstartup\b|\bgdp\b|\binfla|\bbanking\b|\binvestment\b|\bipo\b|\bshare\b|\bcurrency\b|\brupee\b|\bdollar\b|\bimport\b|\bexport\b|\btariff\b|\bbudget\b|\bsensex\b|\bnifty\b|\bfdi\b|\bcorporate\b|\breach\b|\brevenue\b|\bquarter\b|\bceo\b)/i.test(text)) return "business";
  // Health & Medicine
  if (/(\bhealth\b|\bcovid\b|\bvaccine\b|\bmedicine\b|\bhospital\b|\bdisease\b|\bdrug\b|\bvirus\b|\bpandemic\b|\bcancer\b|\bdiabetes\b|\bmental health\b|\bdoctor\b|\bclinic\b|\btreatment\b|\bsurgery\b|\bwho\b|\bfda\b|\bhealth ministry\b|\bnhs\b|\bmedical\b|\bpatient\b|\bimmune\b|\bnutrition\b|\bwellness\b)/i.test(text)) return "health";
  // Science
  if (/(\bscience\b|\bspace\b|\bnasa\b|\bdiscovery\b|\bresearch\b|\bstudy\b|\bphysics\b|\bisro\b|\bclimate\b|\benvironment\b|\bplanet\b|\bsolar\b|\bastrono|\bbiolog|\bchemistr|\bgeolog|\bevolut|\bfossil\b|\bgene\b|\bdna\b|\bquantum\b|\batom\b|\bscientist\b|\blab\b|\bexperiment\b)/i.test(text)) return "science";
  // Sports
  if (/(\bsport\b|\bfootball\b|\bcricket\b|\btennis\b|\bolympic\b|\bmatch\b|\bleague\b|\btournament\b|\bplayer\b|\bteam\b|\bgoal\b|\bwicket\b|\bchampionship\b|\bgame\b|\bworld cup\b|\bipl\b|\bnba\b|\bnfl\b|\bfifa\b|\bathlon\b|\bcoach\b|\bracing\b|\bboxing\b|\bwrestling\b|\bgolf\b|\bbadminton\b)/i.test(text)) return "sports";
  // Entertainment
  if (/(\bmovie\b|\bfilm\b|\bcelebrity\b|\bmusic\b|\bentertainment\b|\bactor\b|\bactress\b|\bdirector\b|\bnetflix\b|\bott\b|\bcollywood\b|\bollywood\b|\bkollywood\b|\balbum\b|\bsong\b|\bseries\b|\bshow\b|\baward\b|\boscars\b|\bgrammys\b|\bcinema\b|\bstreaming\b|\btrailer\b)/i.test(text)) return "entertainment";
  return "world";
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  if (typeof str !== "string") return str || "";
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

// ============================================
// BIND ALL EVENTS
// ============================================
function bindEvents() {
  // Category buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => setCategory(btn.dataset.category));
  });

  // Search
  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(handleSearch, 350);
  });
  searchClear.addEventListener("click", clearSearch);
  if (clearSearchBtn) clearSearchBtn.addEventListener("click", clearSearch);

  // Refresh
  refreshBtn.addEventListener("click", refreshFeed);

  // View toggle
  gridViewBtn.addEventListener("click", setGridView);
  listViewBtn.addEventListener("click", setListView);

  // Load more
  loadMoreBtn.addEventListener("click", loadMore);

  // Modal close
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay) closeModal();
  });

  // Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
  });

  // Header scroll shadow
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

// ============================================
// MAKE GLOBAL (called from inline HTML)
// ============================================
window.openModal    = openModal;
window.shareArticle = shareArticle;
