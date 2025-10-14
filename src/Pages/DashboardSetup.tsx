import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { useNavigate } from "@tanstack/react-router";


function ElapsedTime() {
  const startTime = useState(Date.now())[0]; // store when component loaded
  const [elapsed, setElapsed] = useState("0 sec");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      let display;
      if (hours > 0) display = `${hours} hour${hours > 1 ? "s" : ""} ago`;
      else if (minutes > 0) display = `${minutes} min${minutes > 1 ? "s" : ""} ago`;
      else display = `${seconds} sec${seconds > 1 ? "s" : ""} ago`;

      setElapsed(display);
    }, 10000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <p className="text-muted-foreground mb-6">Last trained: {elapsed}</p>;
}


export default function SetupPage() {
  const navigate = useNavigate()

  const [steps, setSteps] = useState([
    { id: 1, title: "Upload or import FAQs (CSV, JSON, or manual entry)", completed: false },
    { id: 2, title: "Define escalation contact(s)", completed: false },
    { id: 3, title: "Test your bot in the preview chat", completed: false },
  ])

  const allCompleted = steps.every((step) => step.completed)

  const toggleStep = (id: number) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step)))
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold mb-3 text-balance">
          Welcome back, Acme Support Team. Orion is standing by.
        </h1>
        <p className="text-lg text-muted-foreground">Complete these steps to activate your AI assistant</p>
      </div>

      {!allCompleted ? (
        <Card className="border-2">
          <CardContent className="p-8">
            <h2 className="font-display text-xl font-semibold mb-6">Setup Checklist</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-start gap-4 p-4 rounded-lg border-2 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => toggleStep(step.id)}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      step.completed ? "bg-primary border-primary" : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {step.completed && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? "text-muted-foreground line-through" : ""}`}>
                      {index + 1}. {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Orion is active.</h2>
            <ElapsedTime />            
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
