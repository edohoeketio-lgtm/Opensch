import { getApplications } from "@/app/actions/admissions";
import AdmissionsClient from "./AdmissionsClient";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admissions Pipeline | OpenSch Admin",
};

export default async function AdmissionsPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const applications = await getApplications();
  const cohorts = await prisma.cohort.findMany({
    orderBy: { startDate: 'desc' }
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black text-white/90">
      <div className="px-6 py-5 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-medium text-white tracking-tight">Admissions Pipeline</h1>
        <p className="text-sm text-white/50 mt-1">Review prospect applications, track payments, and enroll students.</p>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <AdmissionsClient 
          initialApplications={applications} 
          cohorts={cohorts}
        />
      </div>
    </div>
  );
}
