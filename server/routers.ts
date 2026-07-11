import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { submitLeadToCrm } from "./crm/hubspot";
import {
  createLead,
  updateLeadCrmSync,
  getActivePartners,
  getAllPartners,
  DEMO_PARTNERS,
  createPartner,
} from "./leads";
import {
  getVehiclesByUser,
  upsertVehicle,
  getInsuranceQuotesByUser,
  createInsuranceQuote,
  updateInsuranceQuote,
  getNewsArticles,
  getChatHistory,
  saveChatMessage,
  getContractsByUser,
  getUserProfile,
  updateUserProfile,
  createEmailVerificationToken,
  verifyEmailToken,
  getUserEmailVerified,
} from "./db";
import { sendWelcomeVerificationEmail } from "./email";
import { TRPCError } from "@trpc/server";

// ============================================================
// ROOT ROUTER
// ============================================================
export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    sendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
      const user = ctx.user;
      if (!user.email) throw new TRPCError({ code: "BAD_REQUEST", message: "Нямате имейл адрес." });
      const alreadyVerified = await getUserEmailVerified(user.id);
      if (alreadyVerified) return { success: true, alreadyVerified: true };
      const token = await createEmailVerificationToken(user.id, user.email);
      await sendWelcomeVerificationEmail({ to: user.email, name: user.name ?? "Потребител", verifyToken: token });
      return { success: true, alreadyVerified: false };
    }),
    verifyEmail: publicProcedure
      .input(z.object({ token: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const result = await verifyEmailToken(input.token);
        if (!result) throw new TRPCError({ code: "BAD_REQUEST", message: "Невалиден или изтекъл линк." });
        return { success: true, email: result.email };
      }),
    emailVerified: protectedProcedure.query(async ({ ctx }) => {
      const verified = await getUserEmailVerified(ctx.user.id);
      return { verified };
    }),
  }),

  // ============================================================
  // PROFILE
  // ============================================================
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getUserProfile(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        language: z.enum(["bg", "en", "de"]).optional(),
        darkMode: z.boolean().optional(),
        notificationsEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return updateUserProfile(ctx.user.id, input);
      }),
  }),

  // ============================================================
  // VEHICLES
  // ============================================================
  vehicles: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getVehiclesByUser(ctx.user.id);
    }),
    save: protectedProcedure
      .input(z.object({
        id: z.number().optional(),
        make: z.string().min(1),
        model: z.string().min(1),
        year: z.number().min(1900).max(2030),
        licensePlate: z.string().optional(),
        vin: z.string().optional(),
        color: z.string().optional(),
        fuelType: z.enum(["benzin", "diesel", "elektro", "hybrid", "gas"]).optional(),
        annualMileage: z.number().optional(),
        parkingType: z.enum(["garage", "carport", "strasse"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return upsertVehicle(ctx.user.id, input);
      }),
  }),

  // ============================================================
  // INSURANCE
  // ============================================================
  insurance: router({
    quotes: protectedProcedure.query(async ({ ctx }) => {
      return getInsuranceQuotesByUser(ctx.user.id);
    }),
    createQuote: protectedProcedure
      .input(z.object({
        vehicleId: z.number().optional(),
        quoteType: z.enum(["haftpflicht", "teilkasko", "vollkasko"]),
        sfKlasse: z.string().optional(),
        details: z.record(z.string(), z.unknown()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createInsuranceQuote(ctx.user.id, input);
      }),
    uploadDoc: protectedProcedure
      .input(z.object({
        quoteId: z.number(),
        docType: z.enum(["registration", "id"]),
        fileName: z.string(),
        fileBase64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.fileBase64, "base64");
        const key = `user-${ctx.user.id}/insurance-${input.quoteId}/${input.docType}-${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(key, buffer as Buffer, input.mimeType);
        await updateInsuranceQuote(input.quoteId, ctx.user.id, {
          ...(input.docType === "id" ? { idDocUrl: url, idDocKey: key } : {}),
        });
        return { url, key };
      }),
    uploadVehicleDoc: protectedProcedure
      .input(z.object({
        vehicleId: z.number(),
        fileName: z.string(),
        fileBase64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.fileBase64, "base64");
        const key = `user-${ctx.user.id}/vehicle-${input.vehicleId}/reg-${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(key, buffer as Buffer, input.mimeType);
        await upsertVehicle(ctx.user.id, {
          id: input.vehicleId,
          registrationDocUrl: url,
          registrationDocKey: key,
        } as Parameters<typeof upsertVehicle>[1]);
        return { url, key };
      }),
  }),

  // ============================================================
  // NEWS
  // ============================================================
  news: router({
    list: publicProcedure
      .input(z.object({
        category: z.enum(["finance", "legal", "community", "insurance", "banking", "utilities", "all"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      }))
      .query(async ({ input }) => {
        return getNewsArticles(input.category === "all" ? undefined : input.category, input.limit);
      }),
  }),

  // ============================================================
  // CONTRACTS
  // ============================================================
  contracts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getContractsByUser(ctx.user.id);
    }),
  }),

  // ============================================================
  // AI ASSISTANT — LLM WIRED
  // ============================================================
  assistant: router({
    history: protectedProcedure.query(async ({ ctx }) => {
      return getChatHistory(ctx.user.id, 50);
    }),
    chat: protectedProcedure
      .input(z.object({
        message: z.string().min(1).max(2000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await saveChatMessage(ctx.user.id, "user", input.message);

        const systemPrompt = `Ти си BG Assist — AI асистент за българи, живеещи в Германия.
Помагаш с въпроси относно:
- Застраховки (Kfz-Versicherung, Haftpflicht, Hausrat, Krankenversicherung)
- Банкиране и финанси в Германия
- Комунални услуги (Strom, Gas, Internet)
- Телекомуникации (мобилни договори)
- Правни въпроси (Mietrecht, Arbeitsrecht, Aufenthaltsrecht)
- Документи и бюрокрация
- Данъци (Steuererklärung)
- Здравно осигуряване (GKV, PKV)

Отговаряй ВИНАГИ на български език, освен ако потребителят не поиска друг език.
Бъди конкретен, полезен и приятелски настроен.
Когато е подходящо, давай конкретни стъпки и препоръки.
Не давай юридически или медицински съвети — препоръчвай консултация с специалист.`;

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...(input.history || []).slice(-10).map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({ messages });
        const rawContent = response?.choices?.[0]?.message?.content;
        const assistantContent: string = typeof rawContent === "string" ? rawContent : "Съжалявам, не успях да обработя заявката. Моля, опитайте отново.";

        // Save assistant response
        await saveChatMessage(ctx.user.id, "assistant", assistantContent);

        return { content: assistantContent };
      }),
  }),

  // ============================================================
  // LEADS — public form submission + CRM sync
  // ============================================================
  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(2).max(64),
          lastName: z.string().min(2).max(64),
          email: z.string().email().max(320),
          phone: z.string().min(6).max(32),
          city: z.string().min(2).max(128),
          category: z.enum(["insurance", "energy", "internet", "mobile", "banking", "tax", "legal", "relocation", "other"]),
          details: z.string().max(2000).optional(),
          budget: z.string().max(64).optional(),
          urgency: z.enum(["sofort", "diese_woche", "diesen_monat", "kein_eile"]),
          affiliateConsent: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // 1. Save to DB
        await createLead({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          city: input.city,
          category: input.category,
          details: input.details,
          budget: input.budget,
          urgency: input.urgency,
          gdprConsent: true,
          affiliateConsent: input.affiliateConsent ?? false,
          status: "new",
          source: "web_form",
        });

        // 2. Sync to HubSpot CRM (non-blocking — don't fail if CRM is down)
        try {
          const crmResult = await submitLeadToCrm({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            city: input.city,
            category: input.category,
            details: input.details,
            budget: input.budget,
            urgency: input.urgency,
            affiliateConsent: input.affiliateConsent ?? false,
          });
          console.log(`[CRM] Lead synced via ${crmResult.mode}:`, crmResult.contactId ?? "mock");
        } catch (err) {
          console.error("[CRM] Non-fatal sync error:", err);
        }

        return { success: true };
      }),

    quickOffer: protectedProcedure
      .input(z.object({
        category: z.enum(["insurance","energy","internet","mobile","banking","tax","legal","relocation","other"]),
        details: z.string().max(2000).optional(),
        urgency: z.enum(["sofort","diese_woche","diesen_monat","kein_eile"]).default("diesen_monat"),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = ctx.user;
        const nameParts = (user.name ?? "Потребител").split(" ");
        const firstName = nameParts[0] ?? "Потребител";
        const lastName = nameParts.slice(1).join(" ") || "-";
        await createLead({
          firstName,
          lastName,
          email: user.email ?? "",
          phone: "",
          city: "",
          category: input.category,
          details: input.details,
          urgency: input.urgency,
          gdprConsent: true,
          affiliateConsent: false,
          status: "new",
          source: "quick_offer",
        });
        try {
          await submitLeadToCrm({ firstName, lastName, email: user.email ?? "", phone: "", city: "", category: input.category, details: input.details, urgency: input.urgency, affiliateConsent: false });
        } catch (err) {
          console.error("[CRM] quickOffer sync error:", err);
        }
        return { success: true };
      }),
  }),

  // ============================================================
  // PARTNERS — public read, future admin write
  // ============================================================
  partners: router({
    list: publicProcedure
      .input(z.object({
        category: z.enum(["insurance", "energy", "internet", "mobile", "banking", "tax", "legal", "relocation", "other"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        const rows = await getActivePartners(input?.category);
        // Return demo data if DB is empty
        if (rows.length === 0) {
          return DEMO_PARTNERS.map((p, i) => ({ ...p, id: i + 1, integrationMode: p.integrationMode ?? "manual" as const, approvalStatus: p.approvalStatus ?? "pending" as const, createdAt: new Date(), updatedAt: new Date() }));
        }
        return rows;
      }),

    seed: publicProcedure.mutation(async () => {
      // Seed demo partners — idempotent
      for (const p of DEMO_PARTNERS) {
        try {
          await createPartner(p);
        } catch {
          // ignore duplicate slug errors
        }
      }
      return { seeded: DEMO_PARTNERS.length };
    }),
  }),
});

export type AppRouter = typeof appRouter;
