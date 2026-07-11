/**
 * SEOMeta — Injects <title>, <meta>, Open Graph, and Schema.org JSON-LD
 * into the document <head> for each page.
 *
 * Usage:
 *   <SEOMeta
 *     title="Versicherungen vergleichen | Tarifberater24"
 *     description="Vergleichen Sie Kfz-, Haftpflicht- und Hausratversicherungen..."
 *     path="/insurance"
 *   />
 */

import { useEffect } from "react";

interface SEOMetaProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imageUrl?: string;
  schema?: Record<string, unknown>;
  noIndex?: boolean;
}

const BASE_URL = "https://tarifberater24.de";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Tarifberater24";

export default function SEOMeta({
  title,
  description,
  path,
  type = "website",
  imageUrl = DEFAULT_IMAGE,
  schema,
  noIndex = false,
}: SEOMetaProps) {
  const canonicalUrl = `${BASE_URL}${path}`;

  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set/create meta tags
    function setMeta(selector: string, content: string, attr = "content") {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrVal] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(attrName, attrVal.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    }

    function setLink(rel: string, href: string) {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    }

    // Standard meta
    setMeta('meta[name="description"]', description);
    if (noIndex) {
      setMeta('meta[name="robots"]', "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "index, follow");
    }

    // Canonical
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[property="og:image"]', imageUrl);
    setMeta('meta[property="og:site_name"]', SITE_NAME);
    setMeta('meta[property="og:locale"]', "de_DE");

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', imageUrl);

    // Schema.org JSON-LD
    const schemaData = schema ?? {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: BASE_URL,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Hospitalstraße 30",
          addressLocality: "Wallerfangen",
          postalCode: "66798",
          addressCountry: "DE",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+49-15255234853",
          contactType: "customer service",
          availableLanguage: ["German", "Bulgarian", "English"],
        },
      },
    };

    let ldEl = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-seo]');
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.setAttribute("type", "application/ld+json");
      ldEl.setAttribute("data-seo", "true");
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(schemaData);

    return () => {
      // Cleanup JSON-LD on unmount
      ldEl?.remove();
    };
  }, [title, description, path, type, imageUrl, schema, noIndex, canonicalUrl]);

  return null;
}

// ─── Pre-built schema helpers ─────────────────────────────────────────────────

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Tarifberater24",
    description: "Unabhängiger Vergleichs- und Vermittlungsdienst für Versicherungen, Energie, Internet und mehr in Deutschland.",
    url: BASE_URL,
    telephone: "+49-15255234853",
    email: "Tarifberatung24@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hospitalstraße 30",
      addressLocality: "Wallerfangen",
      postalCode: "66798",
      addressCountry: "DE",
    },
    areaServed: "DE",
    availableLanguage: ["German", "Bulgarian", "English"],
    priceRange: "Kostenlos",
    openingHours: "Mo-Fr 09:00-18:00",
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
