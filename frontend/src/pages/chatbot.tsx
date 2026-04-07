import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Heart, Sparkles, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "I'm feeling anxious lately",
  "I can't sleep well",
  "I feel overwhelmed at work",
  "I want tips to manage stress",
  "I feel lonely",
  "How do I calm down quickly?",
];

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there 💙 I'm MindCompanion — your safe space to talk, reflect, and feel heard. You don't need to have done any assessment to chat with me.\n\nWhat's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const systemPrompt = `You are a compassionate mental health companion — clinical in knowledge, but warm and human in tone.
You combine the precision of a mental health professional with the empathy of a trusted friend.
Your role is to:
- Listen actively and reflect back what you hear
- Provide evidence-based psychoeducation when relevant
- Offer grounding techniques, coping strategies, and gentle reframes
- Always validate emotions before offering advice
- Never diagnose, but help the user understand their patterns
- Encourage professional help when appropriate, gently and without alarm
- Use clear, accessible language — no jargon unless explained
- Keep responses concise (2-4 paragraphs max) unless the user asks for more detail
- Never be dismissive, toxic-positive, or preachy
- If the user seems to be in crisis, gently provide the iCall India helpline: 9152987821`;

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt,
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply ?? "I'm here for you." }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please make sure the server is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi again 💙 I'm here whenever you're ready. What would you like to talk about?",
      },
    ]);
    setInput("");
  };

  const formatMessage = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const showQuickReplies = messages.length <= 1;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar />

      <main className="flex-1 pt-24 pb-6 px-4 flex flex-col">
        <div className="container mx-auto max-w-3xl flex flex-col flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">MindCompanion</p>
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                </div>
                <p className="text-xs text-green-500 font-medium">Active · Here for you</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              New chat
            </button>
          </div>

          {/* Intro banner */}
          <div className="mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-sm text-blue-700 text-center">
            💬 Talk freely — no assessment required. This is your safe space.
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4"
            style={{ minHeight: 0, maxHeight: "calc(100vh - 380px)" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="flex-shrink-0">
                  {msg.role === "assistant" ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "assistant"
                      ? "bg-white text-slate-700 rounded-tl-sm border border-slate-100"
                      : "bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-tr-sm"
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick reply chips — only shown at start */}
          {showQuickReplies && !loading && (
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="text-xs px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="mt-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-end gap-2 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share how you're feeling… (Enter to send)"
              rows={1}
              className="flex-1 resize-none text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent max-h-32 leading-relaxed"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Safety note */}
          <p className="text-center text-xs text-slate-400 mt-3">
            Not a substitute for professional care. If you're in crisis, call{" "}
            <a href="tel:9152987821" className="text-blue-500 underline">
              iCall: 9152987821
            </a>{" "}
            (India).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatBot;