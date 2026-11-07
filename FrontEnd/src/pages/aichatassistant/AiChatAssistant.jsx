import { useEffect, useRef, useState } from "react";
import { Send, X, Sparkles, MessageSquarePlus, Trash2 } from "lucide-react";
import { askAssistant } from "../../services/chatapi";

const ERROR_REPLY =
  "Sorry, I can't answer right now. Please try again, or contact us at +91 73973 82074 or info@gemsgroups.in.";

const SUGGESTIONS = ["Our services", "Contact info", "Who is the owner?"];

const INITIAL_MESSAGES = [
  {
    from: "bot",
    text: "Hi! I'm the GEMS AI Assistant. How can I help you today?",
  },
];

export default function AiChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const bodyRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  // Stop waiting for a reply if the widget is removed from the page.
  useEffect(() => () => requestRef.current?.abort(), []);

  const send = async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;

    // The greeting and error notices are not part of the real conversation.
    const history = messages
      .filter((m) => !INITIAL_MESSAGES.includes(m) && !m.failed)
      .map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }));

    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);

    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const { answer, summary, points } = await askAssistant(
        text,
        history,
        controller.signal
      );
      setMessages((m) => [...m, { from: "bot", text: answer, summary, points }]);
    } catch (error) {
      // New Chat or Clear cancelled this request, so its reply is not wanted.
      if (controller.signal.aborted) return;
      console.error("AI assistant request failed:", error);
      setMessages((m) => [...m, { from: "bot", text: ERROR_REPLY, failed: true }]);
    }
    setTyping(false);
  };

  const handleNewChat = () => {
    requestRef.current?.abort();
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setTyping(false);
  };

  const handleClear = () => {
    requestRef.current?.abort();
    setMessages([]);
    setInput("");
    setTyping(false);
  };

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(420px,calc(100svh-11rem))] w-[min(320px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-3 border-b border-gold/15 bg-darkblue px-4 py-3">
            <img
              src="/assets/gems_groups_logo.png"
              alt="GEMS Groups logo"
              className="h-9 w-9 rounded-full border border-gold/40 bg-deepnavy object-contain p-0.5"
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-bold text-cream">
                GEMS AI Assistant
                <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              </p>
              <p className="flex items-center gap-1.5 text-[11px] text-green-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                Online
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleNewChat}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1 text-[11px] font-semibold text-gold transition-colors hover:bg-gold hover:text-deepnavy"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
                New Chat
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-cream/60 transition-colors hover:border-red-400/60 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            </div>
            {messages.length === 0 && !typing && (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-center text-[12px] text-cream/50">
                Chat cleared. Type below or start a new chat.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-md bg-gold text-deepnavy"
                      : "rounded-bl-md border border-white/10 bg-white/5 text-cream"
                  }`}
                >
                  {/* Greetings, user messages and errors only have plain text. */}
                  {m.summary ?? (m.points ? null : m.text)}
                  {m.points?.length > 0 && (
                    <ul className={`list-disc space-y-1.5 pl-4 ${m.summary ? "mt-2" : ""}`}>
                      {m.points.map((point, j) => (
                        <li key={j}>
                          {point.title && (
                            <span className="font-semibold text-gold">{point.title}: </span>
                          )}
                          {point.detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-[13px] text-cream/60">
                  Typing…
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gold/15 px-3 pb-3 pt-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-gold/40 px-3 py-1 text-[11px] font-medium text-gold transition-colors hover:bg-gold hover:text-deepnavy"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something…"
                maxLength={1000}
                aria-label="Type your message"
                className="min-w-0 flex-1 rounded-full border border-gold/30 bg-white/5 px-4 py-2.5 text-[13px] text-cream placeholder:text-cream/40 outline-none focus:border-gold"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-deepnavy transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        title="GEMS AI Assistant"
        className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gold/70 bg-deepnavy shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-110"
      >
        {open ? (
          <X className="h-6 w-6 text-gold" aria-hidden="true" />
        ) : (
          <img
            src="/assets/gems_groups_logo.png"
            alt="GEMS AI Assistant"
            className="h-10 w-10 object-contain"
          />
        )}
      </button>
    </div>
  );
}
