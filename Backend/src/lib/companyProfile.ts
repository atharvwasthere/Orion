import { GoogleGenAI } from "@google/genai"
import { prisma } from "../config/prisma.ts"
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})
export async function generateCompanyProfile(companyId: string) {
  const faqs = await prisma.fAQ.findMany({ where: { companyId } })
  const text = faqs.map(f => `${f.question}\n${f.answer}`).join("\n\n")

  const prompt = `
Summarize these FAQs into a factual company profile.
Keep all operational details, locations, refund terms, and tone.
Format neatly as bullet points or a short summary.

${text}
`

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  })

  const summary = res.text
  console.log("Generated company profile:", summary)

  await prisma.company.update({
    where: { id: companyId } as { id: string },
    data: { companyProfile: summary } as { companyProfile: string | null },
  })

  return summary
}
