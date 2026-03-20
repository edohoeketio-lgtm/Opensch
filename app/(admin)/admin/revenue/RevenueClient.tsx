"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  Wallet, 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

export default function RevenueClient({ initialTransactions }: { initialTransactions: any[] }) {
  const [transactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (amountKobo: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(amountKobo / 100);
  };

  const activeRevenue = transactions
    .filter(t => t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingRevenue = transactions
    .filter(t => t.status === "PENDING")
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px] font-bold tracking-wider uppercase">
            <CheckCircle2 className="w-3 h-3" /> Settled
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold tracking-wider uppercase">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "FAILED":
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold tracking-wider uppercase">
            <AlertCircle className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return null;
    }
  };

  const filteredTxs = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    const email = t.application?.email || t.user?.email || "";
    const name = t.application?.firstName || t.user?.profile?.fullName || "";
    const ref = t.reference || "";
    return email.toLowerCase().includes(q) || name.toLowerCase().includes(q) || ref.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Level KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border border-admin-border bg-admin-surface rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
               <div>
                  <p className="text-admin-muted text-xs font-bold tracking-[0.2em] uppercase mb-1">Total Settled</p>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-surface">{formatCurrency(activeRevenue)}</h3>
               </div>
               <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <Wallet className="text-teal-400 w-5 h-5" />
               </div>
            </div>
            <div className="mt-8 flex items-center gap-2">
               <span className="text-xs font-medium text-admin-muted-dark">Across all successful payments</span>
            </div>
        </div>

        <div className="col-span-1 border border-admin-border bg-admin-surface rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
               <div>
                  <p className="text-admin-muted text-xs font-bold tracking-[0.2em] uppercase mb-1">Awaiting Capture</p>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-surface">{formatCurrency(pendingRevenue)}</h3>
               </div>
               <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Clock className="text-amber-400 w-5 h-5" />
               </div>
            </div>
            <div className="mt-8 flex items-center gap-2">
               <span className="text-xs font-medium text-admin-muted-dark">Initiated checkouts not yet finalized</span>
            </div>
        </div>

        <div className="col-span-1 border border-admin-border bg-admin-surface rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
               <div>
                  <p className="text-admin-muted text-xs font-bold tracking-[0.2em] uppercase mb-1">Conversion Rate</p>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-surface">
                    {transactions.length > 0 
                      ? Math.round((transactions.filter(t => t.status === "SUCCESS").length / transactions.length) * 100) 
                      : 0}%
                  </h3>
               </div>
               <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <ArrowUpRight className="text-indigo-400 w-5 h-5" />
               </div>
            </div>
            <div className="mt-8 flex items-center justify-between w-full">
               <span className="text-xs font-medium text-admin-muted-dark">
                  {transactions.filter(t => t.status === "SUCCESS").length} / {transactions.length} Intentions
               </span>
               <div className="w-24 h-1.5 bg-admin-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${transactions.length > 0 ? (transactions.filter(t => t.status === "SUCCESS").length / transactions.length) * 100 : 0}%`}}
                  />
               </div>
            </div>
        </div>
      </div>

      {/* Transaction Ledger Data Grid */}
      <div className="border border-admin-border bg-admin-surface rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
         <div className="p-5 border-b border-admin-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ink/30">
            <h2 className="text-lg font-bold text-surface tracking-tight flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-accent" /> System Ledger
            </h2>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="w-4 h-4 text-admin-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                     type="text" 
                     placeholder="Search reference or email..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-ink border border-admin-border rounded-lg pl-9 pr-4 py-2 text-sm text-surface placeholder:text-admin-muted-dark focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all w-full sm:w-64"
                  />
               </div>
               <button className="h-9 px-3 border border-admin-border rounded-lg bg-ink text-surface text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                 <Filter className="w-4 h-4 text-admin-muted" /> Filter
               </button>
            </div>
         </div>

         {filteredTxs.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-admin-border mb-4">
                 <Wallet className="w-8 h-8 text-admin-muted-dark" />
              </div>
              <h3 className="text-lg font-bold text-surface">No ledger records found</h3>
              <p className="text-admin-muted mt-2 max-w-sm mx-auto text-sm leading-relaxed">
                 {searchQuery ? "No transactions match your search filter." : "Once payments are initiated through the admissions pipeline, the immutable ledger rows will populate here."}
              </p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-admin-border bg-ink/50">
                   <th className="p-4 text-xs font-bold tracking-[0.15em] uppercase text-admin-muted">Date</th>
                   <th className="p-4 text-xs font-bold tracking-[0.15em] uppercase text-admin-muted">Applicant</th>
                   <th className="p-4 text-xs font-bold tracking-[0.15em] uppercase text-admin-muted">Amount</th>
                   <th className="p-4 text-xs font-bold tracking-[0.15em] uppercase text-admin-muted">Reference / Provider</th>
                   <th className="p-4 text-xs font-bold tracking-[0.15em] uppercase text-admin-muted">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-admin-border">
                 {filteredTxs.map((tx) => {
                   const name = tx.application?.firstName 
                      ? `${tx.application.firstName} ${tx.application.lastName}`
                      : tx.user?.profile?.fullName || "Legacy Applicant";
                   
                   const email = tx.application?.email || tx.user?.email || "Unknown Email";

                   return (
                     <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4">
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-surface">{format(new Date(tx.createdAt), "MMM d, yyyy")}</span>
                           <span className="text-xs text-admin-muted mt-0.5">{format(new Date(tx.createdAt), "h:mm a")}</span>
                         </div>
                       </td>
                       <td className="p-4">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-surface">{name}</span>
                             <span className="text-xs text-admin-muted mt-0.5">{email}</span>
                          </div>
                       </td>
                       <td className="p-4 whitespace-nowrap">
                         <span className="text-sm font-bold text-surface tabular-nums">
                           {formatCurrency(tx.amount, tx.currency)}
                         </span>
                       </td>
                       <td className="p-4">
                          <div className="flex flex-col">
                             <span className="text-xs font-mono text-admin-muted bg-ink px-1.5 py-0.5 rounded border border-admin-border inline-block w-fit">
                               {tx.reference}
                             </span>
                             <span className="text-[10px] font-bold tracking-wider text-admin-muted-dark uppercase mt-1">
                               {tx.paymentProvider}
                             </span>
                          </div>
                       </td>
                       <td className="p-4">
                         {getStatusBadge(tx.status)}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
      </div>

    </div>
  );
}
