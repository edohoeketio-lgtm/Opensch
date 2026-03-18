import { redirect } from 'next/navigation';
import { Search, Bell, Settings } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { MobileAdminDrawer } from './components/MobileAdminDrawer';
import { ToastProvider } from '@/app/(portal)/components/ToastContext';
import { getAuthenticatedUser } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'INSTRUCTOR');
  
  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <ToastProvider>
      <div className="flex bg-ink text-surface h-screen overflow-hidden font-sans selection:bg-white/30">
        
        <AdminSidebar />

        {/* Main Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-ink">
          
          {/* Top Utility Bar (Admin specific tint) */}
          <header className="h-16 border-b border-admin-border flex items-center justify-between px-4 md:px-8 shrink-0 bg-ink/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <MobileAdminDrawer />
              <span className="hidden md:inline-block px-2 py-1 rounded bg-admin-surface border border-admin-border text-[10px] font-bold tracking-[0.2em] uppercase text-accent">ADMIN MODE</span>
              <span className="text-sm font-medium text-surface hidden sm:inline-block">Command Center Active</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Admin Search trigger */}
               <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-admin-border bg-white/5 text-xs font-medium cursor-pointer hover:bg-white/10 hover:border-admin-border transition-all duration-300 text-surface">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search students or deliverables...</span>
                  <kbd className="font-sans text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-surface tracking-widest ml-4">⌘K</kbd>
               </div>
               
               {/* Notification */}
               <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-admin-surface transition-colors text-[#AAAAAA] hover:text-surface">
                  <Bell className="w-4 h-4" />
               </button>

               {/* Settings */}
               <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-admin-surface transition-colors text-[#AAAAAA] hover:text-surface">
                  <Settings className="w-4 h-4" />
               </button>
            </div>
          </header>

          {/* Main Viewport */}
          <main className="flex-1 overflow-y-auto relative bg-ink">
            {children}
          </main>
        </div>

      </div>
    </ToastProvider>
  );
}
