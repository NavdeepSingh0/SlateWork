import { useState } from 'react';
import { MessageSquare, Plus, X, Send, CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar } from '@/components/ui-custom/Avatar';
import { TagBadge } from '@/components/ui-custom/TagBadge';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import type { Discussion } from '@/types';

type StatusFilter = 'all' | 'open' | 'resolved' | 'closed';

export function Discussions() {
  const { discussions, addDiscussion, addReply, closeDiscussion, resolveDiscussion, reopenDiscussion } = useApp();
  const { workspaces } = useWorkspaces();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newWorkspace, setNewWorkspace] = useState('1');

  const filtered = statusFilter === 'all'
    ? discussions
    : discussions.filter(d => d.status === statusFilter);

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

  const statusColor = (status: Discussion['status']) => {
    switch (status) {
      case 'open': return 'bg-status-published-bg text-status-published-text';
      case 'resolved': return 'bg-[#0D1B2A] text-[#60A5FA]';
      case 'closed': return 'bg-status-draft-bg text-status-draft-text';
    }
  };

  const handleCreateDiscussion = () => {
    if (!newTitle.trim()) return;
    addDiscussion({ title: newTitle, content: newContent, workspaceId: newWorkspace });
    setShowNewModal(false);
    setNewTitle('');
    setNewContent('');
    setNewWorkspace('1');
  };

  const handleReply = (discussionId: string) => {
    if (!replyContent.trim()) return;
    addReply(discussionId, replyContent);
    setReplyContent('');
  };

  const statusTabs: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'All', value: 'all', count: discussions.length },
    { label: 'Open', value: 'open', count: discussions.filter(d => d.status === 'open').length },
    { label: 'Resolved', value: 'resolved', count: discussions.filter(d => d.status === 'resolved').length },
    { label: 'Closed', value: 'closed', count: discussions.filter(d => d.status === 'closed').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Discussions</h1>
          <p className="text-sm text-text-muted mt-0.5">{discussions.length} threads · {discussions.filter(d => d.status === 'open').length} open</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Discussion
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-surface-border">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'h-10 px-4 text-sm font-medium transition-colors relative flex items-center gap-2',
              statusFilter === tab.value ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
            )}
          >
            {tab.label}
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full',
              statusFilter === tab.value ? 'bg-surface-border text-text-primary' : 'bg-surface text-text-muted'
            )}>
              {tab.count}
            </span>
            {statusFilter === tab.value && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
          </button>
        ))}
      </div>

      {/* Discussion List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface border border-surface-border rounded-lg">
          <div className="w-14 h-14 bg-surface-border rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7 text-text-muted" />
          </div>
          <p className="text-text-muted text-sm mb-3">No {statusFilter !== 'all' ? statusFilter : ''} discussions</p>
          <button onClick={() => setShowNewModal(true)} className="text-sm text-text-primary hover:underline">Start one →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(discussion => {
            const isExpanded = expandedId === discussion.id;
            return (
              <div key={discussion.id} className="bg-surface border border-surface-border rounded-lg overflow-hidden">
                {/* Thread Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : discussion.id)}
                  className="w-full text-left p-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar initials={discussion.author.initials} size="md" />
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-text-primary">{discussion.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-text-muted">{discussion.author.fullName}</span>
                          <span className="text-xs text-text-muted">·</span>
                          <span className="text-xs text-text-muted">{formatDate(discussion.createdAt)}</span>
                          <span className="text-xs text-text-muted">·</span>
                          <TagBadge name={workspaces.find(w => w.id === discussion.workspaceId)?.name || 'Unknown'} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', statusColor(discussion.status))}>
                        {discussion.status}
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />{discussion.replyCount}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-surface-border">
                    {/* Original Post */}
                    <div className="p-4 bg-surface-hover/50">
                      <p className="text-sm text-text-secondary leading-relaxed">{discussion.content}</p>
                    </div>

                    {/* Replies */}
                    {discussion.replies.length > 0 && (
                      <div className="divide-y divide-surface-border">
                        {discussion.replies.map(reply => (
                          <div key={reply.id} className="p-4 pl-12">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar initials={reply.author.initials} size="sm" />
                              <span className="text-sm font-medium text-text-primary">{reply.author.fullName}</span>
                              <span className="text-xs text-text-muted">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {discussion.status === 'open' && (
                      <div className="p-4 border-t border-surface-border">
                        <div className="flex gap-3">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            rows={2}
                            className="flex-1 px-3 py-2 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors resize-none"
                          />
                          <button
                            onClick={() => handleReply(discussion.id)}
                            disabled={!replyContent.trim()}
                            className="self-end h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="p-3 border-t border-surface-border flex items-center gap-2">
                      {discussion.status === 'open' && (
                        <>
                          <button onClick={() => resolveDiscussion(discussion.id)} className="text-xs text-text-muted hover:text-status-published-text px-2 py-1 rounded hover:bg-surface-border transition-colors flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Resolve
                          </button>
                          <button onClick={() => closeDiscussion(discussion.id)} className="text-xs text-text-muted hover:text-status-archived-text px-2 py-1 rounded hover:bg-surface-border transition-colors flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Close
                          </button>
                        </>
                      )}
                      {(discussion.status === 'closed' || discussion.status === 'resolved') && (
                        <button onClick={() => reopenDiscussion(discussion.id)} className="text-xs text-text-muted hover:text-text-primary px-2 py-1 rounded hover:bg-surface-border transition-colors flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" /> Reopen
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Discussion Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-surface-border rounded-lg w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Start a Discussion</h2>
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
                  placeholder="What do you want to discuss?"
                  className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide context for your discussion..."
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors resize-none"
                />
              </div>
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
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowNewModal(false)} className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors">Cancel</button>
                <button onClick={handleCreateDiscussion} disabled={!newTitle.trim()} className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Start Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
