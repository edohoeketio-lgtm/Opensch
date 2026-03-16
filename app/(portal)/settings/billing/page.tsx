import { CreditCard, Download, Star, ExternalLink, ShieldCheck } from 'lucide-react';

export default function BillingSettingsPage() {
  const invoices = [
    { id: 'INV-2023-01', date: 'Oct 1, 2026', amount: '$49.00', status: 'Paid' },
    { id: 'INV-2023-02', date: 'Sep 1, 2026', amount: '$49.00', status: 'Paid' },
    { id: 'INV-2023-03', date: 'Aug 1, 2026', amount: '$49.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight mb-6">Billing & Subscription</h2>
        
        {/* Current Plan Card */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#2D2D2D] relative overflow-hidden mb-8">
          {/* Subtle gradient accent for premium */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B08D57]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#B08D57]/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#B08D57]" />
                </div>
                <h3 className="text-xl font-bold text-[#FFFFFF] tracking-tight">Premium Scholar</h3>
              </div>
              <p className="text-[#9CA3AF] text-sm">You are on the premium tier. Your next charge is <span className="font-semibold text-[#FFFFFF]">$49.00</span> on <strong className="text-[#FFFFFF]">Nov 1, 2026</strong>.</p>
            </div>
            
            <div className="flex flex-col gap-2 shrink-0">
               <button className="px-5 py-2.5 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_15px_rgba(245,242,235,0.15)] flex justify-center items-center">
                 Upgrade Plan
               </button>
               <button className="px-5 py-2.5 rounded-xl text-[#888888] hover:text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.1em] transition-colors flex justify-center items-center">
                 Cancel Subscription
               </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-[0.1em] mb-4">Payment Method</h3>
          <div className="p-5 rounded-xl bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                   <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#FFFFFF] tracking-tight">Visa ending in 4242</p>
                  <p className="text-xs text-[#888888]">Expires 04/2028</p>
                </div>
             </div>
             <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-[#FFFFFF] transition-colors">
               Update
             </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#888888]">
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            Payments are securely processed by Stripe.
          </div>
        </div>

        {/* Invoice History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-[0.1em]">Invoice History</h3>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          
          <div className="overflow-hidden rounded-xl bg-[#1C1C1E] border border-[#2D2D2D]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#111111] text-[#888888] text-[10px] uppercase tracking-[0.15em] border-b border-[#2D2D2D]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 text-[#FFFFFF] font-medium">{inv.date}</td>
                    <td className="px-5 py-4 text-[#9CA3AF]">{inv.amount}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 uppercase tracking-[0.1em]">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-1.5 rounded-lg text-[#888888] hover:text-[#FFFFFF] hover:bg-white/5 transition-colors inline-flex">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
