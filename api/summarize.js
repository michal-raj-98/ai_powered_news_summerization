// ============================================
// Vercel Serverless Function: /api/summarize
// Sends article text to Gemini AI and returns
// a clean 3-sentence AI summary
// Your API key stays SECRET on the server
// ============================================

export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Read the key from Vercel Environment Variables (never exposed to users)
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not set. Please add it in your Vercel project settings."
    });
  }

  // Get article content from request body
  const { title = "", description = "" } = req.body || {};

  if (!title && !description) {
    return res.status(400).json({ error: "Provide title or description in request body" });
  }

  // Prompt for Gemini
  const prompt = `Summarize this news article in exactly 3 clear, concise sentences.
Focus only on the most important facts.
Write in simple English that anyone can understand.
Do NOT say "The article says" or "According to".
Just write the summary directly.

Title: ${title}
Content: ${description}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ],
          generationConfig: {
            maxOutputTokens: 200,
            temperature:     0.3,
            topP:            0.8
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!summary) {
      throw new Error("Gemini returned an empty response");
    }

    // Return the summary to the frontend
    return res.status(200).json({ summary });

  } catch (error) {
    console.error("[/api/summarize] Error:", error.message);
    return res.status(500).json({
      error:   "Failed to generate summary",
      details: error.message
    });
  }
}
