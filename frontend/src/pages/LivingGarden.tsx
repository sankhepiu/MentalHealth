import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Leaf, Flower2, TreeDeciduous, Sprout } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GardenCanvas from "../components/GardenCanvas";
import { useGardenState } from "../hooks/useGardenState";
import type { Emotion } from "../hooks/useGardenState";

const EMOTION_LABELS: Record<Emotion, { label: string; desc: string; color: string }> = {
  happy:       { label: "Joyful", desc: "Bright flowers bloom", color: "#F9C74F" },
  calm:        { label: "Calm",   desc: "Soft ferns sway gently", color: "#52B788" },
  stressed:    { label: "Stressed", desc: "Thorny plants emerge", color: "#E59866" },
  anxious:     { label: "Anxious", desc: "Willows droop softly", color: "#AAB7B8" },
  lonely:      { label: "Lonely", desc: "Quiet moss spreads", color: "#7F8C8D" },
  overwhelmed: { label: "Overwhelmed", desc: "The garden feels heavy", color: "#C39BD3" },
  neutral:     { label: "Peaceful", desc: "A gentle balance", color: "#74C69D" },
};

const PLANT_LEGEND = [
  { icon: Flower2, label: "Blossom Trees → Happiness", color: "#F9C74F" },
  { icon: TreeDeciduous, label: "Pine Trees → Calm", color: "#52B788" },
  { icon: Leaf, label: "Succulents → Neutral", color: "#74C69D" },
  { icon: TreeDeciduous, label: "Willows → Anxiety", color: "#8B9DC3" },
  { icon: Sprout,  label: "Moss & Cactus → Loneliness/Stress", color: "#5C3A21" },
];

export default function LivingGarden() {
  const { state, updateFromMessage } = useGardenState();
  const [isVisible, setIsVisible] = useState(false);
  const gardenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (gardenRef.current) {
      observer.observe(gardenRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const emotionInfo = EMOTION_LABELS[state.emotion] || EMOTION_LABELS.neutral;
  const recentEmotions = state.history.slice(-5).reverse();

  // Read from chatbot messages stored in localStorage
  useEffect(() => {
    const checkForNewMessages = () => {
      try {
        const chatData = localStorage.getItem("mindwell_last_message");
        if (chatData) {
          const { text, timestamp } = JSON.parse(chatData);
          const seen = localStorage.getItem("mindwell_last_seen");
          if (seen !== timestamp.toString()) {
            updateFromMessage(text);
            localStorage.setItem("mindwell_last_seen", timestamp.toString());
          }
        }
      } catch {}
    };

    checkForNewMessages();
    const interval = setInterval(checkForNewMessages, 3000);
    return () => clearInterval(interval);
  }, [updateFromMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">

          {/* Header */}
          <div className="min-h-[70vh] flex flex-col justify-center items-center text-center mb-8 pt-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Leaf className="h-4 w-4" />
              Living Garden
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-slate-800 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Your Emotional Garden
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto text-lg md:text-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              This garden reflects your emotional state from your conversations. It grows and changes continuously.
            </p>
            <div className="mt-16 animate-bounce text-emerald-400 opacity-70">
               <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center p-1">
                 <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
               </div>
            </div>
          </div>

          <div ref={gardenRef} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Current mood badge */}
          <div className="flex justify-center mb-6">
            <div
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-sm"
              style={{ backgroundColor: emotionInfo.color + "30", color: emotionInfo.color, border: `1.5px solid ${emotionInfo.color}55` }}
            >
              <span className="font-bold">{emotionInfo.label}</span>
              <span className="mx-2 opacity-50">·</span>
              <span className="opacity-80">{emotionInfo.desc}</span>
            </div>
          </div>

          {/* Garden SVG */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-100 mb-6">
            <GardenCanvas gardenState={state} />
          </div>

          {/* Info row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            {/* Legend */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-emerald-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Plant Guide</p>
              <div className="space-y-2">
                {PLANT_LEGEND.map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "25" }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent emotions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-emerald-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Moods</p>
              {recentEmotions.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  Start chatting with MindCompanion to see your garden evolve.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentEmotions.map((entry, i) => {
                    const info = EMOTION_LABELS[entry.emotion];
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                        <span className="text-slate-700 font-medium">{info.label}</span>
                        <span className="text-slate-400 text-xs ml-auto">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              Talk to MindCompanion
            </Link>
            <p className="text-xs text-slate-400 mt-2">Your garden updates as you share how you feel</p>
          </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}