import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft, ArrowRight, RotateCcw, ClipboardList,
  Brain, Heart, Zap, MessageCircleHeart,
  TrendingUp, AlertCircle, CheckCircle, AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

type Category = "Depression" | "Anxiety" | "Stress";

// ── 21 DASS-21 questions ──────────────────────────────────────────────────────
const questions: { q: string; category: Category }[] = [
  // Depression (7)
  { q: "I couldn't seem to experience any positive feeling at all.", category: "Depression" },
  { q: "I found it difficult to work up the initiative to do things.", category: "Depression" },
  { q: "I felt that I had nothing to look forward to.", category: "Depression" },
  { q: "I felt down-hearted and blue.", category: "Depression" },
  { q: "I was unable to become enthusiastic about anything.", category: "Depression" },
  { q: "I felt I wasn't worth much as a person.", category: "Depression" },
  { q: "I felt that life was meaningless.", category: "Depression" },

  // Anxiety (7)
  { q: "I was aware of dryness of my mouth.", category: "Anxiety" },
  { q: "I experienced breathing difficulty (e.g. excessively rapid breathing or breathlessness).", category: "Anxiety" },
  { q: "I had a feeling of shakiness (e.g. legs going to give way).", category: "Anxiety" },
  { q: "I found myself in situations that made me so anxious I was most relieved when they ended.", category: "Anxiety" },
  { q: "I had a feeling of faintness.", category: "Anxiety" },
  { q: "I was aware of the action of my heart in the absence of physical exertion.", category: "Anxiety" },
  { q: "I felt scared without any good reason.", category: "Anxiety" },

  // Stress (7)
  { q: "I found it hard to wind down.", category: "Stress" },
  { q: "I tended to over-react to situations.", category: "Stress" },
  { q: "I felt that I was using a lot of nervous energy.", category: "Stress" },
  { q: "I found myself getting agitated.", category: "Stress" },
  { q: "I found it difficult to relax.", category: "Stress" },
  { q: "I was intolerant of anything that kept me from getting on with what I was doing.", category: "Stress" },
  { q: "I felt that I was rather touchy.", category: "Stress" },
];

const options = [
  { label: "Did not apply to me at all", value: 0 },
  { label: "Applied to me to some degree, or some of the time", value: 1 },
  { label: "Applied to me to a considerable degree, or a good part of the time", value: 2 },
  { label: "Applied to me very much, or most of the time", value: 3 },
];

// ── DASS-21 uses a ×2 multiplier ─────────────────────────────────────────────
type Severity = "Normal" | "Mild" | "Moderate" | "Severe" | "Extremely Severe";

interface SeverityBand {
  label: Severity;
  color: string;      // Tailwind bg class
  text: string;       // Tailwind text class
  icon: ReactNode;
  advice: string;
}

const getDepSeverity = (score: number): SeverityBand => {
  if (score <= 9)  return { label: "Normal",           color: "bg-green-100",  text: "text-green-800",  icon: <CheckCircle className="h-5 w-5 text-green-600" />,   advice: "Your mood appears healthy. Keep up regular physical activity, quality sleep, and social connection to maintain your wellbeing." };
  if (score <= 13) return { label: "Mild",             color: "bg-yellow-100", text: "text-yellow-800", icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,  advice: "Mild low mood detected. Try light daily exercise (even a 20-minute walk), journaling, and setting small achievable goals each day." };
  if (score <= 20) return { label: "Moderate",         color: "bg-orange-100", text: "text-orange-800", icon: <AlertTriangle className="h-5 w-5 text-orange-500" />, advice: "Moderate depression symptoms. Consider speaking with a counsellor or therapist. Self-care routines, reducing isolation, and mindfulness can help significantly." };
  if (score <= 27) return { label: "Severe",           color: "bg-red-100",    text: "text-red-800",    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,    advice: "Severe symptoms detected. Please seek support from a mental health professional as soon as possible. Therapy (especially CBT) and/or medication can be highly effective." };
                   return { label: "Extremely Severe", color: "bg-red-200",    text: "text-red-900",    icon: <AlertTriangle className="h-5 w-5 text-red-700" />,    advice: "Extremely severe. Please reach out to a mental health professional or crisis helpline today. You don't have to face this alone — help is available." };
};

const getAnxSeverity = (score: number): SeverityBand => {
  if (score <= 7)  return { label: "Normal",           color: "bg-green-100",  text: "text-green-800",  icon: <CheckCircle className="h-5 w-5 text-green-600" />,   advice: "Anxiety levels appear normal. Maintain healthy habits like limiting caffeine, getting enough sleep, and practising deep breathing." };
  if (score <= 9)  return { label: "Mild",             color: "bg-yellow-100", text: "text-yellow-800", icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,  advice: "Mild anxiety present. Try box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s), reduce caffeine, and limit news/social media before bed." };
  if (score <= 14) return { label: "Moderate",         color: "bg-orange-100", text: "text-orange-800", icon: <AlertTriangle className="h-5 w-5 text-orange-500" />, advice: "Moderate anxiety. Grounding techniques (5-4-3-2-1 senses), regular aerobic exercise, and guided meditation apps can help. Consider seeing a therapist." };
  if (score <= 19) return { label: "Severe",           color: "bg-red-100",    text: "text-red-800",    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,    advice: "Severe anxiety. Professional support is strongly recommended. A therapist can guide you through CBT or exposure therapy, which are highly effective." };
                   return { label: "Extremely Severe", color: "bg-red-200",    text: "text-red-900",    icon: <AlertTriangle className="h-5 w-5 text-red-700" />,    advice: "Extremely severe anxiety. Please contact a mental health professional or helpline now. Panic symptoms can be treated effectively with the right support." };
};

const getStrSeverity = (score: number): SeverityBand => {
  if (score <= 14) return { label: "Normal",           color: "bg-green-100",  text: "text-green-800",  icon: <CheckCircle className="h-5 w-5 text-green-600" />,   advice: "Stress is within a healthy range. Keep using time-management techniques and schedule regular breaks and leisure activities." };
  if (score <= 18) return { label: "Mild",             color: "bg-yellow-100", text: "text-yellow-800", icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,  advice: "Mild stress. Try the Pomodoro technique for work, prioritise tasks, and protect time for hobbies and rest. Reducing screen time before bed helps too." };
  if (score <= 25) return { label: "Moderate",         color: "bg-orange-100", text: "text-orange-800", icon: <AlertTriangle className="h-5 w-5 text-orange-500" />, advice: "Moderate stress. Identify major stressors and consider what you can delegate or drop. Regular exercise, yoga, and mindfulness meditation are evidence-based stress reducers." };
  if (score <= 33) return { label: "Severe",           color: "bg-red-100",    text: "text-red-800",    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,    advice: "Severe stress. It's important to reduce your load — speak with a manager, doctor, or therapist. Chronic high stress affects physical health; don't ignore these signals." };
                   return { label: "Extremely Severe", color: "bg-red-200",    text: "text-red-900",    icon: <AlertTriangle className="h-5 w-5 text-red-700" />,    advice: "Extremely severe stress. Please seek support from a healthcare provider urgently. This level of stress poses real risks to your mental and physical health." };
};

// ── Gauge bar component ───────────────────────────────────────────────────────
const GaugeBar = ({ score, max, color }: { score: number; max: number; color: string }) => {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const API_URL = "https://d1otxgia1oi4us.cloudfront.net";

// ── Main component ────────────────────────────────────────────────────────────
const Questionnaire = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [backendResult, setBackendResult] = useState("");

  const progress = ((current + 1) / questions.length) * 100;

  // DASS-21 raw scores (sum × 2)
  const getScore = (cat: Category) =>
    questions.reduce((sum, q, i) => {
      if (q.category === cat) return sum + (answers[i] < 0 ? 0 : answers[i]);
      return sum;
    }, 0) * 2;

  const depressionScore = getScore("Depression");
  const anxietyScore    = getScore("Anxiety");
  const stressScore     = getScore("Stress");

  const depSev = getDepSeverity(depressionScore);
  const anxSev = getAnxSeverity(anxietyScore);
  const strSev = getStrSeverity(stressScore);

  const handleSelect = (value: number) => {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      try {
        const API_URL = "https://d1otxgia1oi4us.cloudfront.net";
        const response = await fetch(`${API_URL}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ depression: depressionScore, anxiety: anxietyScore, stress: stressScore }),
        });
        if (response.ok) {
          const data = await response.json();
          setBackendResult(data.result);
        } else {
          setBackendResult("Backend not responding");
        }
      } catch {
        setBackendResult("Server not connected");
      }
      setShowResults(true);
    }
  };

  const handlePrev = () => { if (current > 0) setCurrent(current - 1); };

  const handleReset = () => {
    setCurrent(0);
    setAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
    setBackendResult("");
  };

  const handleTalkToCompanion = () => {
    navigate("/chatbot", {
      state: {
        depression: depressionScore, anxiety: anxietyScore, stress: stressScore,
        depLabel: depSev.label, anxLabel: anxSev.label, strLabel: strSev.label,
        result: backendResult,
      },
    });
  };

  // Current category label for grouping indicator
  const currentCategory = questions[current].category;
  const categoryProgress = {
    Depression: questions.filter(q => q.category === "Depression").findIndex((_, i) =>
      questions.indexOf(questions.filter(q => q.category === "Depression")[i]) === current),
    Anxiety: 0,
    Stress: 0,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">

          {/* ── QUESTIONNAIRE ── */}
          {!showResults ? (
            <>
              <div className="text-center mb-10">
                <ClipboardList className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-3xl font-bold">Mental Health Assessment</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  DASS-21 questions
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">
                    Question {current + 1} of {questions.length}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${currentCategory === "Depression" ? "bg-blue-100 text-blue-700"
                      : currentCategory === "Anxiety" ? "bg-pink-100 text-pink-700"
                      : "bg-amber-100 text-amber-700"}`}>
                    {currentCategory}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg leading-snug">
                    {questions[current].q}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    How often did this apply to you over the past week?
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`block w-full p-3 text-left border rounded-lg text-sm transition-colors
                        ${answers[current] === opt.value
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "hover:bg-muted border-border"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrev} disabled={current === 0}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Prev
                </Button>
                <Button onClick={handleNext} disabled={answers[current] === -1}>
                  {current === questions.length - 1 ? "View Results" : "Next"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>

          ) : (
            /* ── RESULTS + MOOD DASHBOARD ── */
            <div>
              <div className="text-center mb-8">
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-3xl font-bold">Your Results</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on the DASS-21 scale (scores are raw sum × 2)
                </p>
              </div>

              {/* ── Mood Dashboard ─────────────────────────────────────── */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Mood Dashboard</h2>

                {/* Score cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { cat: "Depression", score: depressionScore, sev: depSev, max: 42, Icon: Brain,
                      gaugeColor: depressionScore <= 9 ? "bg-green-500" : depressionScore <= 13 ? "bg-yellow-400" : depressionScore <= 20 ? "bg-orange-400" : "bg-red-500" },
                    { cat: "Anxiety",    score: anxietyScore,    sev: anxSev, max: 42, Icon: Heart,
                      gaugeColor: anxietyScore <= 7  ? "bg-green-500" : anxietyScore <= 9  ? "bg-yellow-400" : anxietyScore <= 14 ? "bg-orange-400" : "bg-red-500" },
                    { cat: "Stress",     score: stressScore,     sev: strSev, max: 42, Icon: Zap,
                      gaugeColor: stressScore <= 14  ? "bg-green-500" : stressScore <= 18  ? "bg-yellow-400" : stressScore <= 25 ? "bg-orange-400" : "bg-red-500" },
                  ].map(({ cat, score, sev, max, Icon, gaugeColor }) => (
                    <Card key={cat} className="text-center">
                      <CardContent className="p-4 space-y-2">
                        <Icon className="h-6 w-6 mx-auto text-primary" />
                        <p className="text-xs font-medium text-muted-foreground">{cat}</p>
                        <p className="text-3xl font-bold">{score}</p>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${sev.color} ${sev.text}`}>
                          {sev.label}
                        </span>
                        <GaugeBar score={score} max={max} color={gaugeColor} />
                        <p className="text-xs text-muted-foreground">/ {max} max</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Visual bar chart */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Score Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {[
                      { label: "Depression", score: depressionScore, max: 42, color: "bg-blue-500",   thresholds: [9, 13, 20, 27] },
                      { label: "Anxiety",    score: anxietyScore,    max: 42, color: "bg-pink-500",   thresholds: [7,  9, 14, 19] },
                      { label: "Stress",     score: stressScore,     max: 42, color: "bg-amber-500",  thresholds: [14, 18, 25, 33] },
                    ].map(({ label, score, max, color, thresholds }) => (
                      <div key={label} className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{label}</span>
                          <span className="text-muted-foreground">{score} / {max}</span>
                        </div>
                        {/* Threshold zones */}
                        <div className="relative w-full h-5 rounded-full overflow-hidden flex">
                          {[
                            { pct: (thresholds[0] / max) * 100,                                  bg: "bg-green-200" },
                            { pct: ((thresholds[1] - thresholds[0]) / max) * 100,                bg: "bg-yellow-200" },
                            { pct: ((thresholds[2] - thresholds[1]) / max) * 100,                bg: "bg-orange-200" },
                            { pct: ((thresholds[3] - thresholds[2]) / max) * 100,                bg: "bg-red-200" },
                            { pct: ((max - thresholds[3]) / max) * 100,                          bg: "bg-red-300" },
                          ].map((zone, i) => (
                            <div key={i} className={`h-full ${zone.bg}`} style={{ width: `${zone.pct}%` }} />
                          ))}
                          {/* Score indicator */}
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full ${color} opacity-80 transition-all duration-700`}
                            style={{ width: `${(score / max) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-0.5 px-0.5">
                          <span>Normal</span><span>Mild</span><span>Moderate</span><span>Severe</span><span>Ex. Severe</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>

              {/* ── Diagnosis & Recommendations ─────────────────────────── */}
              <section className="mb-8 space-y-4">
                <h2 className="text-lg font-semibold">Diagnosis & Recommendations</h2>

                {[
                  { cat: "Depression", sev: depSev, score: depressionScore, Icon: Brain },
                  { cat: "Anxiety",    sev: anxSev, score: anxietyScore,    Icon: Heart },
                  { cat: "Stress",     sev: strSev, score: stressScore,     Icon: Zap },
                ].map(({ cat, sev, score, Icon }) => (
                  <Card key={cat} className={`border-l-4 ${
                    sev.label === "Normal"           ? "border-l-green-500"
                    : sev.label === "Mild"           ? "border-l-yellow-400"
                    : sev.label === "Moderate"       ? "border-l-orange-400"
                    : sev.label === "Severe"         ? "border-l-red-500"
                    :                                  "border-l-red-700"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {sev.icon}
                        <div>
                          <span className="font-semibold">{cat}</span>
                          <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${sev.color} ${sev.text}`}>
                            {sev.label} (score: {score})
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {sev.advice}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </section>

              {/* ── Disclaimer ──────────────────────────────────────────── */}
              <Card className="mb-6 bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Disclaimer:</strong> This assessment is based on the DASS-21 screening tool and is
                    intended for informational purposes only. It is not a clinical diagnosis. Please consult a
                    qualified mental health professional for a full evaluation and personalised treatment plan.
                  </p>
                </CardContent>
              </Card>

              {/* ── Actions ─────────────────────────────────────────────── */}
              <Button
                onClick={handleTalkToCompanion}
                className="w-full mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-6 text-base rounded-xl shadow-md"
              >
                <MessageCircleHeart className="mr-2 h-5 w-5" />
                Talk to Your AI Companion
              </Button>

              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" /> Retake Assessment
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
