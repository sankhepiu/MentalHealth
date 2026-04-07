import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight, RotateCcw, ClipboardList, Brain, Heart, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Category = "Depression" | "Anxiety" | "Stress";

const questions = [
  { q: "I felt sad and depressed.", category: "Depression" as Category },
  { q: "I had no interest in things.", category: "Depression" as Category },
  { q: "I felt worthless.", category: "Depression" as Category },

  { q: "I felt nervous or anxious.", category: "Anxiety" as Category },
  { q: "I had trouble breathing.", category: "Anxiety" as Category },
  { q: "I felt close to panic.", category: "Anxiety" as Category },

  { q: "I found it hard to relax.", category: "Stress" as Category },
  { q: "I overreacted to situations.", category: "Stress" as Category },
  { q: "I felt easily irritated.", category: "Stress" as Category },
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const categoryIcons: Record<Category, ReactNode> = {
  Depression: <Brain className="h-5 w-5" />,
  Anxiety: <Heart className="h-5 w-5" />,
  Stress: <Zap className="h-5 w-5" />,
};

const Questionnaire = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [backendResult, setBackendResult] = useState("");

  const progress = ((current + 1) / questions.length) * 100;

  const getCategoryScore = (cat: Category) => {
    return questions.reduce((sum, q, i) => {
      if (q.category === cat) {
        return sum + (answers[i] === -1 ? 0 : answers[i]);
      }
      return sum;
    }, 0);
  };

  const depressionScore = getCategoryScore("Depression");
  const anxietyScore = getCategoryScore("Anxiety");
  const stressScore = getCategoryScore("Stress");

  const handleSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      try {
        const response = await fetch("http://localhost:3000/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            depression: depressionScore,
            anxiety: anxietyScore,
            stress: stressScore,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setBackendResult(data.result);
        } else {
          setBackendResult("Backend not responding");
        }
      } catch (error) {
        setBackendResult("Server not connected");
      }

      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleReset = () => {
    setCurrent(0);
    setAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
    setBackendResult("");
  };

  const currentCategory = questions[current].category;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">

          {!showResults ? (
            <>
              <div className="text-center mb-10">
                <ClipboardList className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-3xl font-bold">Mental Health Assessment</h1>
              </div>

              <div className="mb-6">
                <span>Question {current + 1} / {questions.length}</span>
                <Progress value={progress} className="h-2 mt-2" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{questions[current].q}</CardTitle>
                </CardHeader>

                <CardContent>
                  {options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`block w-full p-3 mb-2 border rounded ${
                        answers[current] === opt.value ? "bg-green-200" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Button onClick={handlePrev} disabled={current === 0}>
                  <ArrowLeft /> Prev
                </Button>

                <Button onClick={handleNext} disabled={answers[current] === -1}>
                  {current === questions.length - 1 ? "Submit" : "Next"}
                  <ArrowRight />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">

              <h1 className="text-3xl font-bold mb-6">Results</h1>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    {categoryIcons.Depression}
                    <h3>Depression</h3>
                    <p>{depressionScore}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    {categoryIcons.Anxiety}
                    <h3>Anxiety</h3>
                    <p>{anxietyScore}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    {categoryIcons.Stress}
                    <h3>Stress</h3>
                    <p>{stressScore}</p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-lg font-semibold text-primary">
                {backendResult}
              </p>

              <Button onClick={handleReset} className="mt-6">
                <RotateCcw /> Retake
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