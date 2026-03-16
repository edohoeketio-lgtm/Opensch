import { redirect } from 'next/navigation';
import { Search, Bell, Settings } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = true; // In production this would check role
  
  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <div className="flex bg-[#111111] text-[#FFFFFF] h-screen overflow-hidden font-sans selection:bg-white/30">
      
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#111111]">
        
        {/* Top Utility Bar (Admin specific tint) */}
        <header className="h-16 border-b border-[#2D2D2D] flex items-center justify-between px-8 shrink-0 bg-[#111111]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-[#1C1C1E] border border-[#2D2D2D] text-[10px] font-bold tracking-[0.2em] uppercase text-[#B08D57]">ADMIN MODE</span>
            <span className="text-sm font-medium text-[#FFFFFF]">Command Center Active</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Admin Search trigger */}
             <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-[#2D2D2D] bg-white/5 text-xs font-medium cursor-pointer hover:bg-white/10 hover:border-[#2D2D2D] transition-all duration-300 text-[#FFFFFF]">
                <Search className="w-3.5 h-3.5" />
                <span>Search students or deliverables...</span>
                <kbd className="font-sans text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#FFFFFF] tracking-widest ml-4">⌘K</kbd>
             </div>
             
             {/* Notification */}
             <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1C1C1E] transition-colors text-[#AAAAAA] hover:text-[#FFFFFF]">
                <Bell className="w-4 h-4" />
             </button>

             {/* Settings */}
             <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1C1C1E] transition-colors text-[#AAAAAA] hover:text-[#FFFFFF]">
                <Settings className="w-4 h-4" />
             </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto relative bg-[#111111]">
          {children}
        </main>
      </div>

    </div>
  );
}
