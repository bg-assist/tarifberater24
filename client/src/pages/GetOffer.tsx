import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Shield, Zap, Smartphone,
  Landmark, FileText, Scale, User, Mail, Phone, MapPin, Loader2
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── Step schemas ────────────────────────────────────────────────────────────

const step1Schema = z.object({
  category: z.string().min(1, "Bitte wählen Sie eine Kategorie"),
});

const step2Schema = z.object({
  details: z.string().optional(),
  budget: z.string().optional(),
  urgency: z.enum(["sofort", "diese_woche", "diesen_monat", "kein_eile"]),
});

const step3Schema = z.object({
  firstName: z.string().min(2, "Vorname erforderlich"),
  lastName: z.string().min(2, "Nachname erforderlich"),
  email: z.string().email("Gültige E-Mail erforderlich"),
  phone: z.string().min(6, "Telefonnummer erforderlich"),
  city: z.string().min(2, "Stadt erforderlich"),
  consent: z.boolean().refine(v => v === true, "Bitte stimmen Sie zu"),
  affiliateConsent: z.boolean().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ─── Category options ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "insurance", icon: Shield, label: "Versicherung", desc: "Kfz, Haftpflicht, Hausrat, Kranken" },
  { id: "energy", icon: Zap, label: "Energie", desc: "Strom & Gas vergleichen" },
  { id: "internet", icon: Smartphone, label: "Internet & Mobil", desc: "DSL, Glasfaser, Handyvertrag" },
  { id: "banking", icon: Landmark, label: "Banking", desc: "Konto, Kredit, Geldanlage" },
  { id: "legal", icon: Scale, label: "Rechtsberatung", desc: "Mietrecht, Arbeitsrecht, Aufenthaltsrecht" },
  { id: "documents", icon: FileText, label: "Dokumente & Behörden", desc: "Anmeldung, Visa, Genehmigungen" },
];

const URGENCY_OPTIONS = [
  { value: "sofort", label: "Sofort" },
  { value: "diese_woche", label: "Diese Woche" },
  { value: "diesen_monat", label: "Diesen Monat" },
  { value: "kein_eile", label: "Kein Eile" },
];

// ─── Progress indicator ───────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs opacity-50">Schritt {step} von {total}</span>
        <span className="text-xs opacity-50">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{
            width: `${(step / total) * 100}%`,
            background: "var(--color-dusk-violet)",
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i < step ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GetOffer() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitLead = trpc.leads.submit.useMutation();

  useEffect(() => {
    document.title = "Angebot anfragen | Tarifberater24";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // ── Step 1: Category ────────────────────────────────────────────────────────
  const { register: reg1, handleSubmit: hs1, formState: { errors: e1 }, setValue: sv1, watch: w1 } =
    useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: formData });

  const selectedCategory = w1("category");

  function onStep1(data: Step1Data) {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  }

  // ── Step 2: Details ─────────────────────────────────────────────────────────
  const { register: reg2, handleSubmit: hs2, formState: { errors: e2 }, setValue: sv2, watch: w2 } =
    useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: { urgency: "diesen_monat", ...formData } });

  const selectedUrgency = w2("urgency");

  function onStep2(data: Step2Data) {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  }

  // ── Step 3: Contact ─────────────────────────────────────────────────────────
  const { register: reg3, handleSubmit: hs3, formState: { errors: e3 } } =
    useForm<Step3Data>({ resolver: zodResolver(step3Schema), defaultValues: formData });

  async function onStep3(data: Step3Data) {
    setIsSubmitting(true);
    setSubmitError(null);
    const payload = { ...formData, ...data };
    try {
      await submitLead.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
          category: (formData.category ?? "other") as "insurance" | "energy" | "internet" | "mobile" | "banking" | "tax" | "legal" | "relocation" | "other",
        details: formData.details ?? "",
        budget: formData.budget ?? "",
        urgency: formData.urgency ?? "diesen_monat",
        affiliateConsent: data.affiliateConsent ?? false,
      });
      setSubmitSuccess(true);
      setCurrentStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all focus:ring-1";
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-void-canvas)" }}>
      <div className="max-w-xl mx-auto px-6 py-12">

        {/* Back */}
        {currentStep < 4 && (
          <button
            onClick={() => currentStep === 1 ? navigate("/") : setCurrentStep(s => s - 1)}
            className="flex items-center gap-2 mb-8 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-pale-mist)" }}
          >
            <ArrowLeft size={16} />
            {currentStep === 1 ? "Zurück zur Startseite" : "Zurück"}
          </button>
        )}

        {/* Header */}
        {currentStep < 4 && (
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-nbarchitekt)" }}
            >
              Kostenloses Angebot
            </h1>
            <p className="text-sm opacity-50">
              In 3 Schritten zum passenden Angebot — kostenlos und unverbindlich.
            </p>
          </div>
        )}

        {/* Progress */}
        {currentStep < 4 && <ProgressBar step={currentStep} total={3} />}

        {/* ── STEP 1: Category ── */}
        {currentStep === 1 && (
          <form onSubmit={hs1(onStep1)} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Welchen Bereich möchten Sie vergleichen?</h2>
              <p className="text-sm opacity-50 mb-5">Wählen Sie eine Kategorie aus.</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => sv1("category", cat.id)}
                      className="p-4 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: isSelected ? "rgba(52,55,85,0.6)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isSelected ? "rgba(52,55,85,1)" : "rgba(255,255,255,0.08)"}`,
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      <Icon
                        size={20}
                        className="mb-2"
                        style={{ color: isSelected ? "white" : "rgba(255,255,255,0.4)" }}
                      />
                      <p className="text-sm font-medium text-white">{cat.label}</p>
                      <p className="text-xs opacity-50 mt-0.5">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>
              {e1.category && <p className="text-red-400 text-xs mt-2">{e1.category.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "var(--color-dusk-violet)" }}
            >
              Weiter <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ── STEP 2: Details ── */}
        {currentStep === 2 && (
          <form onSubmit={hs2(onStep2)} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Erzählen Sie uns mehr</h2>
              <p className="text-sm opacity-50 mb-5">
                Kategorie: <span className="text-white">{CATEGORIES.find(c => c.id === formData.category)?.label}</span>
              </p>

              {/* Details */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-white mb-2 opacity-70">
                  Was genau suchen Sie? (optional)
                </label>
                <textarea
                  {...reg2("details")}
                  rows={3}
                  placeholder="z.B. Ich suche eine günstige Kfz-Versicherung für ein 3 Jahre altes Auto..."
                  className={inputClass}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              {/* Budget */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-white mb-2 opacity-70">
                  Monatliches Budget (optional)
                </label>
                <input
                  {...reg2("budget")}
                  type="text"
                  placeholder="z.B. bis 50€/Monat"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-medium text-white mb-2 opacity-70">
                  Wie dringend ist Ihr Anliegen?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {URGENCY_OPTIONS.map(opt => {
                    const isSelected = selectedUrgency === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => sv2("urgency", opt.value as Step2Data["urgency"])}
                        className="py-2.5 px-4 rounded-xl text-sm transition-all"
                        style={{
                          background: isSelected ? "rgba(52,55,85,0.6)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isSelected ? "rgba(52,55,85,1)" : "rgba(255,255,255,0.08)"}`,
                          color: isSelected ? "white" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "var(--color-dusk-violet)" }}
            >
              Weiter <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ── STEP 3: Contact ── */}
        {currentStep === 3 && (
          <form onSubmit={hs3(onStep3)} className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Ihre Kontaktdaten</h2>
              <p className="text-sm opacity-50 mb-5">
                Wir verwenden Ihre Daten ausschließlich zur Angebotserstellung.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5 opacity-70">Vorname *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                      {...reg3("firstName")}
                      type="text"
                      placeholder="Max"
                      className={`${inputClass} pl-9`}
                      style={inputStyle}
                    />
                  </div>
                  {e3.firstName && <p className="text-red-400 text-xs mt-1">{e3.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5 opacity-70">Nachname *</label>
                  <input
                    {...reg3("lastName")}
                    type="text"
                    placeholder="Mustermann"
                    className={inputClass}
                    style={inputStyle}
                  />
                  {e3.lastName && <p className="text-red-400 text-xs mt-1">{e3.lastName.message}</p>}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-white mb-1.5 opacity-70">E-Mail *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    {...reg3("email")}
                    type="email"
                    placeholder="max@beispiel.de"
                    className={`${inputClass} pl-9`}
                    style={inputStyle}
                  />
                </div>
                {e3.email && <p className="text-red-400 text-xs mt-1">{e3.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5 opacity-70">Telefon *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                      {...reg3("phone")}
                      type="tel"
                      placeholder="+49 ..."
                      className={`${inputClass} pl-9`}
                      style={inputStyle}
                    />
                  </div>
                  {e3.phone && <p className="text-red-400 text-xs mt-1">{e3.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5 opacity-70">Stadt *</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                      {...reg3("city")}
                      type="text"
                      placeholder="Berlin"
                      className={`${inputClass} pl-9`}
                      style={inputStyle}
                    />
                  </div>
                  {e3.city && <p className="text-red-400 text-xs mt-1">{e3.city.message}</p>}
                </div>
              </div>

              {/* Consents */}
              <div className="space-y-3 mt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...reg3("consent")}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded"
                    style={{ accentColor: "var(--color-dusk-violet)" }}
                  />
                  <span className="text-xs opacity-60 leading-relaxed">
                    Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                    <a href="/datenschutz" className="underline hover:opacity-100" target="_blank">Datenschutzerklärung</a>{" "}
                    zu. *
                  </span>
                </label>
                {e3.consent && <p className="text-red-400 text-xs">{e3.consent.message}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...reg3("affiliateConsent")}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded"
                    style={{ accentColor: "var(--color-dusk-violet)" }}
                  />
                  <span className="text-xs opacity-60 leading-relaxed">
                    Ich bin damit einverstanden, dass meine Daten zur Angebotserstellung an Partnerunternehmen weitergegeben werden. (optional)
                  </span>
                </label>
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl text-sm text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--color-dusk-violet)" }}
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Wird gesendet...</>
              ) : (
                <>Kostenloses Angebot anfordern <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-xs opacity-30 text-center">
              Kostenlos & unverbindlich · Kein Spam · DSGVO-konform
            </p>
          </form>
        )}

        {/* ── STEP 4: Success ── */}
        {currentStep === 4 && (
          <div className="text-center py-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(52,55,85,0.4)", border: "2px solid var(--color-dusk-violet)" }}
            >
              <CheckCircle2 size={36} style={{ color: "var(--color-dusk-violet)" }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
              Anfrage erfolgreich!
            </h2>
            <p className="text-sm opacity-60 leading-relaxed mb-8 max-w-sm mx-auto">
              Vielen Dank für Ihre Anfrage. Wir haben Ihre Daten erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
            </p>

            <div
              className="p-5 rounded-xl text-left mb-8"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-semibold text-white uppercase tracking-widest mb-3 opacity-60">Ihre Anfrage</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-50">Kategorie</span>
                  <span className="text-white">{CATEGORIES.find(c => c.id === formData.category)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-50">Dringlichkeit</span>
                  <span className="text-white">{URGENCY_OPTIONS.find(u => u.value === formData.urgency)?.label}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--color-dusk-violet)" }}
              >
                Zurück zur Startseite
              </button>
              <button
                onClick={() => navigate("/assistant")}
                className="w-full py-3 px-6 rounded-xl text-sm transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-pale-mist)" }}
              >
                AI-Assistent fragen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
