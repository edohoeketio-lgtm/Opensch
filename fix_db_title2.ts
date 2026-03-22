import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  await prisma.lesson.updateMany({
    where: { title: { contains: "720p" } },
    data: { title: "Learn the basics of Google Antigravity" }
  });
  console.log("Database retroactively cleaned!");
  await prisma.$disconnect();
}
run();
