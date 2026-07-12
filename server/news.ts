import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { newsArticles, newsSources, InsertNewsArticle } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";

// ============================================================
// RSS FETCHING & PROCESSING
// ============================================================

/**
 * Fetch and parse RSS feed
 * Returns array of parsed items with minimal dependencies
 */
export async function fetchRssFeed(rssUrl: string): Promise<Array<{
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  author?: string;
}>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(rssUrl, {
      headers: { "User-Agent": "Tarifberater24-NewsBot/1.0" },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`[RSS] Failed to fetch ${rssUrl}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const items: Array<any> = [];

    // Simple XML parsing without external dependencies
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const item: any = {};

      // Extract fields using regex
      const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/);
      const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/);
      const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/);
      const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);
      const authorMatch = itemXml.match(/<author[^>]*>([\s\S]*?)<\/author>/);

      item.title = titleMatch ? stripHtml(titleMatch[1]) : "Без заглавие";
      item.description = descMatch ? stripHtml(descMatch[1]).substring(0, 500) : "";
      item.link = linkMatch ? linkMatch[1].trim() : "";
      item.pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
      item.guid = guidMatch ? guidMatch[1].trim() : item.link;
      item.author = authorMatch ? stripHtml(authorMatch[1]) : undefined;

      if (item.title && item.link) {
        items.push(item);
      }
    }

    return items;
  } catch (error) {
    console.error(`[RSS] Error fetching ${rssUrl}:`, error);
    return [];
  }
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Categorize article based on keywords
 */
function categorizeArticle(
  title: string,
  description: string
): "finance" | "legal" | "community" | "insurance" | "banking" | "utilities" {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("versicherung") ||
    text.includes("kfz") ||
    text.includes("haftpflicht") ||
    text.includes("insurance")
  ) {
    return "insurance";
  }
  if (
    text.includes("bank") ||
    text.includes("konto") ||
    text.includes("kredit") ||
    text.includes("banking")
  ) {
    return "banking";
  }
  if (
    text.includes("strom") ||
    text.includes("gas") ||
    text.includes("energie") ||
    text.includes("internet") ||
    text.includes("telefon") ||
    text.includes("energy") ||
    text.includes("utilities")
  ) {
    return "utilities";
  }
  if (
    text.includes("recht") ||
    text.includes("gesetz") ||
    text.includes("legal") ||
    text.includes("law")
  ) {
    return "legal";
  }
  if (
    text.includes("bulgaren") ||
    text.includes("community") ||
    text.includes("gemeinde")
  ) {
    return "community";
  }

  // Default to finance for government/economic news
  return "finance";
}

/**
 * Determine importance level based on keywords
 */
function determineImportance(
  title: string,
  description: string
): "low" | "medium" | "high" | "critical" {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("notfall") ||
    text.includes("krise") ||
    text.includes("emergency") ||
    text.includes("crisis") ||
    text.includes("verbot") ||
    text.includes("ban")
  ) {
    return "critical";
  }
  if (
    text.includes("wichtig") ||
    text.includes("important") ||
    text.includes("änderung") ||
    text.includes("change") ||
    text.includes("reform")
  ) {
    return "high";
  }
  if (
    text.includes("tipp") ||
    text.includes("ratschlag") ||
    text.includes("tip") ||
    text.includes("advice")
  ) {
    return "low";
  }

  return "medium";
}

/**
 * Check if article already exists (deduplication)
 */
export async function articleExists(rssGuid: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.rssGuid, rssGuid))
    .limit(1);

  return result.length > 0;
}

/**
 * Translate and summarize article using built-in LLM
 * Optimized for minimal token usage
 */
export async function translateAndSummarize(
  title: string,
  description: string,
  sourceLanguage: "de" | "en" | "bg" = "de"
): Promise<{ summary: string; title: string }> {
  if (sourceLanguage === "bg") {
    return { summary: description, title };
  }

  try {
    const prompt = `Преведи на български и обобщи в 1-2 изречения за българи в Германия:\n\nЗаглавие: ${title}\nСъдържание: ${description}\n\nОтговор (само преводът и обобщението, без допълнения):`;

    const response = await invokeLLM({
      model: "gpt-4o-mini", // Minimal token usage
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content || description;
    const contentStr = typeof content === "string" ? content : String(content);
    const lines = contentStr.split("\n").filter((l: string) => l.trim());

    return {
      title: lines[0] || title,
      summary: lines.slice(1).join(" ") || description,
    };
  } catch (error) {
    console.error("[LLM] Translation error:", error);
    return { summary: description, title };
  }
}

/**
 * Process and store a single RSS item
 */
export async function processRssItem(
  item: Awaited<ReturnType<typeof fetchRssFeed>>[0],
  sourceSlug: string,
  sourceLanguage: "de" | "en" | "bg" = "de"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Check for duplicates
  if (await articleExists(item.guid)) {
    console.log(`[News] Duplicate: ${item.guid}`);
    return false;
  }

  try {
    // Translate and summarize
    const { title, summary } = await translateAndSummarize(
      item.title,
      item.description,
      sourceLanguage
    );

    // Categorize and determine importance
    const category = categorizeArticle(item.title, item.description);
    const importance = determineImportance(item.title, item.description);

    // Prepare insert data
    const newsItem: InsertNewsArticle = {
      title,
      summary,
      content: null,
      category,
      imageUrl: null,
      sourceUrl: item.link,
      author: item.author || "Редакция",
      publishedAt: new Date(item.pubDate),
      featured: importance === "critical" || importance === "high",
      rssSource: sourceSlug,
      rssGuid: item.guid,
      isTranslated: true,
      originalLanguage: sourceLanguage,
      importance,
      pushNotificationSent: false,
    };

    // Insert into database
    await db.insert(newsArticles).values(newsItem);
    console.log(`[News] Inserted: ${title}`);
    return true;
  } catch (error) {
    console.error(`[News] Error processing item:`, error);
    return false;
  }
}

/**
 * Fetch and process all active RSS sources
 * Called by Heartbeat/Cron every 12 hours
 */
export async function fetchAndProcessAllNews(): Promise<{
  processed: number;
  duplicates: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    console.error("[News] Database not available");
    return { processed: 0, duplicates: 0, errors: 0 };
  }

  let stats = { processed: 0, duplicates: 0, errors: 0 };

  try {
    // Get all active news sources
    const sources = await db
      .select()
      .from(newsSources)
      .where(eq(newsSources.isActive, true));

    console.log(`[News] Processing ${sources.length} RSS sources...`);

    for (const source of sources) {
      try {
        // Fetch RSS feed
        const items = await fetchRssFeed(source.rssUrl);
        console.log(`[News] Fetched ${items.length} items from ${source.slug}`);

        // Process each item
        for (const item of items) {
          const processed = await processRssItem(
            item,
            source.slug,
            source.language as "de" | "en"
          );

          if (processed) {
            stats.processed++;
          } else {
            stats.duplicates++;
          }
        }

        // Update last fetched time
        await db
          .update(newsSources)
          .set({ lastFetchedAt: new Date() })
          .where(eq(newsSources.id, source.id));
      } catch (error) {
        console.error(`[News] Error processing source ${source.slug}:`, error);
        stats.errors++;
      }
    }

    console.log(`[News] Summary: ${stats.processed} new, ${stats.duplicates} duplicates, ${stats.errors} errors`);
  } catch (error) {
    console.error("[News] Fatal error:", error);
  }

  return stats;
}

/**
 * Initialize default news sources
 */
export async function initializeDefaultSources(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const defaultSources = [
    {
      slug: "tagesschau_de",
      name: "Tagesschau (Политика и правителство)",
      rssUrl: "https://www.tagesschau.de/xml/rss2_de.xml",
      category: "finance" as const,
      language: "de" as const,
    },
    {
      slug: "faz_finance",
      name: "FAZ (Финанси и икономика)",
      rssUrl: "https://www.faz.net/rss/aktuell/",
      category: "finance" as const,
      language: "de" as const,
    },
    {
      slug: "bundesbank",
      name: "Deutsche Bundesbank (Банкиране)",
      rssUrl: "https://www.bundesbank.de/en/homepage/rss/deutsche-bundesbank-s-rss-feed-620440",
      category: "banking" as const,
      language: "en" as const,
    },
    {
      slug: "clean_energy_wire",
      name: "Clean Energy Wire (Енергия)",
      rssUrl: "https://www.cleanenergywire.org/news/feed",
      category: "utilities" as const,
      language: "en" as const,
    },
  ];

  for (const source of defaultSources) {
    try {
      await db.insert(newsSources).values(source);
      console.log(`[News] Initialized source: ${source.slug}`);
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`[News] Source already exists: ${source.slug}`);
      } else {
        console.error(`[News] Error initializing source ${source.slug}:`, error);
      }
    }
  }
}
