import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import type { Article, Discussion, Tag, ArticleVersion } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/AuthContext';

interface AppState {
    articles: Article[];
    discussions: Discussion[];
    searchQuery: string;
    sidebarOpen: boolean;
    loading: boolean;
}

interface AppContextType extends AppState {
    // Search
    setSearchQuery: (query: string) => void;

    // Sidebar
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Articles
    addArticle: (article: { title: string; content: string; workspaceId: string; status: string; tags: Tag[] }) => Promise<void>;
    updateArticle: (id: string, updates: Partial<Article>) => Promise<void>;
    archiveArticle: (id: string) => Promise<void>;
    restoreArticle: (id: string) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    getArticleVersions: (id: string) => Promise<ArticleVersion[]>;

    // Discussions
    addDiscussion: (discussion: { title: string; content: string; workspaceId: string }) => Promise<void>;
    addReply: (discussionId: string, content: string) => Promise<void>;
    closeDiscussion: (id: string) => Promise<void>;
    resolveDiscussion: (id: string) => Promise<void>;
    reopenDiscussion: (id: string) => Promise<void>;

    // Filtered data
    filteredArticles: Article[];
    filteredDiscussions: Discussion[];

    // Refresh
    refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

    // Helper to build a user-like object from profile data
    const mapAuthor = (p: any) => ({
        id: p.id,
        fullName: p.full_name,
        initials: p.initials,
        role: p.role,
        avatarUrl: p.avatar_url,
    });

    // Fetch all data
    const refreshData = useCallback(async () => {
        setLoading(true);

        // Fetch articles with author profiles
        const { data: articlesData } = await supabase
            .from('articles')
            .select('*, author:profiles!author_id(*), article_tags(tag_id, tags(*))')
            .order('updated_at', { ascending: false });

        if (articlesData) {
            setArticles(articlesData.map((a: any) => ({
                id: a.id,
                workspaceId: a.workspace_id,
                title: a.title,
                content: a.content,
                authorId: a.author_id,
                author: mapAuthor(a.author),
                status: a.status,
                currentVersion: a.current_version,
                tags: a.article_tags?.map((at: any) => at.tags).filter(Boolean) || [],
                createdAt: a.created_at,
                updatedAt: a.updated_at,
            })));
        }

        // Fetch discussions with author and replies
        const { data: discussionsData } = await supabase
            .from('discussions')
            .select('*, author:profiles!author_id(*), replies(*, author:profiles!author_id(*))')
            .order('updated_at', { ascending: false });

        if (discussionsData) {
            setDiscussions(discussionsData.map((d: any) => ({
                id: d.id,
                workspaceId: d.workspace_id,
                title: d.title,
                content: d.content,
                authorId: d.author_id,
                author: mapAuthor(d.author),
                status: d.status,
                replyCount: d.replies?.length || 0,
                replies: (d.replies || []).map((r: any) => ({
                    id: r.id,
                    discussionId: r.discussion_id,
                    content: r.content,
                    authorId: r.author_id,
                    author: mapAuthor(r.author),
                    createdAt: r.created_at,
                })),
                createdAt: d.created_at,
                updatedAt: d.updated_at,
            })));
        }

        setLoading(false);
    }, []);

    // Seed mock data if DB is empty
    const seedMockData = useCallback(async () => {
        if (!user) return;

        // Get workspace IDs
        const { data: ws } = await supabase.from('workspaces').select('id, name');
        if (!ws || ws.length === 0) return;

        const wsMap: Record<string, string> = {};
        ws.forEach(w => { wsMap[w.name] = w.id; });
        const engId = wsMap['Engineering'] || ws[0].id;
        const prodId = wsMap['Product'] || ws[1]?.id || ws[0].id;
        const designId = wsMap['Design'] || ws[2]?.id || ws[0].id;

        // Seed articles
        await supabase.from('articles').insert([
            { title: 'API Authentication Best Practices', content: 'When building APIs, authentication is critical. Use JWT tokens with short expiration times, implement refresh token rotation, and always validate tokens server-side. Consider rate limiting per-user and per-IP to prevent abuse.\n\n## Key Recommendations\n- Use HTTPS everywhere\n- Implement OAuth 2.0 for third-party access\n- Store tokens securely (httpOnly cookies)\n- Log all authentication events', workspace_id: engId, author_id: user.id, status: 'published' },
            { title: 'Database Migration Strategy', content: 'Our database migration strategy follows a blue-green deployment pattern. All migrations must be backward-compatible and include rollback scripts.\n\n## Process\n1. Write migration SQL\n2. Test on staging\n3. Run on production during low-traffic window\n4. Verify data integrity\n5. Keep rollback ready for 48 hours', workspace_id: engId, author_id: user.id, status: 'published' },
            { title: 'Q1 2024 Product Roadmap', content: 'This document outlines our product priorities for Q1 2024.\n\n## Focus Areas\n- **User onboarding**: Reduce time-to-value by 40%\n- **Mobile experience**: Launch responsive web app\n- **Analytics dashboard**: Real-time metrics for admins\n- **API v2**: Breaking changes for better DX\n\n## Timeline\nJan: Onboarding revamp\nFeb: Mobile + Analytics\nMar: API v2 beta', workspace_id: prodId, author_id: user.id, status: 'published' },
            { title: 'Design System Component Library', content: 'Our design system components follow atomic design principles.\n\n## Atoms\nButtons, Inputs, Labels, Icons, Badges\n\n## Molecules\nSearch bars, Form fields, Card headers, Nav items\n\n## Organisms\nNavigation, Data tables, Modal dialogs, Page headers\n\nAll components support dark mode and are fully accessible (WCAG 2.1 AA).', workspace_id: designId, author_id: user.id, status: 'published' },
            { title: 'CI/CD Pipeline Configuration', content: 'Draft configuration for our new CI/CD pipeline using GitHub Actions.\n\n## Stages\n1. Lint & type-check\n2. Unit tests\n3. Integration tests\n4. Build & bundle\n5. Deploy to staging\n6. Smoke tests\n7. Production deploy (manual approval)', workspace_id: engId, author_id: user.id, status: 'draft' },
            { title: 'User Research Findings - Dec 2023', content: 'Key findings from user interviews conducted in December.\n\n## Pain Points\n- Navigation is confusing for new users\n- Search doesn\'t return relevant results\n- Mobile experience is broken\n\n## Opportunities\n- Knowledge base is highly valued\n- Teams want better collaboration tools\n- Version history is a top request', workspace_id: prodId, author_id: user.id, status: 'draft' },
        ]);

        // Seed discussions
        await supabase.from('discussions').insert([
            { title: 'Should we migrate to TypeScript 5.5?', content: 'TypeScript 5.5 introduces inferred type predicates and better control flow analysis. The migration would require updating our build tooling and potentially fixing some type errors that were previously silently ignored. What are thoughts on timing?', workspace_id: engId, author_id: user.id, status: 'open' },
            { title: 'New onboarding flow proposal', content: 'I\'ve been working on a new onboarding flow that reduces steps from 7 to 3. The key insight is that we can defer profile setup and workspace creation to after the user has experienced the core value. Attaching mockups in the thread.', workspace_id: prodId, author_id: user.id, status: 'open' },
            { title: 'Dark mode color palette finalized', content: 'After 3 rounds of iteration, we\'ve settled on the final dark mode palette. Key changes: backgrounds are now true dark (#0A0A0A to #141414 range), text uses #FAFAFA for primary, and status colors have dark-adjusted backgrounds. The contrast ratios all pass WCAG AA.', workspace_id: designId, author_id: user.id, status: 'resolved' },
            { title: 'API rate limiting implementation', content: 'We need to decide on our rate limiting strategy. Options:\n1. Fixed window (simple but bursty)\n2. Sliding window (smoother but more complex)\n3. Token bucket (flexible, industry standard)\n\nI recommend token bucket with 100 req/min for free tier and 1000 req/min for pro.', workspace_id: engId, author_id: user.id, status: 'open' },
        ]);

        await refreshData();
    }, [user, refreshData]);

    // Load data on mount, seed if empty
    useEffect(() => {
        const init = async () => {
            await refreshData();
            // Seed mock data on first visit for this user
            const seedKey = `slatework_seeded_${user?.id}`;
            if (user && !localStorage.getItem(seedKey)) {
                await seedMockData();
                localStorage.setItem(seedKey, 'true');
            }
        };
        init();
    }, [refreshData, seedMockData, user]);

    // Article actions
    const addArticle = useCallback(async (articleData: { title: string; content: string; workspaceId: string; status: string; tags: Tag[] }) => {
        if (!user) return;
        const { data, error } = await supabase
            .from('articles')
            .insert({
                title: articleData.title,
                content: articleData.content,
                workspace_id: articleData.workspaceId,
                status: articleData.status,
                author_id: user.id,
            })
            .select()
            .single();

        if (!error && data && articleData.tags.length > 0) {
            await supabase.from('article_tags').insert(
                articleData.tags.map(t => ({ article_id: data.id, tag_id: t.id }))
            );
        }

        await refreshData();
    }, [user, refreshData]);

    const updateArticle = useCallback(async (id: string, updates: Partial<Article>) => {
        if (!user) return;

        // Fetch current version to log it before updating
        const { data: currentArticle } = await supabase.from('articles').select('*').eq('id', id).single();
        if (!currentArticle) return;

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        dbUpdates.updated_at = new Date().toISOString();

        // If title or content is changing, create a version snapshot and increment current_version
        if (updates.title !== undefined || updates.content !== undefined) {
            dbUpdates.current_version = currentArticle.current_version + 1;

            await supabase.from('article_versions').insert({
                article_id: id,
                title: currentArticle.title,
                content: currentArticle.content,
                author_id: currentArticle.author_id,
                version_number: currentArticle.current_version
            });
        }

        await supabase.from('articles').update(dbUpdates).eq('id', id);
        await refreshData();
    }, [refreshData, user]);

    const archiveArticle = useCallback(async (id: string) => {
        await supabase.from('articles').update({ status: 'archived', updated_at: new Date().toISOString() }).eq('id', id);
        await refreshData();
    }, [refreshData]);

    const restoreArticle = useCallback(async (id: string) => {
        await supabase.from('articles').update({ status: 'draft', updated_at: new Date().toISOString() }).eq('id', id);
        await refreshData();
    }, [refreshData]);

    const deleteArticle = useCallback(async (id: string) => {
        await supabase.from('articles').delete().eq('id', id);
        await refreshData();
    }, [refreshData]);

    const getArticleVersions = useCallback(async (id: string) => {
        const { data } = await supabase
            .from('article_versions')
            .select('*, author:profiles!author_id(*)')
            .eq('article_id', id)
            .order('version_number', { ascending: false });

        if (!data) return [];
        return data.map((v: any) => ({
            id: v.id,
            articleId: v.article_id,
            title: v.title,
            content: v.content,
            authorId: v.author_id,
            author: mapAuthor(v.author),
            versionNumber: v.version_number,
            createdAt: v.created_at
        }));
    }, []);

    // Discussion actions
    const addDiscussion = useCallback(async (discussionData: { title: string; content: string; workspaceId: string }) => {
        if (!user) return;
        await supabase.from('discussions').insert({
            title: discussionData.title,
            content: discussionData.content,
            workspace_id: discussionData.workspaceId,
            author_id: user.id,
        });
        await refreshData();
    }, [user, refreshData]);

    const addReply = useCallback(async (discussionId: string, content: string) => {
        if (!user) return;
        await supabase.from('replies').insert({
            discussion_id: discussionId,
            content,
            author_id: user.id,
        });
        // Also update the discussion's updated_at
        await supabase.from('discussions').update({ updated_at: new Date().toISOString() }).eq('id', discussionId);
        await refreshData();
    }, [user, refreshData]);

    const closeDiscussion = useCallback(async (id: string) => {
        await supabase.from('discussions').update({ status: 'closed', updated_at: new Date().toISOString() }).eq('id', id);
        await refreshData();
    }, [refreshData]);

    const resolveDiscussion = useCallback(async (id: string) => {
        await supabase.from('discussions').update({ status: 'resolved', updated_at: new Date().toISOString() }).eq('id', id);
        await refreshData();
    }, [refreshData]);

    const reopenDiscussion = useCallback(async (id: string) => {
        await supabase.from('discussions').update({ status: 'open', updated_at: new Date().toISOString() }).eq('id', id);
        await refreshData();
    }, [refreshData]);

    // Filtered data based on search
    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return articles;
        const q = searchQuery.toLowerCase();
        return articles.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q) ||
            a.author.fullName.toLowerCase().includes(q) ||
            a.tags.some(t => t.name.toLowerCase().includes(q))
        );
    }, [articles, searchQuery]);

    const filteredDiscussions = useMemo(() => {
        if (!searchQuery.trim()) return discussions;
        const q = searchQuery.toLowerCase();
        return discussions.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.content.toLowerCase().includes(q) ||
            d.author.fullName.toLowerCase().includes(q)
        );
    }, [discussions, searchQuery]);

    const value: AppContextType = {
        articles,
        discussions,
        searchQuery,
        sidebarOpen,
        loading,
        setSearchQuery,
        toggleSidebar,
        setSidebarOpen,
        addArticle,
        updateArticle,
        archiveArticle,
        restoreArticle,
        deleteArticle,
        getArticleVersions,
        addDiscussion,
        addReply,
        closeDiscussion,
        resolveDiscussion,
        reopenDiscussion,
        filteredArticles,
        filteredDiscussions,
        refreshData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
