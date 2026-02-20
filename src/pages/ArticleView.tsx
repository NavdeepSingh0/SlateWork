import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Share, MoreHorizontal, Archive, History, X, Clock } from 'lucide-react';
import * as diff from 'diff';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useApp } from '@/store/AppContext';
import { useAuth } from '@/store/AuthContext';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Avatar } from '@/components/ui-custom/Avatar';
import { TagBadge } from '@/components/ui-custom/TagBadge';
import type { ArticleVersion } from '@/types';

export function ArticleView() {
  const { id } = useParams<{ id: string }>();
  const { articles, archiveArticle, getArticleVersions, updateArticle } = useApp();
  const { profile } = useAuth();
  const { workspaces } = useWorkspaces();
  const navigate = useNavigate();
  const article = articles.find((a) => a.id === id);

  const canApprove = profile?.role === 'admin' || profile?.role === 'editor';

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<ArticleVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ArticleVersion | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
    }
  }, [article?.id]);

  useEffect(() => {
    if (isHistoryOpen && article) {
      setIsLoadingHistory(true);
      getArticleVersions(article.id).then((data) => {
        setVersions(data);
        if (data.length > 0) setSelectedVersion(data[0]);
        setIsLoadingHistory(false);
      });
    }
  }, [isHistoryOpen, article, getArticleVersions]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-muted text-lg">Article not found</p>
        <Link to="/" className="mt-4 text-text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const workspace = workspaces.find((w) => w.id === article.workspaceId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Simple markdown renderer for basic elements
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="bg-background border border-surface-border rounded-md p-4 my-4 overflow-x-auto"
            >
              <code className="text-sm font-mono text-text-secondary">{codeContent.trim()}</code>
            </pre>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-text-primary mt-8 mb-4">
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg font-semibold text-text-primary mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-medium text-text-primary mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Lists
      if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-[15px] text-text-secondary leading-relaxed ml-4 mb-1">
            {line.replace('- ', '')}
          </li>
        );
        return;
      }

      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        elements.push(
          <li key={index} className="text-[15px] text-text-secondary leading-relaxed ml-4 mb-1 list-decimal">
            {line.replace(/^\d+\. /, '')}
          </li>
        );
        return;
      }

      // Tables
      if (line.startsWith('|')) {
        const cells = line.split('|').filter((c) => c.trim());
        if (cells.length > 0 && !line.includes('---')) {
          elements.push(
            <div key={index} className="flex gap-4 py-2 border-b border-surface-border">
              {cells.map((cell, cellIndex) => (
                <span key={cellIndex} className="text-[15px] text-text-secondary flex-1">
                  {cell.trim()}
                </span>
              ))}
            </div>
          );
        }
        return;
      }

      // Bold text
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        elements.push(
          <p key={index} className="text-[15px] text-text-secondary leading-relaxed mb-3">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex} className="text-text-primary">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
        return;
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={index} className="text-[15px] text-text-secondary leading-relaxed mb-3">
          {line}
        </p>
      );
    });

    return elements;
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const downloadMd = () => {
    if (!article) return;
    const fileName = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    const blob = new Blob([article.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareViaWhatsApp = () => {
    if (!article) return;
    const text = encodeURIComponent(`📄 *${article.title}*\n\n${article.content.substring(0, 500)}${article.content.length > 500 ? '...' : ''}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareViaGmail = () => {
    if (!article) return;
    const subject = encodeURIComponent(article.title);
    const body = encodeURIComponent(`${article.title}\n\n${article.content}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  const shareViaEmail = () => {
    if (!article) return;
    const subject = encodeURIComponent(article.title);
    const body = encodeURIComponent(`${article.title}\n\n${article.content}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const renderDiff = () => {
    if (!selectedVersion || !article) return null;

    // We are comparing the selected OLD version with the CURRENT version
    // If we want to see what changed *in that version*, we should compare it to the one before it.
    // For simplicity, let's just compare the selected version with the CURRENT article content.
    const diffResult = diff.diffWordsWithSpace(selectedVersion.content, article.content);

    return (
      <div className="bg-surface-hover border border-surface-border rounded-md p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[60vh]">
        {diffResult.map((part, index) => {
          const color = part.added ? 'bg-green-500/20 text-green-400' :
            part.removed ? 'bg-red-500/20 text-red-400 line-through' : 'text-text-secondary';
          return <span key={index} className={color}>{part.value}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="fixed top-14 left-0 lg:left-[220px] right-0 h-14 bg-surface border-b border-surface-border flex items-center justify-between px-4 sm:px-8 z-30">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs text-text-muted">
            {workspace?.name} / Articles
          </span>
        </div>
        <div className="flex items-center gap-3">
          {article.status === 'draft' && (
            <button
              onClick={async () => {
                await updateArticle(article.id, { status: 'in_review' });
              }}
              className="h-9 px-4 bg-text-primary text-background rounded-md text-sm font-medium hover:bg-text-secondary transition-colors"
            >
              Submit for Review
            </button>
          )}

          {article.status === 'in_review' && canApprove && (
            <>
              <button
                onClick={async () => {
                  await updateArticle(article.id, { status: 'published' });
                }}
                className="h-9 px-4 bg-green-500/10 text-green-500 border border-green-500/30 rounded-md text-sm font-medium hover:bg-green-500/20 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={async () => {
                  await updateArticle(article.id, { status: 'draft' });
                }}
                className="h-9 px-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-md text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                Reject
              </button>
            </>
          )}

          {!isEditingMode && (
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </button>
          )}

          {isEditingMode ? (
            <>
              <button
                onClick={() => {
                  setIsEditingMode(false);
                  if (article) {
                    setEditedTitle(article.title);
                    setEditedContent(article.content);
                  }
                }}
                className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!article) return;
                  await updateArticle(article.id, { title: editedTitle, content: editedContent });
                  setIsEditingMode(false);
                }}
                className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditingMode(true)}
              className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          <button
            onClick={handleShare}
            className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="h-9 w-9 hidden sm:flex items-center justify-center bg-surface border border-surface-border rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-14">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Article Content */}
          <div className="flex-1 lg:max-w-[68%]">
            <div className="bg-surface border border-surface-border rounded-lg p-4 sm:p-8">
              {/* Breadcrumb */}
              <div className="text-xs text-text-muted mb-4">
                {workspace?.name} / Articles
              </div>

              {/* Title */}
              {isEditingMode ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-text-primary bg-background border border-surface-border rounded-md px-4 py-2 focus:outline-none focus:border-text-muted mb-2 transition-colors"
                />
              ) : (
                <h1 className="text-2xl font-bold text-text-primary mb-2">{article.title}</h1>
              )}

              {/* Subtitle */}
              <p className="text-[15px] text-text-secondary mb-6">
                Version {article.currentVersion} • Last updated {formatDate(article.updatedAt)}
              </p>

              {/* Divider */}
              <div className="border-t border-surface-border my-6" />

              {/* Content */}
              {isEditingMode ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[400px] text-[15px] text-text-secondary font-mono bg-background border border-surface-border rounded-md p-4 focus:outline-none focus:border-text-muted transition-colors resize-y leading-relaxed"
                />
              ) : (
                <div className="prose prose-stone max-w-none">
                  {renderMarkdown(article.content)}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Metadata */}
          <div className="w-full lg:w-[32%] lg:min-w-[280px]">
            <div className="bg-surface border border-surface-border rounded-lg p-6 lg:sticky lg:top-24">
              {/* Status */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium mb-2">
                  Status
                </p>
                <StatusBadge status={article.status} />
              </div>

              {/* Author */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium mb-2">
                  Author
                </p>
                <div className="flex items-center gap-3">
                  <Avatar initials={article.author.initials} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{article.author.fullName}</p>
                    <p className="text-xs text-text-muted">
                      Edited {formatDate(article.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workspace */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium mb-2">
                  Workspace
                </p>
                <TagBadge name={workspace?.name || 'Unknown'} />
              </div>

              {/* Tags */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <TagBadge key={tag.id} name={tag.name} />
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium mb-2">
                  Timeline
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Created</span>
                    <span className="text-text-secondary">{formatDate(article.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Modified</span>
                    <span className="text-text-secondary">{formatDate(article.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Version</span>
                    <span className="text-text-secondary">v{article.currentVersion}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-surface-border my-6" />

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Share className="w-4 h-4" />
                  Share Article
                </button>
                <button
                  onClick={async () => {
                    await archiveArticle(article.id);
                    navigate('/articles');
                  }}
                  className="w-full h-9 px-4 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-surface border border-surface-border rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-hover/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center">
                  <Clock className="w-4 h-4 text-text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Version History</h2>
                  <p className="text-xs text-text-muted">Comparing past versions with the current active version</p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar - Version List */}
              <div className="w-72 border-r border-surface-border bg-surface-hover/20 flex flex-col">
                <div className="p-4 border-b border-surface-border bg-surface/50">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Current</div>
                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 cursor-default">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-primary">v{article.currentVersion} (Active)</span>
                      <span className="text-xs text-text-muted">{formatDate(article.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar initials={article.author.initials} size="sm" />
                      <span className="text-xs text-text-secondary">{article.author.fullName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Previous Versions</div>
                  {isLoadingHistory ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-surface border border-surface-border rounded-lg"></div>
                      ))}
                    </div>
                  ) : versions.length === 0 ? (
                    <p className="text-sm text-text-muted italic py-4">No previous versions found.</p>
                  ) : (
                    versions.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVersion(v)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${selectedVersion?.id === v.id ? 'border-surface-border bg-surface shadow-sm' : 'border-transparent hover:bg-surface/50 text-text-muted hover:text-text-secondary'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-medium ${selectedVersion?.id === v.id ? 'text-text-primary' : ''}`}>v{v.versionNumber}</span>
                          <span className="text-xs opacity-70">{formatDate(v.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar initials={v.author.initials} size="sm" />
                          <span className="text-xs truncate">{v.author.fullName}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Main Area - Diff Viewer */}
              <div className="flex-1 bg-background flex flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-text-primary">
                    Changes from <span className="text-text-muted">v{selectedVersion?.versionNumber}</span> to <span className="text-primary">v{article.currentVersion} (Current)</span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div><span className="text-text-muted">Removed</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div><span className="text-text-muted">Added</span></div>
                  </div>
                </div>

                {selectedVersion ? (
                  renderDiff()
                ) : (
                  <div className="flex-1 flex items-center justify-center text-text-muted text-sm border border-surface-border border-dashed rounded-lg bg-surface/30">
                    Select a version from the sidebar to view changes
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && article && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-surface border border-surface-border rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-text-primary">Share Article</h2>
                <p className="text-xs text-text-muted mt-0.5 truncate max-w-[200px]">{article.title}</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Share Options */}
            <div className="space-y-2">
              {/* WhatsApp */}
              <button
                onClick={() => { shareViaWhatsApp(); setShowShareModal(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-surface-border hover:bg-surface-hover transition-colors group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#25D366' }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M11.999 2.001C6.478 2.001 2.001 6.478 2.001 12c0 1.762.461 3.413 1.263 4.849L2 22l5.293-1.225A9.932 9.932 0 0012 21.999c5.521 0 9.998-4.477 9.998-9.999C21.998 6.479 17.521 2.001 12 2.001zM12 20.001a8.03 8.03 0 01-4.094-1.124l-.293-.175-3.14.727.764-3.039-.192-.31A7.955 7.955 0 014 12.001C4 7.582 7.582 4 12 4c4.418 0 8 3.582 8 8.001 0 4.417-3.582 7.999-8 8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">WhatsApp</p>
                  <p className="text-xs text-text-muted">Share article content in a chat</p>
                </div>
              </button>

              {/* Gmail */}
              <button
                onClick={() => { shareViaGmail(); setShowShareModal(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-surface-border hover:bg-surface-hover transition-colors group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.074 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.382 24 5.457z" fill="#EA4335" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Gmail</p>
                  <p className="text-xs text-text-muted">Open Gmail compose with content</p>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={() => { shareViaEmail(); setShowShareModal(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-surface-border hover:bg-surface-hover transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-surface-border flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-text-muted" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Email</p>
                  <p className="text-xs text-text-muted">Open your default mail app</p>
                </div>
              </button>

              {/* Divider */}
              <div className="border-t border-surface-border my-2" />

              {/* Download .md */}
              <button
                onClick={() => { downloadMd(); setShowShareModal(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-surface-border hover:bg-surface-hover transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-surface-border flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-text-muted" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Download as .md</p>
                  <p className="text-xs text-text-muted">Save and attach to any message</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}