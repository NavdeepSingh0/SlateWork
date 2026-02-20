import { Archive, ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui-custom/Avatar';
import { TagBadge } from '@/components/ui-custom/TagBadge';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function ArchivePage() {
  const { articles, restoreArticle, deleteArticle } = useApp();
  const { workspaces } = useWorkspaces();
  const archivedArticles = articles.filter((a) => a.status === 'archived');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 text-text-muted hover:text-text-primary hover:bg-surface border border-surface-border rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Archive</h1>
          <p className="text-sm text-text-muted mt-0.5">{archivedArticles.length} archived articles</p>
        </div>
      </div>

      {archivedArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface border border-surface-border rounded-lg">
          <div className="w-16 h-16 bg-surface-border rounded-full flex items-center justify-center mb-4">
            <Archive className="w-8 h-8 text-text-muted" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">No archived articles</h2>
          <p className="text-text-muted text-center max-w-md">
            Archived articles will appear here. You can archive content from the Articles page.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-hover">
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Title</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Author</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Workspace</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Archived Date</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase font-semibold text-text-muted tracking-[0.06em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedArticles.map((article, index) => (
                <tr
                  key={article.id}
                  className={cn(
                    'group hover:bg-surface-hover transition-colors',
                    index !== archivedArticles.length - 1 && 'border-b border-surface-border'
                  )}
                >
                  <td className="px-4 py-3">
                    <Link to={`/articles/${article.id}`} className="text-sm font-medium text-text-primary hover:underline">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={article.author.initials} size="sm" />
                      <span className="text-sm text-text-secondary">{article.author.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TagBadge name={workspaces.find((w) => w.id === article.workspaceId)?.name || 'Unknown'} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-text-muted">{formatDate(article.updatedAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => restoreArticle(article.id)}
                        className="text-xs text-text-muted hover:text-status-published-text px-2 py-1 rounded hover:bg-surface-border transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-xs text-text-muted hover:text-status-error-text px-2 py-1 rounded hover:bg-surface-border transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
