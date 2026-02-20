import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Command, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';

// Helper to highlight matching text
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <span key={i} className="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

export function Topbar() {
  const { searchQuery, setSearchQuery, filteredArticles, filteredDiscussions, toggleSidebar, sidebarOpen } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close search results on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(value.trim().length > 0);
  };

  const handleResultClick = (path: string) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(path);
  };

  const hasResults = filteredArticles.length > 0 || filteredDiscussions.length > 0;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-14 bg-surface border-b border-surface-border z-40 flex items-center justify-between px-4 transition-all duration-300',
        // On mobile, always take full width from left=0; on desktop offset by sidebar
        'left-0',
        sidebarOpen ? 'lg:left-[220px]' : 'lg:left-0'
      )}
    >
      {/* Left: Menu toggle + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 max-w-[480px]">
          <div
            className={cn(
              'relative rounded-lg transition-all duration-200',
              searchFocused
                ? 'ring-1 ring-text-muted bg-background'
                : 'bg-background'
            )}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => { setSearchFocused(true); if (searchQuery.trim()) setShowResults(true); }}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search articles, discussions, tags..."
              className="w-full h-10 pl-10 pr-20 bg-transparent border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowResults(false); }}
                  className="p-0.5 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-surface-border rounded text-[11px] text-text-secondary font-medium">
                <Command className="w-3 h-3" />
                <span>K</span>
              </kbd>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-surface-border rounded-lg shadow-2xl shadow-black/40 overflow-hidden max-h-[400px] overflow-y-auto">
              {!hasResults ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-text-muted text-sm">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <>
                  {/* Article Results */}
                  {filteredArticles.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium bg-surface-hover">
                        Articles ({filteredArticles.length})
                      </div>
                      {filteredArticles.slice(0, 5).map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleResultClick(`/articles/${article.id}`)}
                          className="w-full text-left px-3 py-2.5 hover:bg-surface-hover transition-colors flex items-center gap-3 border-b border-surface-border last:border-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              <HighlightedText text={article.title} query={searchQuery} />
                            </p>
                            <p className="text-xs text-text-muted mt-0.5 truncate">
                              <HighlightedText text={article.content.substring(0, 80)} query={searchQuery} />...
                            </p>
                          </div>
                          <span className={cn(
                            'text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0',
                            article.status === 'published' ? 'bg-status-published-bg text-status-published-text'
                              : article.status === 'in_review' ? 'bg-yellow-500/10 text-yellow-500'
                                : article.status === 'draft' ? 'bg-status-draft-bg text-status-draft-text'
                                  : 'bg-status-archived-bg text-status-archived-text'
                          )}>
                            {article.status === 'in_review' ? 'In Review' : article.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Discussion Results */}
                  {filteredDiscussions.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-text-muted font-medium bg-surface-hover">
                        Discussions ({filteredDiscussions.length})
                      </div>
                      {filteredDiscussions.slice(0, 5).map((discussion) => (
                        <button
                          key={discussion.id}
                          onClick={() => handleResultClick('/discussions')}
                          className="w-full text-left px-3 py-2.5 hover:bg-surface-hover transition-colors flex items-center gap-3 border-b border-surface-border last:border-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              <HighlightedText text={discussion.title} query={searchQuery} />
                            </p>
                            <p className="text-xs text-text-muted mt-0.5 truncate">
                              <HighlightedText text={discussion.content.substring(0, 80)} query={searchQuery} />...
                            </p>
                            <p className="text-[10px] text-text-muted mt-0.5">{discussion.replyCount} replies · {discussion.status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-published-text rounded-full" />
        </button>
      </div>
    </header>
  );
}
