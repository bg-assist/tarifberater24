import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submitMutation = trpc.leads.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  useEffect(() => {
    document.title = "Kontakt | Tarifberater24";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameParts = form.name.trim().split(" ");
    const firstName = nameParts[0] ?? "Kontakt";
    const lastName = nameParts.slice(1).join(" ") || "-";
    submitMutation.mutate({
      firstName,
      lastName,
      email: form.email,
      phone: "-",
      city: "-",
      category: "other",
      details: `[${form.subject}] ${form.message}`,
      urgency: "kein_eile",
      affiliateConsent: false,
    });
  }

  const loading = submitMutation.isPending;

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all focus:ring-1 focus:ring-[var(--color-dusk-violet)]";
  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };

  return (
    <main className="premium-page premium-support-page">
      <div className="premium-support-shell">

        <div className="premium-support-heading">
          <span className="premium-eyebrow">Persönlicher Support</span>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-nbarchitekt)" }}
          >
            Kontakt
          </h1>
          <p className="text-sm opacity-50">
            Wir helfen Ihnen gerne — auf Deutsch, Bulgarisch oder Englisch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Contact info */}
          <div className="md:col-span-2 space-y-4">
            <div
              className="premium-contact-card"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--color-dusk-violet)" }}
              >
                <Mail size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs opacity-40 mb-1">E-Mail</p>
                <a
                  href="mailto:Tarifberatung24@gmail.com"
                  className="text-sm text-white hover:underline"
                >
                  Tarifberatung24@gmail.com
                </a>
              </div>
            </div>

            <div
              className="premium-contact-card"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--color-dusk-violet)" }}
              >
                <Phone size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs opacity-40 mb-1">Telefon</p>
                <a
                  href="tel:+4915255234853"
                  className="text-sm text-white hover:underline"
                >
                  +49 15255234853
                </a>
              </div>
            </div>

            <div
              className="premium-contact-card"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--color-dusk-violet)" }}
              >
                <MapPin size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs opacity-40 mb-1">Adresse</p>
                <p className="text-sm text-white">
                  Hospitalstraße 30<br />
                  66798 Wallerfangen<br />
                  Deutschland
                </p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(52,55,85,0.2)", border: "1px solid rgba(52,55,85,0.4)" }}
            >
              <p className="text-xs opacity-60 leading-relaxed">
                <strong className="text-white">Antwortzeit:</strong> In der Regel innerhalb von 24 Stunden an Werktagen.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div
                className="premium-contact-success"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "rgba(52,55,85,0.4)", border: "2px solid var(--color-dusk-violet)" }}
                >
                  <CheckCircle2 size={28} style={{ color: "var(--color-dusk-violet)" }} />
                </div>
                <h3 className="text-white font-semibold mb-2">Nachricht gesendet!</h3>
                <p className="text-sm opacity-50 mb-6">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
                <button
                  onClick={() => navigate("/")}
                  className="premium-button"
                  style={{ background: "var(--color-dusk-violet)" }}
                >
                  Zurück zur Startseite <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="premium-contact-form"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs opacity-50 mb-1.5">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Max Mustermann"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs opacity-50 mb-1.5">E-Mail *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="max@beispiel.de"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs opacity-50 mb-1.5">Betreff</label>
                  <input
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Wie können wir helfen?"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs opacity-50 mb-1.5">Nachricht *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Ihre Nachricht..."
                    className={inputClass}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="premium-button premium-submit"
                  style={{ background: "var(--color-dusk-violet)" }}
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Wird gesendet...</>
                  ) : (
                    <>Nachricht senden <ArrowRight size={16} /></>
                  )}
                </button>

                <p className="text-xs opacity-30 text-center">
                  Ihre Daten werden gemäß unserer{" "}
                  <button type="button" onClick={() => navigate("/datenschutz")} className="underline">
                    Datenschutzerklärung
                  </button>{" "}
                  verarbeitet.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
