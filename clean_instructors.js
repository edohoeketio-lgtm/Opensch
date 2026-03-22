const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.user.deleteMany({
      where: {
        email: { not: 'edohoeketio@gmail.com' },
        role: { in: ['INSTRUCTOR', 'ADMIN'] }
      }
    });
    console.log(`Successfully deleted ${result.count} extra instructor/admin accounts.`);
  } catch (error) {
    console.error('Error cleaning instructors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
