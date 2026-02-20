import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  MessageSquare,
  Archive,
  Settings,
  Plus,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { useApp } from '@/store/AppContext';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Articles', icon: FileText, path: '/articles' },
  { label: 'Discussions', icon: MessageSquare, path: '/discussions' },
  { label: 'Archive', icon: Archive, path: '/archive' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { sidebarOpen } = useApp();
  const { workspaces, addWorkspace } = useWorkspaces();

  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWorkspace = async (name: string) => {
    if (!name.trim()) {
      setIsAddingWorkspace(false);
      return;
    }

    setIsSubmitting(true);
    const added = await addWorkspace(name.trim(), '');
    setIsSubmitting(false);

    if (added) {
      setIsAddingWorkspace(false);
      setNewWorkspaceName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateWorkspace(newWorkspaceName);
    } else if (e.key === 'Escape') {
      setIsAddingWorkspace(false);
      setNewWorkspaceName('');
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen w-[220px] bg-sidebar-bg border-r border-surface-border flex flex-col z-50 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          {/* Slatework stacked pages icon */}
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 42 L32 52 L56 42 L56 38 Q56 36 54 35 L34 45 Q32 46 30 45 L10 35 Q8 36 8 38 Z" fill="#FAFAFA" />
            <path d="M8 34 L32 44 L56 34 L56 30 Q56 28 54 27 L34 37 Q32 38 30 37 L10 27 Q8 28 8 30 Z" fill="#FAFAFA" />
            <path d="M10 19 Q8 20 8 22 L8 26 L32 36 L56 26 L56 22 Q56 20 54 19 L34 12 Q32 11 30 12 Z" fill="#FAFAFA" />
          </svg>
          <span className="text-text-primary font-semibold text-sm tracking-tight">SlateWork</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-surface-border text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Workspaces Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium">
              Workspaces
            </span>
            <button
              onClick={() => setIsAddingWorkspace(true)}
              className="text-text-muted hover:text-text-primary transition-colors"
              title="Create Workspace"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {workspaces.map((workspace) => (
              <NavLink
                key={workspace.id}
                to={`/articles?workspace=${workspace.id}`}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left"
              >
                <span className="w-2 h-2 rounded-full bg-text-muted flex-shrink-0" />
                <span className="truncate">{workspace.name}</span>
              </NavLink>
            ))}
            {isAddingWorkspace && (
              <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] text-text-primary bg-surface-hover/50">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => handleCreateWorkspace(newWorkspaceName)}
                  disabled={isSubmitting}
                  placeholder="Workspace name..."
                  className="bg-transparent border-none focus:outline-none w-full text-[13px] placeholder:text-text-muted/50"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="py-2 px-3 border-t border-surface-border">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-surface-border text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* User Profile */}
        <div className="mt-2 pt-2 border-t border-surface-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-surface-border flex items-center justify-center flex-shrink-0">
              <span className="text-text-primary text-xs font-medium">{profile?.initials || '?'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-text-primary font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-text-muted capitalize">{profile?.role || 'member'}</p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded hover:bg-surface-hover"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
