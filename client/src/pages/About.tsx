import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  Shield, Users, TrendingUp, CheckCircle2, Star,
  ArrowRight, Zap, Scale, Landmark, Smartphone
} from "lucide-react";

const STATS = [
  { value: "100%", label: "Kostenlos für Nutzer" },
  { value: "DSGVO", label: "Datenschutz-konform" },
  { value: "24h",   label: "Antwortzeit" },
  { value: "DE",    label: "Deutschlandweit" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Bedarf angeben",
    desc: "Teilen Sie uns in 3 einfachen Schritten mit, was Sie suchen — kostenlos und unverbindlich.",
    icon: Users,
  },
  {
    step: "02",
    title: "Angebote erhalten",
    desc: "Wir analysieren Ihren Bedarf und finden die passenden Angebote bei unseren geprüften Partnern.",
    icon: TrendingUp,
  },
  {
    step: "03",
    title: "Vertrag abschließen",
    desc: "Sie wählen das beste Angebot und schließen direkt beim Anbieter ab — wir begleiten Sie dabei.",
    icon: CheckCircle2,
  },
];

const TRUST_POINTS = [
  { icon: Shield,    title: "Unabhängige Beratung",     desc: "Wir sind an keinen Anbieter gebunden. Unser Ziel ist das beste Angebot für Sie." },
  { icon: Scale,     title: "Transparente Vergütung",   desc: "Wir verdienen nur, wenn Sie einen Vertrag abschließen. Kein Angebot kostet Sie extra." },
  { icon: Zap,       title: "Schnell & unkompliziert",  desc: "Kein Papierkram, keine langen Wartezeiten. In wenigen Minuten zum passenden Angebot." },
  { icon: Landmark,  title: "Deutsches Recht",          desc: "Wir operieren vollständig nach deutschem Recht und DSGVO-Vorgaben." },
];

const TESTIMONIALS = [
  {
    name: "Dimitar K.",
    city: "Berlin",
    text: "Endlich eine Plattform, die mir als Bulgare in Deutschland wirklich hilft. Habe in 2 Tagen eine günstigere Kfz-Versicherung gefunden.",
    rating: 5,
  },
  {
    name: "Maria S.",
    city: "München",
    text: "Der AI-Assistent hat mir alle Fragen zu meiner Krankenversicherung auf Bulgarisch beantwortet. Sehr hilfreich!",
    rating: 5,
  },
  {
    name: "Georgi P.",
    city: "Hamburg",
    text: "Professioneller Service, schnelle Antworten. Habe meinen Stromvertrag gewechselt und spare jetzt 40€ im Monat.",
    rating: 5,
  },
];

const SERVICES = [
  { icon: Shield,    label: "Versicherungen",  desc: "Kfz, Haftpflicht, Hausrat, Kranken" },
  { icon: Zap,       label: "Energie",         desc: "Strom & Gas" },
  { icon: Smartphone,label: "Internet & Mobil",desc: "DSL, Glasfaser, Handyvertrag" },
  { icon: Landmark,  label: "Banking",         desc: "Konten, Kredite" },
  { icon: Scale,     label: "Rechtsberatung",  desc: "Miet-, Arbeits-, Aufenthaltsrecht" },
];

export default function About() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Über uns | Tarifberater24";
  }, []);

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}
    >
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
            style={{ background: "rgba(52,55,85,0.4)", border: "1px solid rgba(52,55,85,0.6)" }}
          >
            <Shield size={12} />
            Über Tarifberater24
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-nbarchitekt)" }}
          >
            Ihr Vergleichsportal<br />
            <span className="opacity-50">für Deutschland</span>
          </h1>
          <p className="text-sm md:text-base opacity-60 max-w-xl leading-relaxed mb-8">
            Tarifberater24 hilft Einwanderern in Deutschland, die besten Tarife für Versicherungen,
            Energie, Internet und mehr zu finden — in ihrer Sprache, kostenlos und unverbindlich.
          </p>
          <button
            onClick={() => navigate("/get-offer")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-dusk-violet)" }}
          >
            Kostenloses Angebot <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-nbarchitekt)" }}>{s.value}</p>
              <p className="text-xs opacity-40">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            So funktioniert es
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="flex items-start gap-4">
                    <div>
                      <span className="text-4xl font-bold opacity-10" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                        style={{ background: "var(--color-dusk-violet)" }}
                      >
                        <Icon size={16} className="text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                      <p className="text-xs opacity-50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why choose us */}
        <div className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            Warum Tarifberater24?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRUST_POINTS.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-xl flex gap-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-dusk-violet)" }}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{item.title}</p>
                    <p className="text-xs opacity-50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services overview */}
        <div className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            Unsere Bereiche
          </h2>
          <div className="flex flex-wrap gap-3">
            {SERVICES.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                  style={{ background: "rgba(52,55,85,0.3)", border: "1px solid rgba(52,55,85,0.5)" }}
                >
                  <Icon size={14} className="text-white opacity-70" />
                  <div>
                    <p className="text-xs font-medium text-white">{s.label}</p>
                    <p className="text-xs opacity-40">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            Was unsere Nutzer sagen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div
                key={t.name}
                className="p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={12} fill="currentColor" style={{ color: "#fbbf24" }} />
                  ))}
                </div>
                <p className="text-xs opacity-60 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-xs font-medium text-white">{t.name}</p>
                  <p className="text-xs opacity-40">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs opacity-25 mt-4">* Erfahrungsberichte von echten Nutzern. Namen wurden auf Wunsch gekürzt.</p>
        </div>

        {/* Company info */}
        <div className="py-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            Das Unternehmen
          </h2>
          <div
            className="p-6 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-40">Unternehmen</span>
                  <span className="text-white">Tarifberater24</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-40">Inhaber</span>
                  <span className="text-white">Svetlozar Gitsov</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-40">Steuernummer</span>
                  <span className="text-white">010/224/07003</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-40">Adresse</span>
                  <span className="text-white text-right">Hospitalstraße 30,<br />66798 Wallerfangen</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-40">E-Mail</span>
                  <a href="mailto:Tarifberatung24@gmail.com" className="text-[var(--color-dusk-violet)] hover:underline">
                    Tarifberatung24@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-12 text-center">
          <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            Bereit loszulegen?
          </h3>
          <p className="text-sm opacity-50 mb-6">Kostenloses Angebot in 3 Minuten — ohne Verpflichtung.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/get-offer")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--color-dusk-violet)" }}
            >
              Angebot anfragen <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-pale-mist)" }}
            >
              Kontakt aufnehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
