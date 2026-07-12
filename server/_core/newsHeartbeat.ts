import { fetchAndProcessAllNews, initializeDefaultSources } from "../news";

/**
 * Heartbeat job for automated news fetching
 * Runs every 12 hours via WebDev Heartbeat
 * Minimal dependencies, no external polling, zero token waste
 */
export async function newsHeartbeat() {
  const startTime = Date.now();
  console.log("[Heartbeat] Starting news fetch cycle...");

  try {
    // Initialize default sources on first run
    await initializeDefaultSources();

    // Fetch and process all news
    const stats = await fetchAndProcessAllNews();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(
      `[Heartbeat] News cycle completed in ${duration}s: ${stats.processed} new, ${stats.duplicates} duplicates, ${stats.errors} errors`
    );

    return {
      success: true,
      processed: stats.processed,
      duplicates: stats.duplicates,
      errors: stats.errors,
      duration: `${duration}s`,
    };
  } catch (error) {
    console.error("[Heartbeat] Fatal error:", error);
    return {
      success: false,
      error: String(error),
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
    };
  }
}
