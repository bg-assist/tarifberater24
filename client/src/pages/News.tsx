import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Calendar, Tag, ChevronRight, AlertCircle, TrendingUp } from "lucide-react";

const CATEGORY_IDS = ["all", "finance", "legal", "insurance", "banking", "utilities", "community"] as const;

type CategoryId = typeof CATEGORY_IDS[number];

const CATEGORY_COLORS: Record<string, string> = {
  finance: "#1e3a5f",
  legal: "#3a1e5f",
  insurance: "#343755",
  banking: "#2a3060",
  utilities: "#1e4a3a",
  community: "#4a3a1e",
  all: "#343755",
};

function formatDate(d: Date | string, locale: string) {
  const date = new Date(d);
  const localeMap: Record<string, string> = {
    bg: "bg-BG",
    de: "de-DE",
  };
  return date.toLocaleDateString(localeMap[locale] || "bg-BG", { day: "numeric", month: "long", year: "numeric" });
}

export default function News() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const getCategoryLabel = (catId: CategoryId): string => {
    const labelMap: Record<CategoryId, string> = {
      all: t("news.all_category"),
      finance: t("news.finance_category"),
      legal: t("news.legal_category"),
      insurance: t("news.insurance_category"),
      banking: t("news.banking_category"),
      utilities: t("news.utilities_category"),
      community: t("news.community_category"),
    };
    return labelMap[catId];
  };

  const { data: articles, isLoading } = trpc.news.list.useQuery({
    category: activeCategory,
    limit: 20,
  });

  const { data: featured } = trpc.news.featured.useQuery({
    limit: 3,
  });

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="tag-pill inline-block mb-3">{t("news.important_info")}</div>
        <h1
          className="text-white"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700 }}
        >
          {t("news.title")}
        </h1>
        <p
          className="mt-2"
          style={{ fontFamily: "var(--font-times)", fontSize: "15px", color: "var(--color-pale-mist)", lineHeight: 1.7 }}
        >
          {t("news.subtitle")}
        </p>
      </div>

      {/* Featured articles section */}
      {featured && featured.length > 0 && (
        <div className="mb-8 animate-fade-in-up delay-50">
          <div className="tag-pill inline-block mb-3" style={{ background: "rgba(255,193,7,0.2)", borderColor: "#ffc107" }}>
            <AlertCircle size={12} className="inline mr-1" />
            {t("news.featured_label")}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((article, i) => (
            <div
              key={article.id}
              className="ghost-card p-4 border-l-4 animate-fade-in-up cursor-pointer hover:bg-opacity-80 transition-all"
              style={{
                borderLeftColor: (article as any).importance === "critical" ? "#ff6b6b" : "#ffc107",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                {(article as any).importance === "critical" && (
                  <AlertCircle size={14} style={{ color: "#ff6b6b", flexShrink: 0 }} />
                )}
                {(article as any).importance === "high" && (
                    <TrendingUp size={14} style={{ color: "#ffc107", flexShrink: 0 }} />
                  )}
                </div>
                <h3
                  className="text-white mb-1"
                  style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 700 }}
                >
                  {article.title}
                </h3>
                <p
                  style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-pale-mist)", lineHeight: 1.5 }}
                >
                  {article.summary.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-in-up delay-100" style={{ scrollbarWidth: "none" }}>
        {CATEGORY_IDS.map(catId => (
          <button
            key={catId}
            onClick={() => setActiveCategory(catId)}
            className="flex-shrink-0 btn-ghost-nav transition-all duration-200"
            style={{
              background: activeCategory === catId ? "var(--color-dusk-violet)" : "transparent",
              borderColor: activeCategory === catId ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.3)",
              color: activeCategory === catId ? "#fff" : "var(--color-pale-mist)",
              padding: "4px 14px",
              fontSize: "11px",
            }}
          >
            {getCategoryLabel(catId)}
          </button>
        ))}
      </div>

      {/* Articles */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="ghost-card animate-pulse"
              style={{ height: 120, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(articles ?? []).map((article, i) => (
            <article
              key={article.id}
              className="ghost-card group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s`, padding: "20px" }}
            >
              <div className="flex items-start gap-4">
                {/* Color accent */}
                <div
                  className="w-1 flex-shrink-0 rounded-full self-stretch"
                  style={{
                    background: CATEGORY_COLORS[article.category] ?? "var(--color-dusk-violet)",
                    minHeight: 60,
                  }}
                />
                <div className="flex-1 min-w-0">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className="tag-pill"
                      style={{
                        background: `${CATEGORY_COLORS[article.category] ?? "var(--color-dusk-violet)"}40`,
                        borderColor: CATEGORY_COLORS[article.category] ?? "var(--color-dusk-violet)",
                        fontSize: "9px",
                      }}
                    >
                      <Tag size={8} className="inline mr-1" />
                      {getCategoryLabel(article.category as CategoryId)}
                    </span>
                    {article.featured && (
                      <span className="tag-pill" style={{ fontSize: "9px", background: "rgba(52,55,85,0.5)" }}>
                        {t("news.recommended")}
                      </span>
                    )}
                    {(article as any).importance && (article as any).importance !== "medium" && (
                      <span
                        className="tag-pill"
                        style={{
                          fontSize: "9px",
                          background:
                            (article as any).importance === "critical"
                              ? "rgba(255,107,107,0.2)"
                              : (article as any).importance === "high"
                                ? "rgba(255,193,7,0.2)"
                                : "rgba(76,175,80,0.2)",
                          borderColor:
                            (article as any).importance === "critical"
                              ? "#ff6b6b"
                              : (article as any).importance === "high"
                                ? "#ffc107"
                                : "#4caf50",
                        }}
                      >
                        {(article as any).importance === "critical"
                          ? t("news.critical_importance")
                          : (article as any).importance === "high"
                            ? t("news.high_importance")
                            : t("news.medium_importance")}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1"
                      style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)" }}
                    >
                      <Calendar size={10} />
                      {formatDate(article.publishedAt, i18n.language)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-white mb-2 group-hover:text-white/90 transition-colors"
                    style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "15px", fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {article.title}
                  </h2>

                  {/* Summary */}
                  <p
                    style={{ fontFamily: "var(--font-times)", fontSize: "13px", color: "var(--color-pale-mist)", lineHeight: 1.7 }}
                  >
                    {article.summary}
                  </p>

                  {/* Author + CTA */}
                  <div className="flex items-center justify-between mt-3">
                    {article.author && (
                      <span
                        style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)" }}
                      >
                        {article.author}
                      </span>
                    )}
                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 ml-auto"
                        style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", color: "var(--color-pale-mist)" }}
                      >
                        {t("news.read_more")} <ChevronRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {(!articles || articles.length === 0) && (
            <div
              className="ghost-card text-center py-12"
              style={{ color: "var(--color-fog)", fontFamily: "var(--font-times)", fontSize: "15px" }}
            >
              {t("news.no_news")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
