import { prisma } from "../src/config/prisma.ts";
async function main() {
  const company = await prisma.company.upsert({
    where: { name: "Acme Inc" },
    update: {},
    create: {
      name: "Acme Inc",
      faqs: {
        create: [
          { question: "Refund policy?", answer: "Refunds within 5 days.", tags: ["billing"] },
          { question: "Support hours?", answer: "24/7 email support.", tags: ["support"] },
        ],
      },
    },
  });
  console.log("Seeded company:", company.name);
}
main().finally(() => prisma.$disconnect());
