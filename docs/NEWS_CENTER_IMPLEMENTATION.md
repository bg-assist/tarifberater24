# Automated News Center Implementation Guide

## Overview

The Tarifberater24 News Center is a fully automated, AI-powered news aggregation system designed specifically for Bulgarians living in Germany. It fetches verified information from trusted German sources every 12 hours, translates and summarizes content in Bulgarian, and integrates with the AI Assistant to provide context-aware responses.

## Architecture

### Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **RSS Fetching** | Native Node.js `fetch` API | Direct RSS parsing without external dependencies |
| **AI Processing** | Built-in LLM (GPT-4o-mini) | Translation, summarization, and importance classification |
| **Database** | TiDB/MySQL | Persistent storage with deduplication |
| **Automation** | WebDev Heartbeat | 12-hour cron job execution |
| **Frontend** | React + TailwindCSS | Premium mobile-first UI with category filters |
| **AI Integration** | tRPC + System Prompt | Context-aware assistant responses |

### Data Flow

```
RSS Sources (Tagesschau, FAZ, Bundesbank, etc.)
    ↓
fetchRssFeed() - Parse XML
    ↓
articleExists() - Check for duplicates (rssGuid)
    ↓
translateAndSummarize() - AI translation to Bulgarian
    ↓
categorizeArticle() - Auto-categorization
    ↓
determineImportance() - Critical/High/Medium/Low
    ↓
Database Insert (newsArticles + newsSources)
    ↓
AI Assistant Context + News Feed UI
```

## Database Schema

### newsArticles Table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key |
| `title` | TEXT | Article title (Bulgarian) |
| `summary` | TEXT | AI-generated summary (Bulgarian) |
| `content` | TEXT | Full article content (optional) |
| `category` | ENUM | finance, legal, insurance, banking, utilities, community |
| `importance` | ENUM | critical, high, medium, low |
| `rssSource` | VARCHAR(256) | Source identifier (e.g., 'tagesschau_de') |
| `rssGuid` | VARCHAR(512) UNIQUE | RSS item GUID for deduplication |
| `isTranslated` | BOOLEAN | Whether content was translated by AI |
| `originalLanguage` | ENUM | de, en, bg |
| `featured` | BOOLEAN | Auto-set if importance is critical/high |
| `pushNotificationSent` | BOOLEAN | Track notification delivery |
| `publishedAt` | TIMESTAMP | Original publication date |
| `createdAt` | TIMESTAMP | When article was added to DB |
| `updatedAt` | TIMESTAMP | Last update timestamp |

### newsSources Table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key |
| `slug` | VARCHAR(64) UNIQUE | Source identifier (e.g., 'tagesschau_de') |
| `name` | VARCHAR(128) | Display name |
| `rssUrl` | TEXT | RSS feed URL |
| `category` | ENUM | Article category |
| `language` | ENUM | de, en |
| `isActive` | BOOLEAN | Enable/disable source |
| `lastFetchedAt` | TIMESTAMP | Last successful fetch |
| `fetchIntervalMinutes` | INT | Fetch frequency (default: 720 = 12 hours) |
| `createdAt` | TIMESTAMP | Creation date |
| `updatedAt` | TIMESTAMP | Last update |

## Trusted News Sources

| Source | Category | Language | URL |
|--------|----------|----------|-----|
| **Tagesschau** | Government, Politics | DE | https://www.tagesschau.de/xml/rss2_de.xml |
| **FAZ** | Finance, Business | DE | https://www.faz.net/rss/aktuell/ |
| **Deutsche Bundesbank** | Banking, Finance | EN | https://www.bundesbank.de/en/homepage/rss/deutsche-bundesbank-s-rss-feed-620440 |
| **Clean Energy Wire** | Energy, Utilities | EN | https://www.cleanenergywire.org/news/feed |

## Backend Implementation

### Key Functions

#### `fetchRssFeed(rssUrl: string)`
- Fetches and parses RSS XML without external dependencies
- Uses regex-based parsing for reliability
- Returns array of parsed items with title, description, link, pubDate, guid, author
- Handles timeouts gracefully (10s)

#### `articleExists(rssGuid: string)`
- Checks if article already exists in database
- Prevents duplicate articles using RSS GUID
- Returns boolean

#### `translateAndSummarize(title, description, sourceLanguage)`
- Calls built-in LLM (GPT-4o-mini) for translation
- Optimized prompt for minimal token usage (~100-150 tokens per article)
- Returns Bulgarian title and 1-2 sentence summary
- Falls back to original text if translation fails

#### `categorizeArticle(title, description)`
- Keyword-based categorization (no LLM needed)
- Returns one of: finance, legal, insurance, banking, utilities, community
- Runs in <1ms per article

#### `determineImportance(title, description)`
- Keyword-based importance classification
- Returns: critical, high, medium, low
- Triggers featured status if critical or high

#### `processRssItem(item, sourceSlug, sourceLanguage)`
- Orchestrates the full pipeline for a single article
- Checks for duplicates, translates, categorizes, stores in DB
- Returns boolean indicating success

#### `fetchAndProcessAllNews()`
- Main entry point for the 12-hour cron job
- Iterates through all active RSS sources
- Returns stats: { processed, duplicates, errors }

#### `initializeDefaultSources()`
- Populates the newsSources table with trusted sources
- Runs on first heartbeat
- Idempotent (skips if sources already exist)

### API Endpoints (tRPC)

#### `news.list`
```typescript
Input: { category?: string, limit?: number }
Output: NewsArticle[]
```
Returns articles filtered by category, ordered by publishedAt DESC

#### `news.featured`
```typescript
Input: { limit?: number }
Output: NewsArticle[]
```
Returns featured articles (importance: critical or high)

### AI Assistant Integration

The AI Assistant system prompt now includes:
- Latest 3 featured news articles for context
- Automatic injection of verified information
- Encourages assistant to reference news when answering questions

Example system prompt addition:
```
СВЕЖИ НОВИНИ (за справка):
- Bundesbank повишава лихвите: Нови мерки за борба с инфлацията
- Нови правила за застраховки: Какво се променя през 2024
- Енергийна криза: Съветите на правителството за спестяване
```

## Automation Setup

### WebDev Heartbeat Configuration

The News Center runs automatically via WebDev's built-in Heartbeat:

1. **Schedule**: Every 12 hours (configurable)
2. **Entry Point**: `server/_core/newsHeartbeat.ts`
3. **Function**: `newsHeartbeat()`
4. **Output**: JSON stats { processed, duplicates, errors, duration }

### Manual Trigger

To manually fetch news:

```bash
# Development
curl http://localhost:3000/api/news/heartbeat

# Production (via WebDev admin)
# Navigate to Scheduled Tasks > News Heartbeat > Run Now
```

## Frontend Implementation

### News Page (`/news`)

**Features:**
- Premium dark-luxury design matching Tarifberater24 aesthetic
- Mobile-first responsive layout
- Featured articles section (3-column grid on desktop)
- Category filter (Всички, Финанси, Право, Застраховки, Банкиране, Комунални, Общност)
- Importance indicators (🔴 Критично, 🟡 Важно, 🟢 Полезно)
- Direct links to original sources
- Loading skeletons for better UX
- Empty state messaging

**Performance:**
- Lazy loading of articles
- Optimized images (WebP)
- CSS animations for smooth transitions
- Pagination support (limit: 20 articles)

## Token Optimization

### Cost Analysis (per 12-hour cycle)

| Operation | Tokens | Frequency | Total |
|-----------|--------|-----------|-------|
| Fetch RSS | 0 | 4 sources | 0 |
| Parse XML | 0 | 4 sources | 0 |
| Translate/Summarize | 150 | 20 articles | 3,000 |
| Categorize | 0 | 20 articles | 0 |
| **Total per cycle** | | | **~3,000 tokens** |
| **Monthly cost** | | 60 cycles | **~180,000 tokens** |

**Cost Estimate:** ~$0.27/month (at $1.50 per 1M tokens for GPT-4o-mini)

### Optimization Strategies

1. **No external dependencies**: Regex-based RSS parsing
2. **Minimal LLM calls**: Only for translation/summarization
3. **Keyword-based categorization**: No AI needed
4. **Deduplication**: Prevents redundant processing
5. **Batch processing**: All sources in single heartbeat
6. **Caching**: Featured articles cached in memory

## Error Handling

### Graceful Degradation

- **RSS fetch fails**: Logs error, continues with next source
- **Translation fails**: Falls back to original text
- **Database unavailable**: Returns demo articles
- **Network timeout**: Aborts after 10 seconds
- **Duplicate detection**: Silently skips

### Monitoring

All operations logged with `[News]` prefix:
```
[News] Processing 4 RSS sources...
[News] Fetched 15 items from tagesschau_de
[News] Inserted: Bundesbank повишава лихвите
[News] Duplicate: https://example.com/article-123
[News] Summary: 12 new, 3 duplicates, 0 errors
```

## Deployment Checklist

- [ ] Run database migrations: `drizzle-kit push`
- [ ] Deploy code changes: `git push origin main`
- [ ] Verify WebDev build: `pnpm build` succeeds
- [ ] Test news endpoints: `curl /api/trpc/news.list`
- [ ] Check featured articles: `curl /api/trpc/news.featured`
- [ ] Verify AI Assistant includes news context
- [ ] Monitor first heartbeat execution
- [ ] Confirm articles appear on `/news` page

## Future Enhancements

1. **Push Notifications**: Send alerts for critical news
2. **Email Digest**: Weekly newsletter for subscribers
3. **Search**: Full-text search across articles
4. **Saved Articles**: User bookmarking functionality
5. **Social Sharing**: Share articles to social media
6. **Custom Alerts**: User-defined keyword triggers
7. **Multi-language**: Support for German, English, Bulgarian
8. **Source Management**: Admin panel to add/remove sources
9. **Analytics**: Track which articles are most read
10. **Fact-checking**: Integration with verification APIs

## Troubleshooting

### No articles appearing

1. Check database connection: `SELECT COUNT(*) FROM news_articles;`
2. Verify RSS sources are active: `SELECT * FROM news_sources WHERE isActive = true;`
3. Check heartbeat logs: Look for `[News]` entries
4. Test RSS fetch manually: `curl https://www.tagesschau.de/xml/rss2_de.xml`

### Articles not translating

1. Verify LLM is working: Test with simple prompt
2. Check token limits: Ensure sufficient quota
3. Review error logs for LLM failures
4. Fallback to original text is working (check `isTranslated` field)

### Duplicates appearing

1. Verify `rssGuid` is unique: `SELECT rssGuid, COUNT(*) FROM news_articles GROUP BY rssGuid HAVING COUNT(*) > 1;`
2. Check for NULL rssGuid values
3. Ensure deduplication logic is running before insert

## Support & Maintenance

- **Weekly**: Monitor article quality and categorization accuracy
- **Monthly**: Review RSS source performance and update if needed
- **Quarterly**: Audit AI translation quality and adjust prompts
- **Annually**: Review and update trusted news sources list

---

**Last Updated:** July 2026  
**Status:** Production Ready  
**Maintenance:** Automated with manual oversight
