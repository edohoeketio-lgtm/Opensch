import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import RevenueClient from "./RevenueClient";

export const dynamic = 'force-dynamic';

export default async function AdminRevenuePage() {
  const user = await getAuthenticatedUser();
  
  // Strict admin check
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch the definitive ledger
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { 
          email: true, 
          role: true,
          profile: {
            select: { fullName: true }
          }
        }
      },
      application: {
        select: { firstName: true, lastName: true, email: true, paymentStatus: true }
      },
      cohort: {
        select: { name: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-ink w-full p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-surface">Cohort Revenue</h1>
        <p className="text-admin-muted mt-2 text-sm leading-relaxed max-w-3xl">
          The definitive financial ledger. Track incoming payments, verify transaction integrity, and overview total platform revenue instantly.
        </p>
      </div>

      <RevenueClient initialTransactions={transactions as any} />
    </div>
  );
}
