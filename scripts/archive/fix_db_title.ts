import prisma from './lib/prisma';
async function run() {
  await prisma.lesson.updateMany({
    where: { title: { contains: "720p" } },
    data: { title: "Learn the basics of Google Antigravity" }
  });
  console.log("Database retroactively cleaned!");
}
run();
