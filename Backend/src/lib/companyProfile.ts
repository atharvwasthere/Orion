import { GoogleGenAI } from "@google/genai";
import { prisma } from "../config/prisma.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateCompanyProfile(companyId: string) {
  if (!companyId || typeof companyId !== "string" || companyId.length < 5) {
    throw new Error("Invalid company ID");
  }

  const faqs = await prisma.fAQ.findMany({
    where: { companyId },
    select: { question: true, answer: true },
  });

  if (faqs.length === 0) {
    throw new Error(`No FAQs found for company ${companyId}`);
  }

  const faqText = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  const prompt = [`
    You are a business analyst and customer-support strategist.
    Your task is to create a concise, factual company profile based ONLY on the following FAQs.
    Summarize the company’s operations, communication tone, and service philosophy.

    If the FAQs omit details (for example: refund policy, delivery timelines, or escalation handling),
    infer the company’s likely stance using tone and wording consistency—but do NOT invent unrelated facts.
    Base every inference on linguistic or policy cues inside the FAQs themselves.

    Guidance:
    • If refunds are mentioned briefly or ambiguously, clarify whether they seem flexible, strict, or handled case-by-case.
    • If escalation appears unnecessary (for quick refunds or simple account issues), note that routine queries are self-resolvable.
    • If contact tone sounds formal, friendly, or casual, reflect that in the description.

    Output format:(for each section)
    - 5 bullet points or short paragraphs.
    - Keep language plain, factual, and company-specific.
    - No markdown, headings, or meta commentary.
    - Do not include any phrases like "based on your prompt" or "here is the summary".

    FAQs:`,
    faqText,
  ].join("\n");

  try {
    console.log(`🔵 GEMINI API CALL: Generating company profile for ${companyId} (${faqs.length} FAQs)`);
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const summary = res?.text?.trim();
    if (!summary) throw new Error("Empty summary from model");

    await prisma.company.update({
      where: { id: companyId },
      data: { companyProfile: summary },
    });

    console.log(`✅ Company profile generated and saved for ${companyId}`);
    return summary;
  } catch (err: any) {
    console.error(`❌ Company profile generation failed for ${companyId}:`, err.message || err);
    throw new Error("Profile generation failed");
  }
}
