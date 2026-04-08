import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Bot, User, Loader2, Heart, Sparkles, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";

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
        "Hi there 💚 I'm MindCompanion — your safe space to talk, reflect, and feel heard.\n\nWhat's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reset window scroll on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll chat specifically without triggering window jumps
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const location = useLocation();
  const qState = location.state as any;

  const initialContext = qState 
    ? `The user just completed a DASS-21 mental health questionnaire. Their scores are: Depression (${qState.depression} - ${qState.depLabel}), Anxiety (${qState.anxiety} - ${qState.anxLabel}), Stress (${qState.stress} - ${qState.strLabel}). The backend analysis says: ${qState.result}. Please use this context gently and supportively when responding.`
    : "";

  const systemPrompt = `You are a compassionate mental health companion. Be warm, empathetic, and supportive.\n\n${initialContext}`;

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

      localStorage.setItem("mindwell_last_message", JSON.stringify({
        text: msg,
        timestamp: Date.now(),
}));
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again.",
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
        content: "Hi again 💚 I'm here whenever you're ready.",
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-emerald-100/40">
      <Navbar />

      <main className="flex-1 pt-24 pb-6 px-4 flex flex-col">
        <div className="container mx-auto max-w-3xl flex flex-col flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">MindCompanion</p>
                  <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                </div>
                <p className="text-xs text-green-500 font-medium">Active · Here for you</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              New chat
            </button>
          </div>

          {/* Intro */}
          <div className="mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-100 text-sm text-emerald-700 text-center">
            💬 Talk freely — this is your safe space.
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div>
                  {msg.role === "assistant" ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "assistant"
                    ? "bg-white text-slate-700 border"
                    : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl flex gap-1">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mt-2 bg-white rounded-2xl border flex gap-2 p-3 shadow-sm">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 outline-none text-sm resize-none"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              className="h-9 w-9 rounded-xl flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-3">
            If you're in crisis, call{" "}
            <a href="tel:9152987821" className="text-emerald-600 underline hover:text-emerald-500 transition-colors">
              iCall: 9152987821
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;