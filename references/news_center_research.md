# News Center Research & Architecture

## Trusted German News Sources
| Source | Category | Type | Reliable |
|---|---|---|---|
| **Tagesschau** | Government, General | RSS/Web | High |
| **Spiegel Online** | General, Politics | RSS/Web | High |
| **FAZ (Frankfurter Allgemeine)** | Finance, Business | RSS/Web | High |
| **Clean Energy Wire** | Energy | Web | High |
| **Deutsche Bundesbank** | Finance, Banking | RSS | High |
| **Bundesregierung.de** | Government | Web | High |
| **Haufe** | Employment, Legal | Web | High |

## Architecture Comparison

| Approach | Tradeoffs | Cost | Setup Complexity |
|---|---|---|---|
| **WebDev + Cron (Built-in LLM)** | Fully automated, free per run, integrated UI. Limited to WebDev resources. | Low (Free start) | Medium |
| **Manus Schedule** | AI-heavy, easy to setup. Expensive per run (credits). | High (Credits) | Low |
| **Persistent Sandbox** | Full control, custom tools (e.g. RSS parsers). Paid option. | Medium ($10/mo) | High |

**Recommendation:** Use **WebDev + Cron** with built-in LLM for translation/summarization. This provides a free-to-run, integrated solution with a premium UI.

## Data Sources for Automation
- **RSS Feeds:** Tagesschau, Spiegel, FAZ, Bundesbank.
- **Web Scraping:** Bundesregierung.de, Clean Energy Wire (if RSS unavailable).
- **APIs:** NewsAPI.org (as fallback).
