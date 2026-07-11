/**
 * HubSpot CRM Integration
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture: Adapter pattern — all CRM calls go through this module.
 * Future CRMs (Pipedrive, Salesforce, etc.) can be swapped here without
 * touching business logic.
 *
 * Integration mode: HubSpot Forms API (no OAuth required for lead capture).
 * When HUBSPOT_ACCESS_TOKEN is set, we also use the Contacts & Deals API
 * for richer CRM data. Without it, we fall back to Forms API only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const HUBSPOT_BASE = "https://api.hubapi.com";
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const FORM_GUID = process.env.HUBSPOT_FORM_GUID;

export interface CrmLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  details?: string;
  budget?: string;
  urgency: string;
  affiliateConsent: boolean;
}

export interface CrmResult {
  success: boolean;
  contactId?: string;
  dealId?: string;
  error?: string;
  mode: "api" | "form" | "mock";
}

// ─── HubSpot Contacts API ─────────────────────────────────────────────────────

async function createOrUpdateContact(payload: CrmLeadPayload): Promise<{ id: string }> {
  const body = {
    properties: {
      firstname: payload.firstName,
      lastname: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      // Custom properties (must be created in HubSpot portal first)
      lead_category: payload.category,
      lead_details: payload.details ?? "",
      lead_budget: payload.budget ?? "",
      lead_urgency: payload.urgency,
      affiliate_consent: String(payload.affiliateConsent),
      lead_source: "Tarifberater24 Web Form",
    },
  };

  // Try to find existing contact first
  const searchRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: payload.email }] }],
      properties: ["id", "email"],
      limit: 1,
    }),
  });

  if (searchRes.ok) {
    const searchData = await searchRes.json() as { results?: Array<{ id: string }> };
    if (searchData.results && searchData.results.length > 0) {
      // Update existing
      const existingId = searchData.results[0].id;
      await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/${existingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      return { id: existingId };
    }
  }

  // Create new
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot contact creation failed: ${err}`);
  }

  const data = await res.json() as { id: string };
  return { id: data.id };
}

async function createDeal(contactId: string, payload: CrmLeadPayload): Promise<{ id: string }> {
  const categoryLabels: Record<string, string> = {
    insurance: "Versicherung",
    energy: "Energie",
    internet: "Internet & Mobil",
    banking: "Banking",
    legal: "Rechtsberatung",
    documents: "Dokumente",
    mobile: "Mobil",
    tax: "Steuer",
    relocation: "Umzug",
  };

  const dealBody = {
    properties: {
      dealname: `${payload.firstName} ${payload.lastName} — ${categoryLabels[payload.category] ?? payload.category}`,
      pipeline: "default",
      dealstage: "appointmentscheduled",
      amount: "",
      closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lead_category: payload.category,
      lead_urgency: payload.urgency,
    },
  };

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(dealBody),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot deal creation failed: ${err}`);
  }

  const data = await res.json() as { id: string };

  // Associate deal with contact
  await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals/${data.id}/associations/contacts/${contactId}/deal_to_contact`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });

  return { id: data.id };
}

// ─── HubSpot Forms API (fallback, no auth needed) ────────────────────────────

async function submitViaForm(payload: CrmLeadPayload): Promise<void> {
  if (!PORTAL_ID || !FORM_GUID) {
    throw new Error("HUBSPOT_PORTAL_ID and HUBSPOT_FORM_GUID must be set for Forms API");
  }

  const fields = [
    { name: "firstname", value: payload.firstName },
    { name: "lastname", value: payload.lastName },
    { name: "email", value: payload.email },
    { name: "phone", value: payload.phone },
    { name: "city", value: payload.city },
    { name: "message", value: `Kategorie: ${payload.category}\nBudget: ${payload.budget ?? "k.A."}\nDringlichkeit: ${payload.urgency}\n\n${payload.details ?? ""}` },
  ];

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: { pageUri: "https://tarifberater24.de/get-offer", pageName: "Get an Offer" },
        legalConsentOptions: {
          consent: {
            consentToProcess: true,
            text: "I agree to allow Tarifberater24 to store and process my personal data.",
            communications: [{ value: payload.affiliateConsent, subscriptionTypeId: 999, text: "Partner offers" }],
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot form submission failed: ${err}`);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function submitLeadToCrm(payload: CrmLeadPayload): Promise<CrmResult> {
  // Mode 1: Full API (access token available)
  if (ACCESS_TOKEN) {
    try {
      const contact = await createOrUpdateContact(payload);
      const deal = await createDeal(contact.id, payload);
      return { success: true, contactId: contact.id, dealId: deal.id, mode: "api" };
    } catch (err) {
      console.error("[HubSpot API] Error:", err);
      // Fall through to form fallback
    }
  }

  // Mode 2: Forms API (portal ID + form GUID available)
  if (PORTAL_ID && FORM_GUID) {
    try {
      await submitViaForm(payload);
      return { success: true, mode: "form" };
    } catch (err) {
      console.error("[HubSpot Form] Error:", err);
    }
  }

  // Mode 3: Mock (development — log to console, return success)
  console.log("[CRM MOCK] Lead received:", {
    name: `${payload.firstName} ${payload.lastName}`,
    email: payload.email,
    category: payload.category,
    urgency: payload.urgency,
  });
  return { success: true, mode: "mock" };
}
