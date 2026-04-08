import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = "https://d1otxgia1oi4us.cloudfront.net";

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

  const location = useLocation();
  const qState = location.state as any;

  const initialContext = qState
    ? `The user completed a DASS-21 test:
Depression (${qState.depression} - ${qState.depLabel}),
Anxiety (${qState.anxiety} - ${qState.anxLabel}),
Stress (${qState.stress} - ${qState.strLabel}).
Overall: ${qState.result}.`
    : "";

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Save to localStorage so Garden can react
    localStorage.setItem(
      "mindwell_last_message",
      JSON.stringify({ text: input, timestamp: Date.now() })
    );

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply || "I'm here for you 💚",
        },
      ]);
    } catch (error) {
      console.error(error);
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

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: "100dvh" }}>
      <Navbar />

      <main
        className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto px-4 pb-4"
        style={{ paddingTop: "80px" }}
      >
        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-2 py-4 space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-green-500 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin h-4 w-4 text-green-500" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 flex gap-2 pt-3 border-t border-gray-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
