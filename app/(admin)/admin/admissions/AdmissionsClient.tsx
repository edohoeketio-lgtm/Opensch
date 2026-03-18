"use client";

import { useState } from "react";
import { ApplicationStatus, PaymentStatus } from "@prisma/client";

const APPLICATION_STATUSES: ApplicationStatus[] = [
  'NEW', 'REVIEWING', 'INTERVIEWED', 'ACCEPTED', 'REJECTED', 'ENROLLED'
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  'UNPAID', 'DEPOSIT_PAID', 'FULLY_PAID'
];
import { updateApplicationStatus, updatePaymentStatus, convertApplicationToStudent } from "@/app/actions/admissions";
import { createPaystackSession } from "@/app/actions/billing";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface AdmissionsClientProps {
  initialApplications: any[];
  cohorts: any[];
}

export default function AdmissionsClient({ initialApplications, cohorts }: AdmissionsClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    setIsProcessing(id);
    try {
      const updated = await updateApplicationStatus(id, newStatus);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: updated.status } : app));
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setIsProcessing(null);
    }
  };

  const handlePaymentChange = async (id: string, newPaymentStatus: PaymentStatus) => {
    setIsProcessing(id);
    try {
      const updated = await updatePaymentStatus(id, newPaymentStatus);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, paymentStatus: updated.paymentStatus } : app));
    } catch (e) {
      console.error(e);
      alert("Failed to update payment");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleGeneratePaymentLink = async (id: string) => {
    setIsProcessing(id);
    try {
      const res = await createPaystackSession(id);
      await navigator.clipboard.writeText(res.authorizationUrl);
      // Fallback alert natively displaying it just in case HTTPS clipboard API is blocked locally
      alert(`Paystack Link Generated & Copied to Clipboard!\n\n${res.authorizationUrl}`);
    } catch (e: any) {
      console.error(e);
      alert(`Paystack Connection Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEnroll = async (appId: string, cohortId: string) => {
    if (!confirm("This will create a Student account and assign them to the selected cohort. Proceed?")) return;
    
    setIsProcessing(appId);
    try {
      await convertApplicationToStudent(appId, cohortId);
      alert("Student enrolled successfully!");
      router.refresh(); // Trigger server data reload
    } catch (e: any) {
      console.error(e);
      alert(`Enrollment failed: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadgeColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'NEW': return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 'REVIEWING': return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 'INTERVIEWED': return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case 'ACCEPTED': return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'REJECTED': return "bg-red-500/20 text-red-400 border-red-500/30";
      case 'ENROLLED': return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
      default: return "bg-white/10 text-white/70";
    }
  };

  const getPaymentBadgeColor = (status: PaymentStatus) => {
    switch (status) {
      case 'UNPAID': return "text-orange-400";
      case 'DEPOSIT_PAID': return "text-amber-300";
      case 'FULLY_PAID': return "text-green-400";
    }
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
        <p className="text-white/50 text-sm">No applications found in the pipeline.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((app) => (
        <div key={app.id} className="relative group bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
           {isProcessing === app.id && (
             <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="h-4 w-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
             </div>
           )}

           <div className="flex items-start justify-between gap-6">
              {/* Applicant Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-medium text-white">{app.firstName} {app.lastName}</h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getStatusBadgeColor(app.status)}`}>
                    {app.status}
                  </span>
                  <span className={`text-xs font-medium ${getPaymentBadgeColor(app.paymentStatus)}`}>
                    {app.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap text-sm text-white/50 gap-x-4 gap-y-1">
                  <span>{app.email}</span>
                  {app.experience && <span>• Exp: {app.experience}</span>}
                  <span>• Applied {formatDistanceToNow(new Date(app.appliedAt))} ago</span>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 pr-8">
                  <p className="text-sm leading-relaxed text-white/70 italic">&quot;{app.motivation || "No motivation provided"}&quot;</p>
                  {app.linkedinUrl && (
                    <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                      View LinkedIn →
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 min-w-[180px] shrink-0">
                 <select 
                   value={app.status} 
                   onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                   className="w-full bg-black border border-white/10 rounded-md text-sm px-3 py-1.5 focus:border-white/30 focus:outline-none"
                   disabled={app.status === 'ENROLLED'}
                 >
                   {APPLICATION_STATUSES.map(s => (
                     <option key={s} value={s}>{s}</option>
                   ))}
                 </select>

                 <select 
                   value={app.paymentStatus} 
                   onChange={(e) => handlePaymentChange(app.id, e.target.value as PaymentStatus)}
                   className="w-full bg-black border border-white/10 rounded-md text-sm px-3 py-1.5 focus:border-white/30 focus:outline-none"
                 >
                   {PAYMENT_STATUSES.map(s => (
                     <option key={s} value={s}>{s.replace('_', ' ')}</option>
                   ))}
                 </select>

                 {app.status === 'ACCEPTED' && app.paymentStatus === 'UNPAID' && (
                    <button 
                      onClick={() => handleGeneratePaymentLink(app.id)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 rounded-md text-sm transition-colors mt-2 border border-blue-500/50"
                    >
                      Generate Paystack Link
                    </button>
                 )}

                 {app.status === 'ACCEPTED' && (app.paymentStatus === 'FULLY_PAID' || app.paymentStatus === 'DEPOSIT_PAID') && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                       <select 
                          id={`cohort-${app.id}`} 
                          className="w-full bg-black border border-white/10 rounded-md text-sm px-3 py-1.5 mb-2"
                        >
                          <option value="">Select Cohort...</option>
                          {cohorts.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                       </select>
                       <button 
                         onClick={() => {
                           const cohortId = (document.getElementById(`cohort-${app.id}`) as HTMLSelectElement).value;
                           handleEnroll(app.id, cohortId);
                         }}
                         className="w-full bg-white text-black hover:bg-neutral-200 font-medium py-1.5 rounded-md text-sm transition-colors"
                       >
                         Enroll & Convert
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
