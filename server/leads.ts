/**
 * Lead & Partner data access layer
 * All DB operations for leads and partners go through this module.
 */

import { getDb } from "./db";
import { leads, partners, type InsertLead, type InsertPartner } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

// ─── LEADS ────────────────────────────────────────────────────────────────────

export async function createLead(data: InsertLead): Promise<{ id: number } | null> {
  const db = await getDb();
  if (!db) {
    console.error("[DB] No connection — lead persistence failed");
    return null;
  }

  const [row] = await db.insert(leads).values(data).$returningId();
  return row ?? null;
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(leads).where(eq(leads.id, id));
  return row ?? null;
}

export async function updateLeadCrmSync(
  id: number,
  hubspotContactId?: string,
  hubspotDealId?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(leads)
    .set({
      hubspotContactId: hubspotContactId ?? null,
      hubspotDealId: hubspotDealId ?? null,
      crmSynced: true,
      crmSyncedAt: new Date(),
    })
    .where(eq(leads.id, id));

  return true;
}

export async function updateLeadStatus(
  id: number,
  status: InsertLead["status"]
) {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

export async function assignLeadToPartner(id: number, partnerId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(leads)
    .set({ assignedPartnerId: partnerId, partnerSentAt: new Date() })
    .where(eq(leads.id, id));
}

export async function getLeadsByStatus(status?: InsertLead["status"], limit = 50) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db
      .select()
      .from(leads)
      .where(eq(leads.status, status))
      .orderBy(desc(leads.createdAt))
      .limit(limit);
  }
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}

// ─── PARTNERS ──────────────────────────────────────────────────────────────────────────────

export async function createPartner(data: InsertPartner) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.insert(partners).values(data);
  return row;
}

export async function getPartnerBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(partners).where(eq(partners.slug, slug));
  return row ?? null;
}

export async function getActivePartners(category?: InsertPartner["category"]) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db
      .select()
      .from(partners)
      .where(and(eq(partners.isActive, true), eq(partners.category, category)))
      .orderBy(desc(partners.priority));
  }
  return db
    .select()
    .from(partners)
    .where(eq(partners.isActive, true))
    .orderBy(desc(partners.priority));
}

export async function getAllPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).orderBy(desc(partners.createdAt));
}

export async function updatePartnerApproval(
  id: number,
  approvalStatus: InsertPartner["approvalStatus"],
  isActive: boolean
) {
  const db = await getDb();
  if (!db) return;
  await db.update(partners).set({ approvalStatus, isActive }).where(eq(partners.id, id));
}

// ─── SEED: Demo partners (called once on first deploy) ────────────────────────

export const DEMO_PARTNERS: InsertPartner[] = [
  {
    name: "CHECK24",
    slug: "check24",
    category: "insurance",
    description: "Deutschlands größtes Vergleichsportal für Versicherungen, Energie und mehr.",
    websiteUrl: "https://www.check24.de",
    referralLink: "https://www.check24.de/?ref=tarifberater24",
    integrationMode: "referral_link",
    approvalStatus: "pending",
    isActive: false,
    priority: 100,
  },
  {
    name: "Verivox",
    slug: "verivox",
    category: "energy",
    description: "Unabhängiger Vergleich für Strom, Gas, Internet und Versicherungen.",
    websiteUrl: "https://www.verivox.de",
    referralLink: "https://www.verivox.de/?ref=tarifberater24",
    integrationMode: "referral_link",
    approvalStatus: "pending",
    isActive: false,
    priority: 90,
  },
  {
    name: "N26",
    slug: "n26",
    category: "banking",
    description: "Modernes Banking ohne Filiale — ideal für Einwanderer in Deutschland.",
    websiteUrl: "https://n26.com/de-de",
    referralLink: "https://n26.com/de-de/refer",
    integrationMode: "referral_link",
    approvalStatus: "pending",
    isActive: false,
    priority: 80,
  },
  {
    name: "Tarifcheck",
    slug: "tarifcheck",
    category: "internet",
    description: "Internet- und Handyverträge vergleichen und wechseln.",
    websiteUrl: "https://www.tarifcheck.de",
    referralLink: "https://www.tarifcheck.de/?ref=tarifberater24",
    integrationMode: "referral_link",
    approvalStatus: "pending",
    isActive: false,
    priority: 70,
  },
];
