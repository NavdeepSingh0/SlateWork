import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';

export function Layout() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-300',
          // On desktop: shift right when sidebar open; on mobile always full width
          'lg:ml-0',
          sidebarOpen ? 'lg:ml-[220px]' : 'lg:ml-0'
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Backdrop overlay when sidebar open on small screens - closes sidebar on tap */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
