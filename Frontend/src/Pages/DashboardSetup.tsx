import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ensureCompanyId, createSession } from "@/lib/ensureCompanyId";
import { apiFetch } from "@/lib/api";

type Step = { id: 1 | 2 | 3; title: string; completed: boolean };
type FaqItem = { question: string; answer: string; tags?: string[] };
type FaqResult = { item: FaqItem; success: boolean; error?: string };

function ElapsedTime() {
  const startTime = useState(Date.now())[0];
  const [elapsed, setElapsed] = useState("0 sec");
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const s = Math.floor(diff / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);
      setElapsed(
        h > 0
          ? `${h} hour${h > 1 ? "s" : ""} ago`
          : m > 0
            ? `${m} min${m > 1 ? "s" : ""} ago`
            : `${s} sec${s > 1 ? "s" : ""} ago`
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [startTime]);
  return <p className="text-muted-foreground mb-6">Last trained: {elapsed}</p>;
}


export default function SetupPage() {
  const navigate = useNavigate();

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Upload or import FAQs (CSV, JSON, or manual entry)",
      completed: false,
    },
    { id: 2, title: "Pick mock user", completed: false },
    { id: 3, title: "Open preview chat", completed: false },
  ]);

  const [openStep, setOpenStep] = useState<1 | 2 | 3 | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [parsedFaqs, setParsedFaqs] = useState<FaqItem[]>([]);
  const [importResults, setImportResults] = useState<FaqResult[]>([]);
  const [importing, setImporting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  const allCompleted = steps.every((s) => s.completed);

  const setCompleted = (id: Step["id"], done = true) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: done } : s))
    );
  };

  const toggleOpen = (id: Step["id"]) => {
    setOpenStep((cur) => (cur === id ? null : id));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsedFaqs([]);
    setImportResults([]);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        alert("Invalid format: Expected JSON array");
        return;
      }

      // Validate each item
      const valid: FaqItem[] = [];
      for (const item of json) {
        if (
          !item.question ||
          !item.answer ||
          typeof item.question !== "string" ||
          typeof item.answer !== "string"
        ) {
          console.warn("Skipping invalid item:", item);
          continue;
        }
        valid.push({
          question: item.question.trim(),
          answer: item.answer.trim(),
          tags: Array.isArray(item.tags)
            ? item.tags.map((t: string) => t.trim()).filter(Boolean)
            : undefined,
        });
      }

      setParsedFaqs(valid);
    } catch (err: any) {
      alert(`Failed to parse JSON: ${err.message}`);
    }
  };

  const handleImport = async () => {
    if (parsedFaqs.length === 0) return;

    setImporting(true);
    const companyId = await ensureCompanyId();

    try {
      // Use bulk upload endpoint (single request, single Gemini call)
      const { error } = await apiFetch(`/companies/${companyId}/faqs/bulk`, {
        method: "POST",
        body: JSON.stringify({ faqs: parsedFaqs }),
      });

      if (error) {
        const results: FaqResult[] = parsedFaqs.map((item) => ({
          item,
          success: false,
          error,
        }));
        setImportResults(results);
      } else {
        const results: FaqResult[] = parsedFaqs.map((item) => ({
          item,
          success: true,
        }));
        setImportResults(results);
        setCompleted(1, true);
        setTimeout(() => setOpenStep(null), 1000);
      }
    } catch (err: any) {
      const results: FaqResult[] = parsedFaqs.map((item) => ({
        item,
        success: false,
        error: err.message || "Upload failed",
      }));
      setImportResults(results);
    } finally {
      setImporting(false);
    }
  };

  const handlePickEmployee = async (value: string) => {
    if (!value) return;
    setSelectedEmployee(value);
    setCreatingSession(true);

    try {
      const employee = employees.find((e) => e.id === value);
      const id = await createSession(employee?.name || value);
      setSessionId(id);
      setCompleted(2, true);
      setTimeout(() => setOpenStep(null), 500);
    } catch (err: any) {
      alert(`Failed to create session: ${err.message}`);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleOpenChat = () => {
    if (!sessionId) {
      alert("Please complete Step 2 first to create a session");
      return;
    }
    const url = `/chat?sessionId=${encodeURIComponent(sessionId)}`;
    const w = window.open(url, "_blank", "noopener,noreferrer");
    try {
      w?.focus();
    } catch {}
    setCompleted(3, true);
    setOpenStep(null);
  };

  const employees = [
    { id: "as", name: "Atharv Singh", role: "Team Admin" },
    { id: "rk", name: "Riya Kapoor", role: "Support Lead" },
    { id: "vk", name: "Vedant Kulkarni", role: "Escalations" },
    { id: "mb", name: "Meera Bansal", role: "L2 Specialist" },
    { id: "ag", name: "Arjun Gupta", role: "On-call" },
  ];

  const getActiveCompanyShortName = () => {
  const name =
    localStorage.getItem("companyName") ||
    localStorage.getItem("activeCompanyName") ||
    "Acme";
  return name.split(" ")[0]; // “StellarWorks Inc” → “StellarWorks”
};


  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold mb-3 text-balance">
          Welcome back,{" "}
          <span className="text-blue-600 ">
            {getActiveCompanyShortName()} Support Team
          </span>
          . <br />
          <span className="text-orange-500 ">Orion</span> is standing by.
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete these steps to activate your AI assistant
        </p>
      </div>

      {!allCompleted ? (
        <Card className="border-2">
          <CardContent className="p-8">
            <h2 className="font-display text-xl font-semibold mb-6">
              Setup Checklist
            </h2>

            {/* Step rows */}
            <div className="space-y-4">
              {/* STEP 1 */}
              <div className="rounded-lg border-2 hover:border-primary/50 transition-all">
                <button
                  type="button"
                  onClick={() => toggleOpen(1)}
                  className="w-full flex items-start gap-4 p-4 text-left"
                  aria-expanded={openStep === 1}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      steps[0].completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {steps[0].completed && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${steps[0].completed ? "text-muted-foreground line-through" : ""}`}
                    >
                      1.&nbsp;{steps[0].title}
                    </p>
                  </div>
                  <svg
                    className={`mt-1 w-5 h-5 opacity-70 transition-transform ${openStep === 1 ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openStep === 1 && (
                  <div
                    className="px-4 pb-4 space-y-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="rounded-lg border-2 border-dashed p-6 text-center">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {" "}
                        Upload JSON array: [
                        <code>{"{ question, answer, tags? }"}</code>]
                      </p>
                    </div>

                    {parsedFaqs.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          Preview ({parsedFaqs.length} items)
                        </div>
                        <div className="max-h-48 overflow-y-auto border rounded-md">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50 sticky top-0">
                              <tr>
                                <th className="text-left p-2 font-medium">
                                  Question
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Answer
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Tags
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {parsedFaqs.map((faq, i) => (
                                <tr key={i} className="border-t">
                                  <td className="p-2 max-w-xs truncate">
                                    {faq.question}
                                  </td>
                                  <td className="p-2 max-w-xs truncate">
                                    {faq.answer}
                                  </td>
                                  <td className="p-2">
                                    {faq.tags?.join(", ") || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <Button
                          onClick={handleImport}
                          disabled={importing}
                          size="sm"
                        >
                          {importing ? "Importing..." : "Import FAQs"}
                        </Button>

                        {importResults.length > 0 && (
                          <div className="text-sm space-y-1">
                            <p className="font-medium">
                              Progress:{" "}
                              {importResults.filter((r) => r.success).length}/
                              {importResults.length} successful
                            </p>
                            {importResults.some((r) => !r.success) && (
                              <div className="text-destructive text-xs max-h-20 overflow-y-auto">
                                {importResults
                                  .filter((r) => !r.success)
                                  .map((r, i) => (
                                    <div key={i}>
                                      Failed: {r.item.question.slice(0, 50)}...
                                      ({r.error})
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2 */}
              <div className="rounded-lg border-2 hover:border-primary/50 transition-all">
                <button
                  type="button"
                  onClick={() => toggleOpen(2)}
                  className="w-full flex items-start gap-4 p-4 text-left"
                  aria-expanded={openStep === 2}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      steps[1].completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {steps[1].completed && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${steps[1].completed ? "text-muted-foreground line-through" : ""}`}
                    >
                      2.&nbsp;{steps[1].title}
                    </p>
                    {selectedEmployee && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected:{" "}
                        <span className="font-medium">
                          {
                            employees.find((e) => e.id === selectedEmployee)
                              ?.name
                          }
                        </span>
                      </p>
                    )}
                  </div>
                  <svg
                    className={`mt-1 w-5 h-5 opacity-70 transition-transform ${openStep === 2 ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openStep === 2 && (
                  <div
                    className="px-4 pb-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="text-sm text-muted-foreground block mb-2">
                      Mock user for testing
                    </label>
                    <div className="flex items-center gap-3">
                      <select
                        className="min-w-60 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue=""
                        onChange={(e) => handlePickEmployee(e.target.value)}
                        disabled={creatingSession}
                      >
                        <option value="" disabled>
                          {creatingSession
                            ? "Creating session..."
                            : "Pick a mock user…"}
                        </option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} — {e.role}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-muted-foreground">
                        Creates session automatically.
                      </span>
                    </div>
                    {sessionId && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Session created: {sessionId}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3 */}
              <div className="rounded-lg border-2 hover:border-primary/50 transition-all">
                <button
                  type="button"
                  onClick={() => toggleOpen(3)}
                  className="w-full flex items-start gap-4 p-4 text-left"
                  aria-expanded={openStep === 3}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      steps[2].completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {steps[2].completed && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${steps[2].completed ? "text-muted-foreground line-through" : ""}`}
                    >
                      3.&nbsp;{steps[2].title}
                    </p>
                  </div>
                  <svg
                    className={`mt-1 w-5 h-5 opacity-70 transition-transform ${openStep === 3 ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openStep === 3 && (
                  <div
                    className="px-4 pb-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleOpenChat}
                        disabled={!sessionId}
                      >
                        Open preview chat
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {sessionId
                          ? "Opens in a new tab."
                          : "Complete Step 2 first."}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Orion is active.
            </h2>
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
  );
}
