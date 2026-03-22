import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool as any)
  const prisma = new PrismaClient({ adapter, log: ['error'] })

  const deleted = await prisma.user.deleteMany({
    where: {
      role: 'INSTRUCTOR',
      email: {
        not: 'edohoeketio@gmail.com'
      }
    }
  });
  console.log(`Deleted ${deleted.count} instructor accounts.`);
  await prisma.$disconnect()
}

main().catch(console.error)
