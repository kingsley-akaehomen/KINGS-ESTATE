import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    
    try {
      await prisma.$connect();
      console.log('Connected to the database');
      
      // Your other code here
      
    } catch (error) {
      console.error('Error connecting to the database:', error);
      // Handle error
    } finally {
      await prisma.$disconnect();
    }
  }
  
  main();

export default prisma;
