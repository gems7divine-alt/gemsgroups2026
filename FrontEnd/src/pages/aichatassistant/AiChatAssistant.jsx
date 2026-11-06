import { useEffect, useRef, useState } from "react";
import { Send, X, Sparkles, MessageSquarePlus, Trash2 } from "lucide-react";

function botReply(input) {
  const text = input.toLowerCase();
  if (/(hi|hello|hey|vanakkam)/.test(text))
    return "Hello! Welcome to GEMS Groups. Ask me about our services, leadership, or how to contact us.";
  if (/(service|what.*offer|business)/.test(text))
    return "We offer Software & AI Automation, Travel Services, Digital Marketing, Film Production, Gems Racing and education support via Mai Foundation. See the Services page for details.";
  if (/(contact|phone|whatsapp|email|address|location)/.test(text))
    return "You can reach us at +91 73973 82074, info@gemsgroups.in, Chennai, Tamil Nadu. Or tap the WhatsApp button below to chat instantly.";
  if (/(leader|ceo|founder|david|management|team)/.test(text))
    return "Our Founder & CEO is David Jabee. See the Leadership page for his vision and message.";
  if (/(about|company|gems)/.test(text))
    return "GEMS Groups is a diversified global company driven by innovation, creativity and social impact across technology, travel, media and more.";
  if (/(job|career|staff|vacancy|apply|join)/.test(text))
    return "For careers, visit the Contact page and send us your details — our team will get back to you.";
  if (/(thank|thanks|nandri)/.test(text))
    return "You're welcome! Anything else I can help with?";
  if (/(bye|goodbye)/.test(text))
    return "Goodbye! Have a great day. We're here whenever you need us.";
  return "Thanks for asking! For detailed help, contact us at +91 73973 82074 or info@gemsgroups.in — or ask about services, leadership, or contact info.";
}

const SUGGESTIONS = ["Our services", "Contact info", "Leadership"];

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

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const send = (raw) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    const answer = botReply(text);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: answer }]);
      setTyping(false);
    }, 650);
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setTyping(false);
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
    setTyping(false);
  };

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[420px] w-[320px] flex-col overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
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
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-md bg-gold text-deepnavy"
                      : "rounded-bl-md border border-white/10 bg-white/5 text-cream"
                  }`}
                >
                  {m.text}
                </p>
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
