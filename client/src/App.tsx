import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import EmailVerificationGate from "./components/EmailVerificationGate";

// ─── Existing pages ───────────────────────────────────────────────────────────
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Services from "./pages/Services";
import InsuranceWizard from "./pages/InsuranceWizard";
import Assistant from "./pages/Assistant";
import News from "./pages/News";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ─── New business pages ───────────────────────────────────────────────────────
import GetOffer from "./pages/GetOffer";
import Angebot from "./pages/Angebot";
import Partners from "./pages/Partners";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import HausbesitzerPortal from "./pages/HausbesitzerPortal";
import PaidServices from "./pages/PaidServices";

// ─── Email verification ───────────────────────────────────────────────────────
import VerifyEmail from "./pages/VerifyEmail";

// ─── Legal pages ──────────────────────────────────────────────────────────────
import Impressum from "./pages/legal/Impressum";
import Datenschutz from "./pages/legal/Datenschutz";
import AGB from "./pages/legal/AGB";
import CookiePolicy from "./pages/legal/CookiePolicy";
import AffiliateDisclosure from "./pages/legal/AffiliateDisclosure";
import PrivacySettings from "./pages/legal/PrivacySettings";

// ─── Layouts ──────────────────────────────────────────────────────────────────

/** AppLayout — core app pages with BottomNav + soft email verification banner */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="void-bg min-h-screen flex flex-col">
      <TopNav />
      <EmailVerificationGate soft>
        <main className="page-content flex-1">
          {children}
        </main>
      </EmailVerificationGate>
      <Footer />
      <BottomNav />
    </div>
  );
}

/** FullLayout — landing, business, and legal pages (no BottomNav) */
function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="void-bg min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 pt-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Switch>
      {/* Core app pages */}
      <Route path="/"           component={() => <AppLayout><Home /></AppLayout>} />
      <Route path="/onboarding" component={() => <FullLayout><Onboarding /></FullLayout>} />
      <Route path="/services"   component={() => <AppLayout><Services /></AppLayout>} />
      <Route path="/insurance"  component={() => <AppLayout><InsuranceWizard /></AppLayout>} />
      <Route path="/assistant"  component={() => <AppLayout><Assistant /></AppLayout>} />
      <Route path="/news"       component={() => <AppLayout><News /></AppLayout>} />
      <Route path="/profile"    component={() => <AppLayout><Profile /></AppLayout>} />
      <Route path="/settings"   component={() => <AppLayout><Settings /></AppLayout>} />

      {/* New business pages */}
      <Route path="/get-offer"  component={() => <FullLayout><GetOffer /></FullLayout>} />
      <Route path="/angebot"    component={() => <Angebot />} />
      <Route path="/hausbesitzer" component={() => <FullLayout><HausbesitzerPortal /></FullLayout>} />
      <Route path="/paid-services" component={() => <FullLayout><PaidServices /></FullLayout>} />
      <Route path="/partners"   component={() => <FullLayout><Partners /></FullLayout>} />
      <Route path="/about"      component={() => <FullLayout><About /></FullLayout>} />
      <Route path="/faq"        component={() => <FullLayout><FAQ /></FullLayout>} />
      <Route path="/contact"    component={() => <FullLayout><Contact /></FullLayout>} />

      {/* Email verification */}
      <Route path="/verify-email" component={() => <VerifyEmail />} />

      {/* Legal pages */}
      <Route path="/impressum"             component={() => <FullLayout><Impressum /></FullLayout>} />
      <Route path="/datenschutz"           component={() => <FullLayout><Datenschutz /></FullLayout>} />
      <Route path="/agb"                   component={() => <FullLayout><AGB /></FullLayout>} />
      <Route path="/cookies"               component={() => <FullLayout><CookiePolicy /></FullLayout>} />
      <Route path="/affiliate-disclosure"  component={() => <FullLayout><AffiliateDisclosure /></FullLayout>} />
      <Route path="/privacy-settings"      component={() => <FullLayout><PrivacySettings /></FullLayout>} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
            <AppRoutes />
          </WouterRouter>
          <CookieBanner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
