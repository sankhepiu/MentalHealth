import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Loader2, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LocationState {
  depression: number;
  anxiety: number;
  stress: number;
  result: string;
}

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: state
        ? `Hello, I'm here with you. 💙 I've reviewed your assessment — your scores show Depression: ${state.depression}, Anxiety: ${state.anxiety}, and Stress: ${state.stress}, placing you in the **${state.result}** range overall.\n\nI want you to know this is a safe space. How are you feeling right now?`
        : "Hello, I'm your mental health companion. 💙 I'm here to listen and support you. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildSystemPrompt = () => {
    const base = `You are a compassionate mental health companion — clinical in knowledge, but warm and human in tone. 
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
- Never be dismissive, toxic-positive, or preachy`;

    if (state) {
      return `${base}

The user has just completed a mental health questionnaire with these results:
- Depression score: ${state.depression}/9
- Anxiety score: ${state.anxiety}/9  
- Stress score: ${state.stress}/9
- Overall risk level: ${state.result}

Use this context to personalise your responses. Don't repeat these numbers unless relevant. Focus on what matters most based on their highest scores.`;
    }

    return base;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: buildSystemPrompt(),
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please check that the server is running and try again.",
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

  const formatMessage = (text: string) => {
    // Bold **text**
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar />

      <main className="flex-1 pt-24 pb-6 px-4 flex flex-col">
        <div className="container mx-auto max-w-3xl flex flex-col flex-1">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">MindCompanion</p>
                <p className="text-xs text-green-500 font-medium">Active · Here for you</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          {state && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-600 text-center">
              Your assessment results are being used to personalise this conversation.
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4" style={{ minHeight: 0, maxHeight: "calc(100vh - 340px)" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
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

                {/* Bubble */}
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

          {/* Input */}
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-end gap-2 p-3">
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
              onClick={handleSend}
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
            <a href="tel:9152987821" className="text-blue-500 underline">iCall: 9152987821</a> (India).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;