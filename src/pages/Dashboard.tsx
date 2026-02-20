import { useState, useMemo } from 'react';
import { Plus, Upload, List, LayoutGrid, Filter } from 'lucide-react';
import { StatCard } from '@/components/ui-custom/StatCard';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Avatar } from '@/components/ui-custom/Avatar';
import { TagBadge } from '@/components/ui-custom/TagBadge';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useApp } from '@/store/AppContext';
import type { ArticleStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type ViewMode = 'list' | 'grid';
type StatusFilter = 'all' | ArticleStatus;

export function Dashboard() {
  const { articles, addArticle, filteredArticles: searchResults, searchQuery } = useApp();
  const { workspaces } = useWorkspaces();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('all');

  // Use search-filtered articles if there's a search query, otherwise use all articles
  const baseArticles = searchQuery.trim() ? searchResults : articles;

  const filteredArticles = useMemo(() => {
    return baseArticles.filter((article) => {
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      const matchesWorkspace = selectedWorkspace === 'all' || article.workspaceId === selectedWorkspace;
      return matchesStatus && matchesWorkspace;
    });
  }, [baseArticles, statusFilter, selectedWorkspace]);

  // Compute live stats from actual data
  const liveStats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const archived = articles.filter(a => a.status === 'archived').length;
    return [
      { label: 'Total Articles', value: total },
      { label: 'Published', value: published },
      { label: 'Drafts', value: drafts },
      { label: 'Archived', value: archived },
    ];
  }, [articles]);

  const statusTabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for import */}
      <input
        type="file"
        id="import-file"
        className="hidden"
        accept=".txt,.md,.markdown"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const text = await file.text();
          const title = file.name.replace(/\.(txt|md|markdown)$/, '').replace(/[-_]/g, ' ');
          await addArticle({
            title,
            content: text,
            workspaceId: workspaces[0]?.id || '',
            status: 'draft',
            tags: [],
          });
          e.target.value = '';
        }}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Overview of your workspace activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => document.getElementById('import-file')?.click()}
            className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <Link
            to="/articles"
            className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {liveStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="h-9 pl-3 pr-8 bg-surface border border-surface-border rounded-md text-sm text-text-primary appearance-none cursor-pointer hover:border-text-muted focus:outline-none focus:border-text-muted transition-colors"
            >
              <option value="all">All Workspaces</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
          <div className="flex items-center gap-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  'h-9 px-3 text-sm font-medium transition-colors relative',
                  statusFilter === tab.value
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {tab.label}
                {statusFilter === tab.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface border border-surface-border rounded-md p-1">
          <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded transition-colors', viewMode === 'list' ? 'text-text-primary bg-surface-border' : 'text-text-muted hover:text-text-primary')}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded transition-colors', viewMode === 'grid' ? 'text-text-primary bg-surface-border' : 'text-text-muted hover:text-text-primary')}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article List */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface border border-surface-border rounded-lg">
          <p className="text-text-muted text-sm">No articles found</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-hover">
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Title</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Status</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Author</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Workspace</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article, index) => (
                <tr key={article.id} className={cn('group hover:bg-surface-hover transition-colors', index !== filteredArticles.length - 1 && 'border-b border-surface-border')}>
                  <td className="px-4 py-3">
                    <Link to={`/articles/${article.id}`} className="text-sm font-medium text-text-primary hover:underline">{article.title}</Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={article.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={article.author.initials} size="sm" />
                      <span className="text-sm text-text-secondary">{article.author.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><TagBadge name={workspaces.find(w => w.id === article.workspaceId)?.name || 'Unknown'} /></td>
                  <td className="px-4 py-3"><span className="text-sm text-text-muted">{formatDate(article.updatedAt)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <Link key={article.id} to={`/articles/${article.id}`} className="bg-surface border border-surface-border rounded-lg p-5 hover:border-text-muted transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={article.status} />
              </div>
              <h3 className="text-sm font-medium text-text-primary mb-3 line-clamp-2 group-hover:underline">{article.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar initials={article.author.initials} size="sm" />
                  <span className="text-xs text-text-muted">{article.author.fullName}</span>
                </div>
                <span className="text-xs text-text-muted">{formatDate(article.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
