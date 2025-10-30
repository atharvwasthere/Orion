import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

async function ensureDBConnection() {
  for (let i = 0; i < 5 ; i++){
    try{
      await prisma.$connect();
      console.log("Database connection established");
      break;
    } catch(err){
      console.warn(`Retrying connection attempt ${i+1}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Connection attempt ${i+1} failed`);
    }
  }
}

ensureDBConnection();