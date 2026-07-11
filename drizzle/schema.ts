import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ============================================================
// USERS
// ============================================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  language: mysqlEnum("language", ["bg", "en", "de"]).default("bg").notNull(),
  darkMode: boolean("darkMode").default(true).notNull(),
  notificationsEnabled: boolean("notificationsEnabled").default(true).notNull(),
  city: varchar("city", { length: 128 }),
  country: varchar("country", { length: 64 }).default("DE"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  emailVerifiedAt: timestamp("emailVerifiedAt"),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// VEHICLES
// ============================================================
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  make: varchar("make", { length: 64 }).notNull(),
  model: varchar("model", { length: 64 }).notNull(),
  year: int("year").notNull(),
  licensePlate: varchar("licensePlate", { length: 32 }),
  vin: varchar("vin", { length: 64 }),
  color: varchar("color", { length: 32 }),
  fuelType: mysqlEnum("fuelType", ["benzin", "diesel", "elektro", "hybrid", "gas"]).default("benzin"),
  annualMileage: int("annualMileage").default(10000),
  parkingType: mysqlEnum("parkingType", ["garage", "carport", "strasse"]).default("strasse"),
  registrationDocUrl: text("registrationDocUrl"),
  registrationDocKey: text("registrationDocKey"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

// ============================================================
// INSURANCE QUOTES
// ============================================================
export const insuranceQuotes = mysqlTable("insurance_quotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  vehicleId: int("vehicleId"),
  quoteType: mysqlEnum("quoteType", ["haftpflicht", "teilkasko", "vollkasko"]).notNull(),
  provider: varchar("provider", { length: 128 }),
  monthlyPremium: int("monthlyPremium"), // in cents
  annualPremium: int("annualPremium"),   // in cents
  sfKlasse: varchar("sfKlasse", { length: 16 }),
  status: mysqlEnum("status", ["draft", "submitted", "active", "cancelled"]).default("draft").notNull(),
  details: json("details"),
  idDocUrl: text("idDocUrl"),
  idDocKey: text("idDocKey"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InsuranceQuote = typeof insuranceQuotes.$inferSelect;
export type InsertInsuranceQuote = typeof insuranceQuotes.$inferInsert;

// ============================================================
// NEWS ARTICLES
// ============================================================
export const newsArticles = mysqlTable("news_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  category: mysqlEnum("category", ["finance", "legal", "community", "insurance", "banking", "utilities"]).notNull(),
  imageUrl: text("imageUrl"),
  sourceUrl: text("sourceUrl"),
  author: varchar("author", { length: 128 }),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

// ============================================================
// CHAT MESSAGES
// ============================================================
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// ============================================================
// CONTRACTS (active user contracts)
// ============================================================
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["insurance", "banking", "utilities", "telecom", "other"]).notNull(),
  provider: varchar("provider", { length: 128 }).notNull(),
  contractNumber: varchar("contractNumber", { length: 128 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  monthlyAmount: int("monthlyAmount"), // in cents
  status: mysqlEnum("status", ["active", "pending", "cancelled", "expired"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// ============================================================
// PARTNERS
// ============================================================
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  category: mysqlEnum("category", [
    "insurance", "energy", "internet", "mobile", "banking",
    "tax", "legal", "relocation", "other"
  ]).notNull(),
  description: text("description"),
  logoUrl: text("logoUrl"),
  websiteUrl: text("websiteUrl"),
  referralLink: text("referralLink"),
  affiliateLink: text("affiliateLink"),
  apiEndpoint: text("apiEndpoint"),
  webhookUrl: text("webhookUrl"),
  integrationMode: mysqlEnum("integrationMode", [
    "referral_link", "affiliate", "api", "webhook", "manual"
  ]).default("manual").notNull(),
  commissionType: mysqlEnum("commissionType", ["fixed", "percentage", "hybrid"]).default("fixed"),
  commissionValue: int("commissionValue"), // cents or basis points
  approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected", "suspended"]).default("pending").notNull(),
  isActive: boolean("isActive").default(false).notNull(),
  priority: int("priority").default(0),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

// ============================================================
// LEADS
// ============================================================
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  // Contact info
  firstName: varchar("firstName", { length: 64 }).notNull(),
  lastName: varchar("lastName", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  // Lead details
  category: mysqlEnum("category", [
    "insurance", "energy", "internet", "mobile", "banking",
    "tax", "legal", "relocation", "other"
  ]).notNull(),
  details: text("details"),
  budget: varchar("budget", { length: 64 }),
  urgency: mysqlEnum("urgency", ["sofort", "diese_woche", "diesen_monat", "kein_eile"]).default("diesen_monat"),
  // CRM
  hubspotContactId: varchar("hubspotContactId", { length: 64 }),
  hubspotDealId: varchar("hubspotDealId", { length: 64 }),
  crmSynced: boolean("crmSynced").default(false).notNull(),
  crmSyncedAt: timestamp("crmSyncedAt"),
  // Partner assignment
  assignedPartnerId: int("assignedPartnerId"),
  partnerSentAt: timestamp("partnerSentAt"),
  // Pipeline status
  status: mysqlEnum("status", [
    "new", "contacted", "qualified", "offer_sent",
    "negotiating", "won", "lost", "duplicate"
  ]).default("new").notNull(),
  // Commission
  commissionAmount: int("commissionAmount"), // in cents
  commissionPaid: boolean("commissionPaid").default(false),
  commissionPaidAt: timestamp("commissionPaidAt"),
  // Consent
  gdprConsent: boolean("gdprConsent").default(false).notNull(),
  affiliateConsent: boolean("affiliateConsent").default(false),
  // Source tracking
  source: varchar("source", { length: 64 }).default("web_form"),
  utmSource: varchar("utmSource", { length: 128 }),
  utmMedium: varchar("utmMedium", { length: 128 }),
  utmCampaign: varchar("utmCampaign", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================================
// EMAIL VERIFICATIONS
// ============================================================
export const emailVerifications = mysqlTable("email_verifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;
