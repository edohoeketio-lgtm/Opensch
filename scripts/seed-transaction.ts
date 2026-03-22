import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding mock financial data for QA...');

  // Ensure test cohort exists
  let cohort = await prisma.cohort.findFirst();
  if (!cohort) {
    cohort = await prisma.cohort.create({
      data: {
        name: "Test Financial Cohort",
        description: "QA Cohort",
        startDate: new Date(),
        status: "ACTIVE"
      }
    });
  }

  // Create a mock user
  const email = `test-finance-${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: {
      email,
      role: 'STUDENT',
      cohortId: cohort.id,
      profile: {
        create: {
          fullName: "Financier Test",
          username: `finance_test_${Date.now()}`
        }
      }
    }
  });

  // Create a mock application
  const app = await prisma.application.create({
    data: {
      firstName: "Financier",
      lastName: "Test",
      email: email,
      paymentStatus: "FULLY_PAID",
      status: "ENROLLED"
    }
  });

  // Create explicit TRANSACTIONS
  await prisma.transaction.create({
    data: {
      amount: 5000000, // 50,000 NGN
      currency: "NGN",
      reference: `QA-PAY-${Date.now()}`,
      status: "SUCCESS",
      paymentProvider: "paystack",
      applicationId: app.id,
      userId: user.id,
      cohortId: cohort.id,
    }
  });

  await prisma.transaction.create({
    data: {
      amount: 5000000, 
      currency: "NGN",
      reference: `QA-PENDING-${Date.now()}`,
      status: "PENDING",
      paymentProvider: "paystack",
      applicationId: app.id,
      userId: user.id,
      cohortId: cohort.id,
    }
  });

  console.log('Successfully seeded 1 Settled and 1 Pending transaction.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
