import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Bot, User, Loader2, Heart, Sparkles, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 🔥 IMPORTANT: your backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://piu-mindwell-env.eba-ach9mijn.us-east-1.elasticbeanstalk.com";

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


  const location = useLocation();
  const qState = location.state as any;

  // 🧠 Context from questionnaire
  const initialContext = qState
    ? `The user completed a DASS-21 test:
Depression (${qState.depression} - ${qState.depLabel}),
Anxiety (${qState.anxiety} - ${qState.anxLabel}),
Stress (${qState.stress} - ${qState.strLabel}).
Overall: ${qState.result}.
Respond supportively using this context.`
    : "";

  const systemPrompt = `You are a compassionate mental health companion. Be warm, empathetic, and supportive.\n\n${initialContext}`;

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", content: msg };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`http://piu-mindwell-env.eba-ach9mijn.us-east-1.elasticbeanstalk.com/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt,
        }),
      });

      // 🚨 handle backend failure
      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply || "I'm here for you 💚",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
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
              <div className="h-11 w-11 rounded-full bg-emerald-500 flex items-center justify-center">
                <Heart className="text-white" />
              </div>
              <div>
                <p className="font-semibold">MindCompanion</p>
                <p className="text-xs text-green-500">Active · Here for you</p>
              </div>
            </div>

            <button onClick={handleReset} className="text-xs text-gray-500">
              <RefreshCw className="inline h-4 w-4 mr-1" />
              New chat
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-xs ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex">
                <div className="bg-white px-4 py-2 rounded-xl border flex gap-2">
                  <Loader2 className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mt-4 flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-lg p-2"
              placeholder="Type your message..." />
            <button
              onClick={() => handleSend()}
              className="bg-emerald-500 text-white px-4 rounded-lg"
            >
              <Send />
            </button>
          </div>


        </div>

      </main>
    </div>
  );
};

export default ChatBot;
