import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Shield, Zap, Smartphone, Landmark, Scale, FileText,
  MapPin, ExternalLink, Clock, CheckCircle2, AlertCircle,
  ArrowRight, Building2
} from "lucide-react";

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  insurance:  { label: "Versicherung",   icon: Shield,     color: "#343755" },
  energy:     { label: "Energie",        icon: Zap,        color: "#1e3a5f" },
  internet:   { label: "Internet",       icon: Smartphone, color: "#2d2060" },
  mobile:     { label: "Mobil",          icon: Smartphone, color: "#2a1060" },
  banking:    { label: "Banking",        icon: Landmark,   color: "#2a3060" },
  tax:        { label: "Steuer",         icon: FileText,   color: "#1a3a2a" },
  legal:      { label: "Recht",          icon: Scale,      color: "#3a2a1a" },
  relocation: { label: "Umzug",          icon: MapPin,     color: "#2a1a3a" },
  other:      { label: "Sonstiges",      icon: Building2,  color: "#2a2a2a" },
};

const URGENCY_LABELS: Record<string, string> = {
  referral_link: "Referral Link",
  affiliate:     "Affiliate",
  api:           "API",
  webhook:       "Webhook",
  manual:        "Manuell",
};

function PartnerCard({ partner }: { partner: {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  websiteUrl?: string | null;
  referralLink?: string | null;
  integrationMode?: string | null;
  approvalStatus: string;
  isActive?: boolean;
  priority?: number | null;
} }) {
  const meta = CATEGORY_META[partner.category] ?? CATEGORY_META.other;
  const Icon = meta.icon;

  return (
    <div
      className="p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: meta.color }}
          >
            <Icon size={18} className="text-white opacity-80" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{partner.name}</p>
            <p className="text-xs opacity-40">{meta.label}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {partner.isActive ? (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}
            >
              <CheckCircle2 size={10} /> Aktiv
            </span>
          ) : (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
            >
              <Clock size={10} /> Ausstehend
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {partner.description && (
        <p className="text-xs opacity-50 leading-relaxed mb-3 line-clamp-2">{partner.description}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="px-2 py-0.5 rounded-full text-xs opacity-60"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {URGENCY_LABELS[(partner.integrationMode as string) ?? "manual"] ?? partner.integrationMode ?? "Manuell"}    </span>
        <span
          className="px-2 py-0.5 rounded-full text-xs opacity-60"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {partner.approvalStatus === "approved" ? "✓ Genehmigt" :
           partner.approvalStatus === "pending"  ? "⏳ In Prüfung" :
           partner.approvalStatus === "rejected" ? "✗ Abgelehnt" : partner.approvalStatus}
        </span>
      </div>

      {/* CTA */}
      {partner.websiteUrl && (
        <a
          href={partner.referralLink ?? partner.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1.5 text-xs transition-opacity hover:opacity-100 opacity-50"
        >
          <ExternalLink size={12} />
          {partner.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
      )}
    </div>
  );
}

// ─── Placeholder partner cards for "coming soon" ─────────────────────────────

const COMING_SOON = [
  { category: "insurance", name: "Versicherungspartner", desc: "Kfz, Haftpflicht, Hausrat" },
  { category: "energy",    name: "Energieanbieter",      desc: "Strom & Gas Vergleich" },
  { category: "banking",   name: "Bankpartner",          desc: "Konten & Kredite" },
  { category: "legal",     name: "Rechtsberatung",       desc: "Mietrecht, Arbeitsrecht" },
];

export default function Partners() {
  const [, navigate] = useLocation();
  const { data: partners, isLoading } = trpc.partners.list.useQuery(undefined);

  useEffect(() => {
    document.title = "Unsere Partner | Tarifberater24";
  }, []);

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: "rgba(52,55,85,0.4)", border: "1px solid rgba(52,55,85,0.6)" }}
          >
            <Building2 size={12} />
            Partner-Netzwerk
          </div>
          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-nbarchitekt)" }}
          >
            Unsere Partner
          </h1>
          <p className="text-sm opacity-50 max-w-lg leading-relaxed">
            Wir arbeiten mit führenden deutschen Anbietern zusammen, um Ihnen die besten Tarife zu vermitteln.
            Alle Partnerschaften werden sorgfältig geprüft.
          </p>
        </div>

        {/* Active Partners */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-36 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : partners && partners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {partners.map(p => <PartnerCard key={p.id} partner={p} />)}
          </div>
        ) : null}

        {/* Coming Soon */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-2">Demnächst verfügbar</h2>
          <p className="text-sm opacity-40 mb-6">
            Weitere Partnerschaften befinden sich in der Prüfung und werden nach Genehmigung freigeschaltet.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMING_SOON.map((item) => {
              const meta = CATEGORY_META[item.category];
              const Icon = meta.icon;
              return (
                <div
                  key={item.category}
                  className="p-4 rounded-xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 opacity-40"
                    style={{ background: meta.color }}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <p className="text-xs text-white opacity-50">{item.name}</p>
                  <p className="text-xs opacity-30 mt-0.5">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="p-6 rounded-2xl text-center"
          style={{
            background: "rgba(52,55,85,0.2)",
            border: "1px solid rgba(52,55,85,0.4)",
          }}
        >
          <h3 className="text-white font-semibold mb-2">Jetzt kostenloses Angebot anfragen</h3>
          <p className="text-sm opacity-50 mb-5">
            Wir finden den passenden Partner für Ihre Bedürfnisse — kostenlos und unverbindlich.
          </p>
          <button
            onClick={() => navigate("/get-offer")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-dusk-violet)" }}
          >
            Angebot anfragen <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
