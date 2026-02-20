export type ArticleStatus = 'published' | 'draft' | 'archived' | 'in_review';

export interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
  initials: string;
  role: 'admin' | 'editor' | 'member' | 'viewer';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
}

export interface Article {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  status: ArticleStatus;
  currentVersion: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleVersion {
  id: string;
  articleId: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  versionNumber: number;
  createdAt: string;
}

export interface StatCard {
  label: string;
  value: number;
  delta?: string;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}

// Discussion types
export interface Discussion {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  status: 'open' | 'closed' | 'resolved';
  replyCount: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  discussionId: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
}
