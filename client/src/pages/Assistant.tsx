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
      <div className="premium-page premium-auth-gate">
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
        <a href={getLoginUrl() ?? "/"} className="premium-button">
          Вход / Регистрация
        </a>
      </div>
    );
  }

  return (
    <main className="premium-assistant-page">
      {/* Header */}
      <div
        className="premium-assistant-header"
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
          className="premium-assistant-reset"
          style={{ padding: "4px 10px", fontSize: "10px" }}
          title="Нов разговор"
        >
          <RotateCcw size={11} /> Нов
        </button>
      </div>

      {/* Messages */}
      <div className="premium-assistant-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`premium-message-row ${msg.role === "user" ? "is-user" : "is-assistant"} animate-fade-in-up`}
            style={{ animationDelay: "0s" }}
          >
            {msg.role === "assistant" && (
              <div
                className="premium-ai-avatar"
                style={{ background: "rgba(52,55,85,0.5)", border: "1px solid var(--color-dusk-violet)" }}
              >
                <Sparkles size={12} style={{ color: "var(--color-pale-mist)" }} />
              </div>
            )}
            <div
              className={`premium-message-bubble ${msg.role === "user" ? "is-user" : "is-assistant"}`}
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
          <div className="premium-message-row is-assistant animate-fade-in">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
              style={{ background: "rgba(52,55,85,0.5)", border: "1px solid var(--color-dusk-violet)" }}
            >
              <Sparkles size={12} style={{ color: "var(--color-pale-mist)" }} />
            </div>
            <div
              className="premium-message-bubble is-assistant premium-typing"
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
        <div className="premium-prompt-dock">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="premium-prompt-chip"
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
        className="premium-assistant-composer"
        style={{ borderColor: "var(--color-ash-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      >
          <div className="premium-composer-row">
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
            className="premium-send-button"
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
    </main>
  );
}
