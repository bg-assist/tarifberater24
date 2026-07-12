# News Center Deployment & Setup Guide

## Pre-Deployment Checklist

### Code Changes
- [x] Database schema extended (newsArticles + newsSources tables)
- [x] RSS fetching logic implemented (server/news.ts)
- [x] AI integration for translation/summarization
- [x] News UI component enhanced (client/src/pages/News.tsx)
- [x] AI Assistant integration with news context
- [x] Heartbeat automation setup (server/_core/newsHeartbeat.ts)
- [x] TypeScript compilation passes
- [x] Build succeeds without errors

### Files Added/Modified

| File | Type | Purpose |
|------|------|---------|
| `drizzle/schema.ts` | Modified | Extended newsArticles, added newsSources table |
| `drizzle/0002_news_enhancements.sql` | New | Migration SQL for database updates |
| `server/news.ts` | New | Core news fetching and processing logic |
| `server/_core/newsHeartbeat.ts` | New | 12-hour automation entry point |
| `server/db.ts` | Modified | Added getFeaturedNews() function |
| `server/routers.ts` | Modified | Added news.featured endpoint, AI integration |
| `client/src/pages/News.tsx` | Modified | Enhanced UI with featured articles |
| `docs/NEWS_CENTER_IMPLEMENTATION.md` | New | Technical documentation |

## Deployment Steps

### 1. Database Migration

**Option A: WebDev Admin Panel (Recommended)**

1. Navigate to WebDev Project Settings
2. Go to Database > Migrations
3. Upload or paste migration file: `drizzle/0002_news_enhancements.sql`
4. Review changes and apply
5. Verify tables created: Check `news_sources` and `newsArticles` columns

**Option B: Manual SQL Execution**

```bash
# Connect to database
mysql -h $DATABASE_HOST -u $DATABASE_USER -p $DATABASE_PASSWORD $DATABASE_NAME

# Run migration
SOURCE drizzle/0002_news_enhancements.sql;

# Verify
DESCRIBE news_articles;
DESCRIBE news_sources;
```

### 2. Deploy Code

```bash
# Pull latest changes
git pull origin main

# Install dependencies (if needed)
pnpm install

# Build
pnpm build

# Deploy via WebDev
# (WebDev automatically detects and deploys on push to main)
```

### 3. Initialize News Sources

The first heartbeat will automatically initialize default sources:
- Tagesschau (Government, Politics)
- FAZ (Finance, Business)
- Deutsche Bundesbank (Banking)
- Clean Energy Wire (Energy)

**Manual initialization (if needed):**

```sql
INSERT INTO news_sources (slug, name, rssUrl, category, language, isActive, fetchIntervalMinutes)
VALUES 
  ('tagesschau_de', 'Tagesschau', 'https://www.tagesschau.de/xml/rss2_de.xml', 'finance', 'de', 1, 720),
  ('faz_finance', 'FAZ Finance', 'https://www.faz.net/rss/aktuell/', 'finance', 'de', 1, 720),
  ('bundesbank', 'Deutsche Bundesbank', 'https://www.bundesbank.de/en/homepage/rss/deutsche-bundesbank-s-rss-feed-620440', 'banking', 'en', 1, 720),
  ('clean_energy_wire', 'Clean Energy Wire', 'https://www.cleanenergywire.org/news/feed', 'utilities', 'en', 1, 720);
```

### 4. Configure Heartbeat

**WebDev Heartbeat Setup:**

1. Go to WebDev Project Settings
2. Navigate to Scheduled Tasks / Heartbeat
3. Create new scheduled task:
   - **Name:** News Center Fetcher
   - **Frequency:** Every 12 hours
   - **Endpoint:** `POST /api/internal/news-heartbeat`
   - **Handler:** `newsHeartbeat()` from `server/_core/newsHeartbeat.ts`
   - **Timeout:** 60 seconds
   - **Retry:** On failure, retry after 5 minutes

4. Save and enable

### 5. Verify Deployment

#### Test API Endpoints

```bash
# List all news
curl "https://tarifberater24.de/api/trpc/news.list?input={\"limit\":5}"

# Get featured news
curl "https://tarifberater24.de/api/trpc/news.featured?input={\"limit\":3}"

# Check news sources
curl "https://tarifberater24.de/api/internal/news-sources"
```

#### Check Database

```sql
-- Count articles
SELECT COUNT(*) as total_articles FROM news_articles;

-- Check sources
SELECT slug, name, lastFetchedAt FROM news_sources;

-- View latest articles
SELECT title, category, importance, publishedAt 
FROM news_articles 
ORDER BY publishedAt DESC 
LIMIT 5;

-- Check for duplicates
SELECT rssGuid, COUNT(*) as count 
FROM news_articles 
GROUP BY rssGuid 
HAVING count > 1;
```

#### Test Frontend

1. Navigate to `/news` page
2. Verify featured articles section displays
3. Test category filters
4. Check that importance indicators show correctly
5. Verify article links open to original sources

#### Test AI Assistant

1. Open AI Assistant chat
2. Ask a question related to news topics
3. Verify assistant includes recent news in context
4. Example: "Какви са последните новини за застраховки в Германия?"

### 6. Monitor First Heartbeat

After deployment, monitor the first automated execution:

1. Check WebDev logs for `[News]` entries
2. Verify articles appear in database
3. Confirm `/news` page displays fetched articles
4. Check for any errors in logs

**Expected log output:**
```
[News] Processing 4 RSS sources...
[News] Fetched 15 items from tagesschau_de
[News] Fetched 12 items from faz_finance
[News] Fetched 8 items from bundesbank
[News] Fetched 6 items from clean_energy_wire
[News] Inserted: Bundesbank повишава лихвите
[News] Inserted: Нови правила за застраховки
[News] Summary: 12 new, 18 duplicates, 0 errors
```

## Post-Deployment Configuration

### Add More News Sources

To add additional RSS sources:

```sql
INSERT INTO news_sources (slug, name, rssUrl, category, language, isActive, fetchIntervalMinutes)
VALUES 
  ('spiegel_de', 'Der Spiegel', 'https://www.spiegel.de/international/index.rss', 'finance', 'de', 1, 720),
  ('handelsblatt', 'Handelsblatt', 'https://www.handelsblatt.com/rss/', 'finance', 'de', 1, 720);
```

### Disable/Enable Sources

```sql
-- Disable a source
UPDATE news_sources SET isActive = 0 WHERE slug = 'clean_energy_wire';

-- Re-enable
UPDATE news_sources SET isActive = 1 WHERE slug = 'clean_energy_wire';
```

### Adjust Fetch Frequency

```sql
-- Change from 12 hours to 6 hours
UPDATE news_sources SET fetchIntervalMinutes = 360 WHERE slug = 'tagesschau_de';
```

## Troubleshooting

### No Articles Appearing

**Problem:** News page is empty after deployment

**Solutions:**
1. Verify database migration applied: `SHOW TABLES LIKE 'news%';`
2. Check if sources are active: `SELECT COUNT(*) FROM news_sources WHERE isActive = 1;`
3. Manually trigger heartbeat: `curl -X POST https://tarifberater24.de/api/internal/news-heartbeat`
4. Check logs for errors

### RSS Fetch Failures

**Problem:** Articles not being fetched from specific source

**Solutions:**
1. Verify RSS URL is accessible: `curl https://www.tagesschau.de/xml/rss2_de.xml`
2. Check if source is active: `SELECT isActive FROM news_sources WHERE slug = 'tagesschau_de';`
3. Review error logs for timeout/network issues
4. Test with different RSS source temporarily

### Translation Not Working

**Problem:** Articles showing in German instead of Bulgarian

**Solutions:**
1. Verify LLM is configured: Check `OPENAI_API_KEY` environment variable
2. Check token limits: Ensure sufficient quota
3. Review `isTranslated` column: Should be `1` for translated articles
4. Check error logs for LLM failures
5. Fallback to original language is working (check `originalLanguage` field)

### Duplicate Articles

**Problem:** Same article appearing multiple times

**Solutions:**
1. Verify `rssGuid` is unique: `SELECT COUNT(DISTINCT rssGuid) FROM news_articles;`
2. Check for NULL rssGuid: `SELECT COUNT(*) FROM news_articles WHERE rssGuid IS NULL;`
3. Manually clean duplicates:
   ```sql
   DELETE FROM news_articles 
   WHERE id NOT IN (
     SELECT MIN(id) FROM news_articles GROUP BY rssGuid
   );
   ```

### Performance Issues

**Problem:** News page loading slowly

**Solutions:**
1. Add indexes: Already included in migration
2. Limit query results: Reduce `limit` parameter in API calls
3. Archive old articles: Delete articles older than 3 months
   ```sql
   DELETE FROM news_articles WHERE publishedAt < DATE_SUB(NOW(), INTERVAL 3 MONTH);
   ```

## Monitoring & Maintenance

### Weekly Tasks

- [ ] Check featured articles quality
- [ ] Verify categorization accuracy
- [ ] Monitor for duplicate articles
- [ ] Review error logs

### Monthly Tasks

- [ ] Audit RSS source performance
- [ ] Check translation quality
- [ ] Review AI Assistant responses with news context
- [ ] Update news sources if any become unavailable

### Quarterly Tasks

- [ ] Review and update trusted sources list
- [ ] Analyze article categories and adjust keywords if needed
- [ ] Check token usage and costs
- [ ] Archive old articles (>3 months)

## Rollback Plan

If issues occur post-deployment:

### Option 1: Disable News Center

```sql
-- Disable all sources
UPDATE news_sources SET isActive = 0;

-- Or disable heartbeat in WebDev admin
```

### Option 2: Revert Code

```bash
git revert HEAD
git push origin main
# WebDev will automatically redeploy
```

### Option 3: Restore from Backup

```bash
# Restore database from backup
mysql -h $DATABASE_HOST -u $DATABASE_USER -p $DATABASE_PASSWORD $DATABASE_NAME < backup.sql
```

## Success Criteria

✅ Deployment is successful when:

1. Database migration applied without errors
2. TypeScript compilation passes
3. Build succeeds
4. News page (`/news`) loads without errors
5. Featured articles section displays
6. Category filters work correctly
7. First heartbeat executes successfully
8. Articles appear in database
9. AI Assistant includes news context
10. No duplicate articles in database
11. All article links are valid
12. Performance is acceptable (<2s page load)

## Support

For issues or questions:

1. Check logs: WebDev admin > Logs > Filter by `[News]`
2. Review documentation: `docs/NEWS_CENTER_IMPLEMENTATION.md`
3. Test endpoints manually with curl
4. Verify database state with SQL queries
5. Contact support with logs and error messages

---

**Deployment Date:** [To be filled]  
**Deployed By:** [To be filled]  
**Status:** [Pending / In Progress / Complete]
