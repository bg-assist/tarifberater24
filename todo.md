# Tarifberater24 — TODO

## Migration from bg-assist
- [x] Global styles (index.css) — dark void-canvas theme + CSS variables
- [x] Fonts — Space Grotesk + Google Fonts in index.html
- [x] ThemeContext
- [x] TopNav (Tarifberater24 branding + CTA)
- [x] BottomNav
- [x] Footer (legal links + SSL/DSGVO badges)
- [x] CookieBanner (granular consent)
- [x] SEOMeta (OG, Twitter Card, JSON-LD)
- [x] ErrorBoundary
- [x] drizzle/schema.ts — all tables
- [x] server/db.ts — query helpers
- [x] server/leads.ts — data access layer
- [x] server/crm/hubspot.ts — CRM adapter
- [x] server/routers.ts — all tRPC procedures
- [x] DB migrations applied (8 tables)
- [x] All 22 pages migrated
- [x] App.tsx — all routes with AppLayout / FullLayout
- [x] TypeScript: 0 errors
- [x] Checkpoint: 5ad35fc0

## Feature: 1-Click Offer Flow
- [x] QuickOfferModal component (pre-fills from user profile)
- [x] leads.quickOffer tRPC procedure (protected, HubSpot sync)
- [x] 1-click offer buttons on Home page (4 categories)

## Feature: Email Verification on Registration
- [x] email_verifications DB table + migration
- [x] emailVerified + emailVerifiedAt columns on users table
- [x] server/email.ts — dual HubSpot + Mailchimp transactional email
- [x] Bulgarian welcome + verify email template (dark branded)
- [x] auth.sendVerificationEmail tRPC procedure
- [x] auth.verifyEmail tRPC procedure
- [x] auth.emailVerified tRPC query
- [x] VerifyEmail page (/verify-email?token=xxx)
- [x] EmailVerificationGate component (soft banner mode in AppLayout)
- [x] Route /verify-email added to App.tsx
- [x] Checkpoint: 5ab76165

## Pending: User action required
- [ ] Add HUBSPOT_ACCESS_TOKEN in Settings → Secrets (HubSpot Private App token)
- [ ] Add HUBSPOT_FROM_EMAIL in Settings → Secrets (verified sender email)
- [ ] Add MAILCHIMP_TRANSACTIONAL_KEY in Settings → Secrets (Mandrill key, starts with "md-")
- [ ] Add MAILCHIMP_FROM_EMAIL in Settings → Secrets (verified Mailchimp sender)
- [ ] Click Publish button to deploy to tarifber24-4njaedqq.manus.space
