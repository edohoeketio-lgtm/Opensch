import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter, log: ['error'] });

async function main() {
  await prisma.application.createMany({
    data: [
      {
        firstName: "Alice",
        lastName: "Nwajei",
        email: "alice@example.com",
        experience: "Beginner",
        motivation: "I want to build a startup.",
        status: "NEW",
        paymentStatus: "UNPAID"
      },
      {
        firstName: "Bob",
        lastName: "Omotola",
        email: "bob@example.com",
        experience: "Advanced",
        motivation: "Looking to scale my existing engineering skills.",
        status: "REVIEWING",
        paymentStatus: "UNPAID"
      },
      {
        firstName: "Charlie",
        lastName: "Adeyemi",
        email: "charlie@example.com",
        experience: "Intermediate",
        motivation: "Need strict accountability.",
        status: "ACCEPTED",
        paymentStatus: "FULLY_PAID"
      }
    ]
  });
  console.log("Seeded test applications.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
