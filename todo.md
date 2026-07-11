# Tarifberater24 — Migration TODO

## Phase 1: Foundation
- [x] Global styles (index.css) — dark void-canvas theme + CSS variables
- [x] Fonts — NB Architekt + Google Fonts in index.html
- [x] ThemeContext

## Phase 2: Shared Components
- [x] TopNav (Tarifberater24 branding + CTA)
- [x] BottomNav
- [x] Footer (legal links + SSL/DSGVO badges)
- [x] CookieBanner (granular consent)
- [x] SEOMeta (OG, Twitter Card, JSON-LD)
- [x] ErrorBoundary

## Phase 3: Backend
- [x] drizzle/schema.ts — leads + partners tables
- [x] server/db.ts — extend with existing helpers
- [x] server/leads.ts — data access layer
- [x] server/crm/hubspot.ts — CRM adapter
- [x] server/routers.ts — leads + partners tRPC procedures

## Phase 4: DB Migrations
- [x] leads table migration
- [x] partners table migration

## Phase 5: Existing Pages
- [x] Home
- [x] Services
- [x] InsuranceWizard
- [x] Assistant
- [x] News
- [x] Profile
- [x] Settings
- [x] Onboarding

## Phase 6: New Business Pages
- [x] GetOffer (3-step form)
- [x] Partners
- [x] About
- [x] FAQ
- [x] Contact

## Phase 7: Legal Pages
- [x] Impressum
- [x] Datenschutz
- [x] AGB
- [x] CookiePolicy
- [x] AffiliateDisclosure
- [x] PrivacySettings

## Phase 8: Routing
- [x] App.tsx — all 16+ routes with AppLayout / FullLayout
- [x] TypeScript check passes
- [ ] Checkpoint saved
