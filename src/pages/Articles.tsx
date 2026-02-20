import { useState, useMemo, useEffect } from 'react';
import { Plus, Filter, List, LayoutGrid, X } from 'lucide-react';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Avatar } from '@/components/ui-custom/Avatar';
import { TagBadge } from '@/components/ui-custom/TagBadge';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useApp } from '@/store/AppContext';
import type { ArticleStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Link, useSearchParams } from 'react-router-dom';

type ViewMode = 'list' | 'grid';
type StatusFilter = 'all' | ArticleStatus;

export function ArticlesPage() {
  const { articles, addArticle, archiveArticle, deleteArticle } = useApp();
  const { workspaces, tags: allTags } = useWorkspaces();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(searchParams.get('workspace') || 'all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newWorkspace, setNewWorkspace] = useState('1');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<ArticleStatus>('draft');

  // Sync workspace filter from URL when navigating via sidebar
  useEffect(() => {
    const wsParam = searchParams.get('workspace');
    setSelectedWorkspace(wsParam || 'all');
  }, [searchParams]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      const matchesWorkspace = selectedWorkspace === 'all' || article.workspaceId === selectedWorkspace;
      return matchesStatus && matchesWorkspace;
    });
  }, [articles, statusFilter, selectedWorkspace]);

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

  const handleCreateArticle = () => {
    if (!newTitle.trim()) return;
    addArticle({
      title: newTitle,
      content: newContent || `# ${newTitle}\n\nStart writing here...`,
      workspaceId: newWorkspace,
      status: newStatus,
      tags: allTags.filter(t => newTags.includes(t.id)),
    });
    setShowNewModal(false);
    setNewTitle('');
    setNewContent('');
    setNewWorkspace('1');
    setNewTags([]);
    setNewStatus('draft');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">All Articles</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {articles.length} articles · {articles.filter(a => a.status === 'published').length} published
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
                  statusFilter === tab.value ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {tab.label}
                {statusFilter === tab.value && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface border border-surface-border rounded-md p-1 w-fit">
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
          <p className="text-text-muted text-sm mb-3">No articles match your filters</p>
          <button onClick={() => setShowNewModal(true)} className="text-sm text-text-primary hover:underline">Create one →</button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-surface-border">
            {filteredArticles.map((article) => (
              <Link key={article.id} to={`/articles/${article.id}`} className="block p-4 hover:bg-surface-hover transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-text-primary">{article.title}</p>
                  <StatusBadge status={article.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mt-1">
                  <span>{article.author.fullName}</span>
                  <span>{formatDate(article.updatedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Desktop table */}
          <table className="w-full hidden sm:table">
            <thead>
              <tr className="bg-surface-hover">
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Title</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Status</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Author</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Workspace</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Modified</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Actions</th>
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {article.status !== 'archived' && (
                        <button onClick={() => archiveArticle(article.id)} className="text-xs text-text-muted hover:text-status-archived-text transition-colors px-2 py-1 rounded hover:bg-surface-border">
                          Archive
                        </button>
                      )}
                      <button onClick={() => deleteArticle(article.id)} className="text-xs text-text-muted hover:text-status-error-text transition-colors px-2 py-1 rounded hover:bg-surface-border">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <Link key={article.id} to={`/articles/${article.id}`} className="bg-surface border border-surface-border rounded-lg p-5 hover:border-text-muted transition-colors group">
              <div className="flex items-start justify-between mb-3"><StatusBadge status={article.status} /></div>
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

      {/* New Article Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-surface-border rounded-lg w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">New Article</h2>
              <button onClick={() => setShowNewModal(false)} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Article title..."
                  className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Start writing in markdown..."
                  rows={6}
                  className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Workspace</label>
                  <select
                    value={newWorkspace}
                    onChange={(e) => setNewWorkspace(e.target.value)}
                    className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary focus:outline-none focus:border-text-muted transition-colors"
                  >
                    {workspaces.map((ws) => (
                      <option key={ws.id} value={ws.id}>{ws.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ArticleStatus)}
                    className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary focus:outline-none focus:border-text-muted transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowNewModal(false)} className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreateArticle}
                  disabled={!newTitle.trim()}
                  className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
