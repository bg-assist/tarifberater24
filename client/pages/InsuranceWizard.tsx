import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Upload, ChevronRight, ChevronLeft, Check, Car,
  User, FileText, Shield, Star, Info
} from "lucide-react";

type WizardStep = 1 | 2 | 3 | 4;

interface VehicleForm {
  make: string;
  model: string;
  year: number;
  fuelType: "benzin" | "diesel" | "elektro" | "hybrid" | "gas";
  annualMileage: number;
  parkingType: "garage" | "carport" | "strasse";
  licensePlate: string;
}

interface UserForm {
  sfKlasse: string;
  birthYear: number;
  postalCode: string;
  quoteType: "haftpflicht" | "teilkasko" | "vollkasko";
}

const INSURANCE_PLANS = [
  {
    id: "haftpflicht",
    name: "Haftpflicht",
    nameBg: "Задължителна",
    price: "от 18€/мес",
    desc: "Покрива щети, нанесени на трети лица.",
    pros: ["Задължителна по закон", "Ниска цена", "Покрива щети на трети лица"],
    cons: ["Не покрива собствения автомобил", "Без защита при кражба"],
    recommended: false,
    color: "#1e3a5f",
  },
  {
    id: "teilkasko",
    name: "Teilkasko",
    nameBg: "Частична каско",
    price: "от 42€/мес",
    desc: "Haftpflicht + природни бедствия, кражба, пожар.",
    pros: ["Покрива кражба и пожар", "Природни бедствия", "Добра цена/качество"],
    cons: ["Не покрива собствена вина", "Без покритие при катастрофа по ваша вина"],
    recommended: true,
    color: "#343755",
  },
  {
    id: "vollkasko",
    name: "Vollkasko",
    nameBg: "Пълна каско",
    price: "от 89€/мес",
    desc: "Пълно покритие — включително щети по ваша вина.",
    pros: ["Пълно покритие", "Включва собствена вина", "Покрива вандализъм"],
    cons: ["По-висока цена", "Франшиза при щети"],
    recommended: false,
    color: "#2a3060",
  },
];

const SF_KLASSEN = ["SF 0", "SF 1/2", "SF 1", "SF 2", "SF 3", "SF 4", "SF 5", "SF 6", "SF 7", "SF 8", "SF 9", "SF 10", "SF 11", "SF 12", "SF 13", "SF 14", "SF 15", "SF 16", "SF 17", "SF 18", "SF 19", "SF 20", "SF 21", "SF 22", "SF 23", "SF 24", "SF 25", "SF 26", "SF 27", "SF 28", "SF 29", "SF 30", "SF 31", "SF 32", "SF 33", "SF 34", "SF 35", "SF M"];

export default function InsuranceWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [, navigate] = useLocation();
  const regDocRef = useRef<HTMLInputElement>(null);
  const idDocRef = useRef<HTMLInputElement>(null);

  const [regDocFile, setRegDocFile] = useState<File | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("teilkasko");

  const [vehicleForm, setVehicleForm] = useState<VehicleForm>({
    make: "",
    model: "",
    year: 2020,
    fuelType: "benzin",
    annualMileage: 10000,
    parkingType: "strasse",
    licensePlate: "",
  });

  const [userForm, setUserForm] = useState<UserForm>({
    sfKlasse: "SF 5",
    birthYear: 1990,
    postalCode: "",
    quoteType: "teilkasko",
  });

  const saveVehicle = trpc.vehicles.save.useMutation();
  const createQuote = trpc.insurance.createQuote.useMutation();
  const uploadVehicleDoc = trpc.insurance.uploadVehicleDoc.useMutation();
  const uploadDoc = trpc.insurance.uploadDoc.useMutation();

  const STEPS = [
    { n: 1, label: "Документи", icon: FileText },
    { n: 2, label: "Автомобил", icon: Car },
    { n: 3, label: "Лични данни", icon: User },
    { n: 4, label: "Планове", icon: Shield },
  ];

  async function handleFileUpload(file: File, type: "reg" | "id") {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(",")[1];
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFinish() {
    try {
      // Save vehicle
      const vehicle = await saveVehicle.mutateAsync(vehicleForm);
      if (!vehicle) throw new Error("Грешка при запис на автомобил");

      // Create quote
      const quote = await createQuote.mutateAsync({
        vehicleId: vehicle.id,
        quoteType: selectedPlan as "haftpflicht" | "teilkasko" | "vollkasko",
        sfKlasse: userForm.sfKlasse,
        details: { birthYear: userForm.birthYear, postalCode: userForm.postalCode },
      });

      if (!quote) throw new Error("Грешка при създаване на оферта");

      // Upload docs if provided
      if (regDocFile && vehicle.id) {
        const base64 = await handleFileUpload(regDocFile, "reg");
        await uploadVehicleDoc.mutateAsync({
          vehicleId: vehicle.id,
          fileName: regDocFile.name,
          fileBase64: base64,
          mimeType: regDocFile.type,
        });
      }

      if (idDocFile && quote.id) {
        const base64 = await handleFileUpload(idDocFile, "id");
        await uploadDoc.mutateAsync({
          quoteId: quote.id,
          docType: "id",
          fileName: idDocFile.name,
          fileBase64: base64,
          mimeType: idDocFile.type,
        });
      }

      toast.success("Офертата е изпратена успешно!");
      navigate("/profile");
    } catch (err) {
      toast.error("Грешка при изпращане. Моля, опитайте отново.");
    }
  }

  return (
    <div className="container py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="tag-pill inline-block mb-3">Застраховка за автомобил</div>
        <h1
          className="text-white"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 700 }}
        >
          Намери най-добрата оферта
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 animate-fade-in-up delay-100">
        {STEPS.map(({ n, label, icon: Icon }, i) => (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: step > n ? "#10b981" : step === n ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${step >= n ? (step > n ? "#10b981" : "var(--color-dusk-violet)") : "var(--color-ash-border)"}`,
                }}
              >
                {step > n
                  ? <Check size={14} color="#fff" />
                  : <Icon size={14} color={step === n ? "#fff" : "var(--color-fog)"} />
                }
              </div>
              <span
                style={{
                  fontFamily: "var(--font-nbarchitekt)",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: step >= n ? "var(--color-pale-mist)" : "var(--color-fog)",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-px flex-1 mx-1 mb-4"
                style={{ background: step > n ? "#10b981" : "var(--color-ash-border)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div key={step} className="animate-fade-in-up">

        {/* STEP 1: Document Upload */}
        {step === 1 && (
          <div className="ghost-card">
            <h2
              className="text-white mb-2"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "16px", fontWeight: 700 }}
            >
              Качете документи
            </h2>
            <p
              className="mb-6"
              style={{ fontFamily: "var(--font-times)", fontSize: "14px", color: "var(--color-smoke)", lineHeight: 1.7 }}
            >
              Качването на документи ускорява процеса. Можете да пропуснете тази стъпка.
            </p>

            {/* Registration doc */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "12px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                Свидетелство за регистрация (Fahrzeugschein)
              </label>
              <input
                ref={regDocRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setRegDocFile(e.target.files?.[0] ?? null)}
              />
              <button
                onClick={() => regDocRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed transition-all"
                style={{
                  borderColor: regDocFile ? "#10b981" : "var(--color-ash-border)",
                  background: regDocFile ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                }}
              >
                <Upload size={18} style={{ color: regDocFile ? "#10b981" : "var(--color-fog)" }} />
                <span
                  style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", color: regDocFile ? "#10b981" : "var(--color-fog)" }}
                >
                  {regDocFile ? regDocFile.name : "Изберете файл (PDF, JPG, PNG)"}
                </span>
              </button>
            </div>

            {/* ID doc */}
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "12px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                Лична карта / Паспорт
              </label>
              <input
                ref={idDocRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setIdDocFile(e.target.files?.[0] ?? null)}
              />
              <button
                onClick={() => idDocRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed transition-all"
                style={{
                  borderColor: idDocFile ? "#10b981" : "var(--color-ash-border)",
                  background: idDocFile ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                }}
              >
                <Upload size={18} style={{ color: idDocFile ? "#10b981" : "var(--color-fog)" }} />
                <span
                  style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", color: idDocFile ? "#10b981" : "var(--color-fog)" }}
                >
                  {idDocFile ? idDocFile.name : "Изберете файл (PDF, JPG, PNG)"}
                </span>
              </button>
            </div>

            <div
              className="flex items-start gap-2 p-3 rounded-lg mb-6"
              style={{ background: "rgba(52,55,85,0.2)", border: "1px solid rgba(52,55,85,0.4)" }}
            >
              <Info size={14} style={{ color: "var(--color-pale-mist)", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-pale-mist)", lineHeight: 1.6 }}>
                Документите се съхраняват сигурно и се използват само за изготвяне на офертата.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle form */}
        {step === 2 && (
          <div className="ghost-card">
            <h2
              className="text-white mb-6"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "16px", fontWeight: 700 }}
            >
              Данни за автомобила
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Марка</label>
                <input
                  value={vehicleForm.make}
                  onChange={e => setVehicleForm(f => ({ ...f, make: e.target.value }))}
                  placeholder="VW, BMW, Mercedes..."
                />
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Модел</label>
                <input
                  value={vehicleForm.model}
                  onChange={e => setVehicleForm(f => ({ ...f, model: e.target.value }))}
                  placeholder="Golf, 3er, C-Klasse..."
                />
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Година</label>
                <input
                  type="number"
                  value={vehicleForm.year}
                  onChange={e => setVehicleForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                  min={1990}
                  max={2025}
                />
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Регистрационен номер</label>
                <input
                  value={vehicleForm.licensePlate}
                  onChange={e => setVehicleForm(f => ({ ...f, licensePlate: e.target.value }))}
                  placeholder="B-AB 1234"
                />
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Гориво</label>
                <select
                  value={vehicleForm.fuelType}
                  onChange={e => setVehicleForm(f => ({ ...f, fuelType: e.target.value as VehicleForm["fuelType"] }))}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff" }}
                >
                  <option value="benzin">Бензин</option>
                  <option value="diesel">Дизел</option>
                  <option value="elektro">Електрически</option>
                  <option value="hybrid">Хибрид</option>
                  <option value="gas">Газ</option>
                </select>
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Паркиране</label>
                <select
                  value={vehicleForm.parkingType}
                  onChange={e => setVehicleForm(f => ({ ...f, parkingType: e.target.value as VehicleForm["parkingType"] }))}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff" }}
                >
                  <option value="garage">Гараж</option>
                  <option value="carport">Навес</option>
                  <option value="strasse">Улица</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Годишен пробег: {vehicleForm.annualMileage.toLocaleString()} км
                </label>
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={1000}
                  value={vehicleForm.annualMileage}
                  onChange={e => setVehicleForm(f => ({ ...f, annualMileage: parseInt(e.target.value) }))}
                  style={{ width: "100%", accentColor: "var(--color-dusk-violet)" }}
                />
                <div className="flex justify-between mt-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)" }}>
                  <span>5,000</span><span>50,000 км</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: User form */}
        {step === 3 && (
          <div className="ghost-card">
            <h2
              className="text-white mb-6"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "16px", fontWeight: 700 }}
            >
              Лични данни
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>SF-Klasse</label>
                <select
                  value={userForm.sfKlasse}
                  onChange={e => setUserForm(f => ({ ...f, sfKlasse: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff" }}
                >
                  {SF_KLASSEN.map(sf => (
                    <option key={sf} value={sf}>{sf}</option>
                  ))}
                </select>
                <p style={{ fontFamily: "var(--font-times)", fontSize: "11px", color: "var(--color-fog)", marginTop: 4 }}>
                  Намирате я в предишната застрахователна полица
                </p>
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Година на раждане</label>
                <input
                  type="number"
                  value={userForm.birthYear}
                  onChange={e => setUserForm(f => ({ ...f, birthYear: parseInt(e.target.value) }))}
                  min={1940}
                  max={2005}
                />
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Пощенски код</label>
                <input
                  value={userForm.postalCode}
                  onChange={e => setUserForm(f => ({ ...f, postalCode: e.target.value }))}
                  placeholder="10115"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block mb-1" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Тип застраховка</label>
                <select
                  value={userForm.quoteType}
                  onChange={e => {
                    const v = e.target.value as UserForm["quoteType"];
                    setUserForm(f => ({ ...f, quoteType: v }));
                    setSelectedPlan(v);
                  }}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff" }}
                >
                  <option value="haftpflicht">Haftpflicht</option>
                  <option value="teilkasko">Teilkasko</option>
                  <option value="vollkasko">Vollkasko</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Plan comparison */}
        {step === 4 && (
          <div>
            <h2
              className="text-white mb-6"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "16px", fontWeight: 700 }}
            >
              Изберете план
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {INSURANCE_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="ghost-card text-left relative transition-all duration-200"
                  style={{
                    padding: "20px",
                    borderColor: selectedPlan === plan.id ? "var(--color-dusk-violet)" : "var(--color-ash-border)",
                    background: selectedPlan === plan.id ? "rgba(52,55,85,0.2)" : "transparent",
                  }}
                >
                  {plan.recommended && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 tag-pill flex items-center gap-1"
                      style={{ background: "var(--color-dusk-violet)", borderColor: "var(--color-dusk-violet)", color: "#fff", fontSize: "9px" }}
                    >
                      <Star size={10} /> Препоръчан
                    </div>
                  )}
                  <div
                    className="text-white font-bold mb-1"
                    style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "15px" }}
                  >
                    {plan.name}
                  </div>
                  <div
                    className="mb-1"
                    style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)" }}
                  >
                    {plan.nameBg}
                  </div>
                  <div
                    className="mb-3 font-bold"
                    style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "18px", color: "var(--color-ghost-white)" }}
                  >
                    {plan.price}
                  </div>
                  <p
                    className="mb-4"
                    style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)", lineHeight: 1.6 }}
                  >
                    {plan.desc}
                  </p>
                  <div className="space-y-1 mb-3">
                    {plan.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Check size={11} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontFamily: "var(--font-times)", fontSize: "11px", color: "var(--color-pale-mist)" }}>{pro}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {plan.cons.map((con, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span style={{ color: "var(--color-fog)", fontSize: "11px", flexShrink: 0, marginTop: 1 }}>—</span>
                        <span style={{ fontFamily: "var(--font-times)", fontSize: "11px", color: "var(--color-fog)" }}>{con}</span>
                      </div>
                    ))}
                  </div>
                  {selectedPlan === plan.id && (
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "var(--color-dusk-violet)" }}
                    >
                      <Check size={11} color="#fff" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => step === 1 ? navigate("/services") : setStep(s => (s - 1) as WizardStep)}
          className="btn-ghost-nav flex items-center gap-1"
          style={{ padding: "8px 16px", fontSize: "12px" }}
        >
          <ChevronLeft size={14} /> {step === 1 ? "Назад" : "Предишна стъпка"}
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(s => (s + 1) as WizardStep)}
            className="btn-pill-primary flex items-center gap-2"
            style={{ padding: "10px 24px" }}
          >
            Следваща стъпка <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="btn-pill-primary flex items-center gap-2"
            style={{ padding: "10px 24px" }}
            disabled={saveVehicle.isPending || createQuote.isPending}
          >
            {saveVehicle.isPending || createQuote.isPending ? "Изпращане..." : "Изпрати оферта"} <Check size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
