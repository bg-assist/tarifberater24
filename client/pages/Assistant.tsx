import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { Streamdown } from "streamdown";

const SUGGESTED_PROMPTS = [
  "Как да сключа Kfz-Versicherung?",
  "Какво е SF-Klasse?",
  "Как да подам Steuererklärung?",
  "Какви са правата ми като наемател?",
  "Как да отворя банкова сметка в Германия?",
  "Какво е Anmeldung и как се прави?",
  "Разлика между GKV и PKV?",
  "Как да прекратя мобилен договор?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Assistant() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Здравей! Аз съм BG Assist — вашият AI асистент за живот в Германия. 🇩🇪\n\nМогу да ви помогна с въпроси за застраховки, банкиране, данъци, документи, наемно право и много повече.\n\n**Как мога да ви помогна днес?**",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.assistant.chat.useMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatMutation.mutateAsync({
        message: text,
        history: messages.slice(-10),
      });
      setMessages(prev => [...prev, { role: "assistant", content: result.content }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Съжалявам, възникна грешка. Моля, опитайте отново.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages([{
      role: "assistant",
      content: "Здравей! Аз съм BG Assist — вашият AI асистент за живот в Германия. 🇩🇪\n\nМогу да ви помогна с въпроси за застраховки, банкиране, данъци, документи, наемно право и много повече.\n\n**Как мога да ви помогна днес?**",
    }]);
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(52,55,85,0.3)", border: "1px solid var(--color-dusk-violet)" }}
        >
          <Sparkles size={28} style={{ color: "var(--color-pale-mist)" }} />
        </div>
        <h2
          className="text-white mb-2"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "20px", fontWeight: 700 }}
        >
          AI Асистент
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: "var(--font-times)", fontSize: "15px", color: "var(--color-pale-mist)", lineHeight: 1.7, maxWidth: 400 }}
        >
          Влезте в профила си, за да използвате AI асистента.
        </p>
        <a href={getLoginUrl()} className="btn-pill-primary">
          Вход / Регистрация
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px - 64px)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--color-ash-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(52,55,85,0.5)", border: "1px solid var(--color-dusk-violet)" }}
          >
            <Sparkles size={14} style={{ color: "var(--color-pale-mist)" }} />
          </div>
          <div>
            <div
              className="text-white"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 700 }}
            >
              BG Assist AI
            </div>
            <div
              className="flex items-center gap-1"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "#10b981" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Онлайн
            </div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="btn-ghost-nav flex items-center gap-1"
          style={{ padding: "4px 10px", fontSize: "10px" }}
          title="Нов разговор"
        >
          <RotateCcw size={11} /> Нов
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            style={{ animationDelay: "0s" }}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                style={{ background: "rgba(52,55,85,0.5)", border: "1px solid var(--color-dusk-violet)" }}
              >
                <Sparkles size={12} style={{ color: "var(--color-pale-mist)" }} />
              </div>
            )}
            <div
              className="max-w-[80%] rounded-xl px-4 py-3"
              style={{
                background: msg.role === "user"
                  ? "var(--color-dusk-violet)"
                  : "rgba(255,255,255,0.05)",
                border: msg.role === "user"
                  ? "1px solid var(--color-dusk-violet)"
                  : "1px solid var(--color-ash-border)",
                fontFamily: "var(--font-times)",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "var(--color-ghost-white)",
              }}
            >
              {msg.role === "assistant" ? (
                <Streamdown>{msg.content}</Streamdown>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
              style={{ background: "rgba(52,55,85,0.5)", border: "1px solid var(--color-dusk-violet)" }}
            >
              <Sparkles size={12} style={{ color: "var(--color-pale-mist)" }} />
            </div>
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-ash-border)",
              }}
            >
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--color-fog)",
                      animation: `pulse-glow 1.2s ease infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="tag-pill cursor-pointer hover:border-white/60 transition-colors"
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "var(--color-ash-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Задайте въпрос на български..."
            disabled={isLoading}
            style={{ flex: 1 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${input.trim() ? "var(--color-dusk-violet)" : "var(--color-ash-border)"}`,
            }}
          >
            <Send size={16} style={{ color: input.trim() ? "#fff" : "var(--color-fog)" }} />
          </button>
        </div>
        <p
          className="mt-1.5 text-center"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "9px", color: "var(--color-fog)", letterSpacing: "0.04em" }}
        >
          AI асистентът дава информационни отговори, не правни или медицински съвети.
        </p>
      </div>
    </div>
  );
}
