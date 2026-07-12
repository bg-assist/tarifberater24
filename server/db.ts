import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users, InsertUser,
  vehicles, InsertVehicle,
  insuranceQuotes, InsertInsuranceQuote,
  newsArticles,
  newsSources,
  chatMessages,
  contracts,
  emailVerifications,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { nanoid } from "nanoid";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================
// USERS
// ============================================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;

    for (const field of textFields) {
      const value = user[field];
      if (value === undefined) continue;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUserProfile(userId: number, data: Partial<{
  name: string;
  phone: string;
  city: string;
  language: "bg" | "en" | "de";
  darkMode: boolean;
  notificationsEnabled: boolean;
}>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
  return getUserProfile(userId);
}

// ============================================================
// VEHICLES
// ============================================================
export async function getVehiclesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicles).where(eq(vehicles.userId, userId)).orderBy(desc(vehicles.createdAt));
}

export async function upsertVehicle(userId: number, data: Partial<InsertVehicle> & { make?: string; model?: string; year?: number }) {
  const db = await getDb();
  if (!db) return null;

  if (data.id) {
    const { id, ...rest } = data;
    await db.update(vehicles).set(rest).where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)));
    const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return result[0] ?? null;
  } else {
    const insertData: InsertVehicle = {
      userId,
      make: data.make!,
      model: data.model!,
      year: data.year!,
      ...data,
    };
    const result = await db.insert(vehicles).values(insertData);
    const insertId = (result as unknown as { insertId: number }).insertId;
    const rows = await db.select().from(vehicles).where(eq(vehicles.id, insertId)).limit(1);
    return rows[0] ?? null;
  }
}

// ============================================================
// INSURANCE QUOTES
// ============================================================
export async function getInsuranceQuotesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(insuranceQuotes).where(eq(insuranceQuotes.userId, userId)).orderBy(desc(insuranceQuotes.createdAt));
}

export async function createInsuranceQuote(userId: number, data: {
  vehicleId?: number;
  quoteType: "haftpflicht" | "teilkasko" | "vollkasko";
  sfKlasse?: string;
  details?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) return null;
  const insertData: InsertInsuranceQuote = {
    userId,
    quoteType: data.quoteType,
    vehicleId: data.vehicleId,
    sfKlasse: data.sfKlasse,
    details: data.details,
    status: "draft",
  };
  const result = await db.insert(insuranceQuotes).values(insertData);
  const insertId = (result as unknown as { insertId: number }).insertId;
  const rows = await db.select().from(insuranceQuotes).where(eq(insuranceQuotes.id, insertId)).limit(1);
  return rows[0] ?? null;
}

export async function updateInsuranceQuote(id: number, userId: number, data: Partial<InsertInsuranceQuote>) {
  const db = await getDb();
  if (!db) return;
  await db.update(insuranceQuotes).set(data).where(and(eq(insuranceQuotes.id, id), eq(insuranceQuotes.userId, userId)));
}

// ============================================================
// NEWS
// ============================================================
export async function getNewsArticles(
  category?: "finance" | "legal" | "community" | "insurance" | "banking" | "utilities",
  limit = 20
) {
  const db = await getDb();
  if (!db) return DEMO_NEWS;
  try {
    const rows = category
      ? await db.select().from(newsArticles).where(eq(newsArticles.category, category)).orderBy(desc(newsArticles.publishedAt)).limit(limit)
      : await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt)).limit(limit);
    return rows.length > 0 ? rows : DEMO_NEWS;
  } catch {
    return DEMO_NEWS;
  }
}

export async function getFeaturedNews(limit = 5) {
  const db = await getDb();
  if (!db) return DEMO_NEWS.filter(n => n.featured).slice(0, limit);
  try {
    const rows = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.featured, true))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
    return rows.length > 0 ? rows : DEMO_NEWS.filter(n => n.featured).slice(0, limit);
  } catch {
    return DEMO_NEWS.filter(n => n.featured).slice(0, limit);
  }
}

// ============================================================
// CHAT
// ============================================================
export async function getChatHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(desc(chatMessages.createdAt)).limit(limit);
}

export async function saveChatMessage(userId: number, role: "user" | "assistant", content: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(chatMessages).values({ userId, role, content });
}

// ============================================================
// CONTRACTS
// ============================================================
export async function getContractsByUser(userId: number) {
  const db = await getDb();
  if (!db) return DEMO_CONTRACTS;
  try {
    const rows = await db.select().from(contracts).where(eq(contracts.userId, userId)).orderBy(desc(contracts.createdAt));
    return rows.length > 0 ? rows : DEMO_CONTRACTS;
  } catch {
    return DEMO_CONTRACTS;
  }
}

// ============================================================
// DEMO DATA (fallback when DB is empty)
// ============================================================
const DEMO_NEWS = [
  {
    id: 1,
    title: "Нови правила за Kfz-Versicherung от 2025 г.",
    summary: "Bundesrat одобри промени в задължителната застраховка за автомобили. Ето какво означава за вас.",
    content: null,
    category: "insurance" as const,
    imageUrl: null,
    sourceUrl: null,
    author: "Редакция BG Assist",
    publishedAt: new Date("2025-01-15"),
    featured: true,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: 2,
    title: "Как да подадете Steuererklärung за 2024 г.",
    summary: "Пълно ръководство за данъчната декларация в Германия — стъпка по стъпка на български.",
    content: null,
    category: "finance" as const,
    imageUrl: null,
    sourceUrl: null,
    author: "Мария Иванова",
    publishedAt: new Date("2025-02-01"),
    featured: true,
    createdAt: new Date("2025-02-01"),
  },
  {
    id: 3,
    title: "Права на наемателите в Германия — Mietrecht",
    summary: "Какво трябва да знаете за наемното право, депозити и прекратяване на договори.",
    content: null,
    category: "legal" as const,
    imageUrl: null,
    sourceUrl: null,
    author: "Адв. Петров",
    publishedAt: new Date("2025-02-10"),
    featured: false,
    createdAt: new Date("2025-02-10"),
  },
  {
    id: 4,
    title: "Най-добрите мобилни оператори за българи в Германия",
    summary: "Сравнение на Telekom, Vodafone, O2 и дискаунт оператори — цени и покритие.",
    content: null,
    category: "utilities" as const,
    imageUrl: null,
    sourceUrl: null,
    author: "Технически екип",
    publishedAt: new Date("2025-02-15"),
    featured: false,
    createdAt: new Date("2025-02-15"),
  },
  {
    id: 5,
    title: "Bulgaren in Deutschland — общностна среща в Берлин",
    summary: "Ежегодната среща на българската общност в Берлин ще се проведе на 15 март.",
    content: null,
    category: "community" as const,
    imageUrl: null,
    sourceUrl: null,
    author: "Организационен комитет",
    publishedAt: new Date("2025-02-20"),
    featured: false,
    createdAt: new Date("2025-02-20"),
  },
  {
    id: 6,
    title: "Онлайн банкиране в Германия — N26, Revolut или Deutsche Bank?",
    summary: "Сравнение на основните банкови опции за имигранти — такси, условия и удобство.",
    content: null,
    category: "banking" as const,
    imageUrl: null,
    sourceUrl: null,
    author: "Финансов екип",
    publishedAt: new Date("2025-03-01"),
    featured: false,
    createdAt: new Date("2025-03-01"),
  },
];

const DEMO_CONTRACTS = [
  {
    id: 1,
    userId: 0,
    type: "insurance" as const,
    provider: "ADAC Versicherung",
    contractNumber: "KFZ-2024-88421",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-01-01"),
    monthlyAmount: 4200,
    status: "active" as const,
    notes: "Vollkasko за VW Golf",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    userId: 0,
    type: "utilities" as const,
    provider: "Vattenfall",
    contractNumber: "STROM-2024-11203",
    startDate: new Date("2024-03-01"),
    endDate: null,
    monthlyAmount: 8900,
    status: "active" as const,
    notes: "Електричество — 2-стаен апартамент",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

// ============================================================
// EMAIL VERIFICATIONS
// ============================================================

export async function createEmailVerificationToken(userId: number, email: string): Promise<string> {
  const db = await getDb();
  const token = nanoid(48);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (!db) return token; // mock mode
  await db.insert(emailVerifications).values({ userId, email, token, expiresAt });
  return token;
}

export async function verifyEmailToken(token: string): Promise<{ userId: number; email: string } | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(emailVerifications).where(eq(emailVerifications.token, token)).limit(1);
  const row = rows[0];
  if (!row || row.verifiedAt || row.expiresAt < new Date()) return null;
  await db.update(emailVerifications).set({ verifiedAt: new Date() }).where(eq(emailVerifications.token, token));
  await db.update(users).set({ emailVerified: true, emailVerifiedAt: new Date() }).where(eq(users.id, row.userId));
  return { userId: row.userId, email: row.email };
}

export async function getUserEmailVerified(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select({ emailVerified: users.emailVerified }).from(users).where(eq(users.id, userId)).limit(1);
  return rows[0]?.emailVerified ?? false;
}
