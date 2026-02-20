import type { Article, User, Workspace, Tag, StatCard, Discussion } from '@/types';

export const currentUser: User = {
  id: '1',
  fullName: 'Alex Morgan',
  initials: 'AM',
  role: 'admin',
};

export const workspaces: Workspace[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Engineering team knowledge base',
    createdBy: '1',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Product',
    description: 'Product team documentation',
    createdBy: '1',
    status: 'active',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Design',
    description: 'Design system and guidelines',
    createdBy: '1',
    status: 'active',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

export const tags: Tag[] = [
  { id: '1', workspaceId: '1', name: 'API', color: '#5A5C5A' },
  { id: '2', workspaceId: '1', name: 'Database', color: '#5A5C5A' },
  { id: '3', workspaceId: '1', name: 'DevOps', color: '#5A5C5A' },
  { id: '4', workspaceId: '2', name: 'Roadmap', color: '#5A5C5A' },
  { id: '5', workspaceId: '2', name: 'Requirements', color: '#5A5C5A' },
  { id: '6', workspaceId: '3', name: 'UI', color: '#5A5C5A' },
  { id: '7', workspaceId: '3', name: 'UX', color: '#5A5C5A' },
];

export const users: User[] = [
  currentUser,
  {
    id: '2',
    fullName: 'Sarah Chen',
    initials: 'SC',
    role: 'editor',
  },
  {
    id: '3',
    fullName: 'Marcus Johnson',
    initials: 'MJ',
    role: 'member',
  },
  {
    id: '4',
    fullName: 'Emily Davis',
    initials: 'ED',
    role: 'editor',
  },
  {
    id: '5',
    fullName: 'David Park',
    initials: 'DP',
    role: 'member',
  },
];

export const defaultArticles: Article[] = [
  {
    id: '1',
    workspaceId: '1',
    title: 'REST API Authentication Guide',
    content: `# REST API Authentication Guide

This guide covers the authentication mechanisms for our REST API.

## Overview

All API requests must include an authentication token in the Authorization header.

\`\`\`
Authorization: Bearer <your-token>
\`\`\`

## Token Types

### 1. API Keys
- Long-lived tokens for server-to-server communication
- Can be scoped to specific endpoints
- Should be stored securely

### 2. JWT Tokens
- Short-lived tokens for user sessions
- Automatically refreshed
- Contains user claims and permissions

## Best Practices

1. Never expose API keys in client-side code
2. Use HTTPS for all API requests
3. Rotate keys regularly
4. Monitor usage and set up alerts

## Error Handling

| Status | Description |
|--------|-------------|
| 401    | Unauthorized - Invalid or missing token |
| 403    | Forbidden - Valid token but insufficient permissions |
| 429    | Rate limit exceeded |`,
    authorId: '2',
    author: users[1],
    status: 'published',
    currentVersion: 3,
    tags: [tags[0], tags[1]],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
  },
  {
    id: '2',
    workspaceId: '1',
    title: 'Database Migration Strategy',
    content: `# Database Migration Strategy

Our approach to database schema migrations and version control.

## Principles

1. **Backward Compatibility**: All migrations must be backward compatible
2. **Incremental Changes**: Small, focused migrations
3. **Tested**: All migrations tested in staging first
4. **Documented**: Every migration includes documentation

## Tools

We use Flyway for Java-based migrations and Liquibase for XML/YAML migrations.

## Process

1. Create migration script
2. Test locally
3. Code review
4. Deploy to staging
5. Verify
6. Deploy to production`,
    authorId: '1',
    author: users[0],
    status: 'published',
    currentVersion: 2,
    tags: [tags[1]],
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-02-10T11:20:00Z',
  },
  {
    id: '3',
    workspaceId: '1',
    title: 'CI/CD Pipeline Configuration',
    content: `# CI/CD Pipeline Configuration

Documentation for our continuous integration and deployment pipelines.

## GitHub Actions Workflow

Our CI/CD pipeline is built on GitHub Actions with the following stages:

### 1. Build
- Compile code
- Run unit tests
- Generate coverage reports

### 2. Integration Tests
- Start test environment
- Run integration tests
- Cleanup

### 3. Security Scan
- SAST (Static Application Security Testing)
- Dependency vulnerability scan
- Secret detection

### 4. Deploy
- Staging deployment (auto)
- Production deployment (manual approval)`,
    authorId: '3',
    author: users[2],
    status: 'draft',
    currentVersion: 1,
    tags: [tags[2]],
    createdAt: '2024-02-20T16:45:00Z',
    updatedAt: '2024-02-20T16:45:00Z',
  },
  {
    id: '4',
    workspaceId: '2',
    title: 'Q1 2024 Product Roadmap',
    content: `# Q1 2024 Product Roadmap

## Key Initiatives

### 1. Performance Improvements
- Reduce API response times by 50%
- Optimize database queries
- Implement caching layer

### 2. User Experience
- Redesign onboarding flow
- Improve mobile responsiveness
- Add dark mode support

### 3. Security Enhancements
- Implement MFA
- Add audit logging
- Security review process

## Timeline

| Month | Focus |
|-------|-------|
| January | Performance baseline |
| February | Optimization sprint |
| March | Testing and rollout |`,
    authorId: '4',
    author: users[3],
    status: 'published',
    currentVersion: 4,
    tags: [tags[3]],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-28T15:10:00Z',
  },
  {
    id: '5',
    workspaceId: '2',
    title: 'User Research Findings - Q4 2023',
    content: `# User Research Findings - Q4 2023

## Methodology

We conducted 15 user interviews and analyzed 500+ support tickets.

## Key Findings

### 1. Onboarding Friction
- 40% of users drop off during onboarding
- Users want more guidance
- Tutorial videos requested

### 2. Feature Discovery
- Advanced features underutilized
- Users unaware of keyboard shortcuts
- Documentation hard to find

### 3. Performance Concerns
- Dashboard loading too slow
- Search results not relevant
- Mobile experience needs work

## Recommendations

1. Simplify onboarding to 3 steps
2. Add in-app feature highlights
3. Create video tutorial library
4. Implement progressive disclosure`,
    authorId: '4',
    author: users[3],
    status: 'published',
    currentVersion: 2,
    tags: [tags[4]],
    createdAt: '2024-01-10T13:20:00Z',
    updatedAt: '2024-01-18T09:45:00Z',
  },
  {
    id: '6',
    workspaceId: '3',
    title: 'Design System v2.0',
    content: `# Design System v2.0

## Overview

The updated design system introduces consistency and scalability.

## Color Palette

### Primary Colors
- Carbon Black: #191919
- Alabaster Grey: #E6E8E6
- Dust Grey: #CED0CE

### Semantic Colors
- Success: #D4E4D4
- Warning: #E8E4D4
- Error: #E8D4D4

## Typography

- Font Family: Inter
- Headings: 600-700 weight
- Body: 400 weight
- Captions: 400 weight, 12px

## Components

### Buttons
- Primary: Carbon Black bg, white text
- Secondary: White bg, border
- Ghost: Transparent bg

### Cards
- White background
- 1px border
- 8px border radius
- 24px padding`,
    authorId: '1',
    author: users[0],
    status: 'published',
    currentVersion: 5,
    tags: [tags[5]],
    createdAt: '2023-12-15T11:00:00Z',
    updatedAt: '2024-02-01T10:30:00Z',
  },
  {
    id: '7',
    workspaceId: '3',
    title: 'Mobile App UX Guidelines',
    content: `# Mobile App UX Guidelines

## Principles

1. **Touch Targets**: Minimum 44x44px
2. **Thumb Zone**: Primary actions in easy reach
3. **Gestures**: Use standard iOS/Android patterns
4. **Performance**: 60fps animations

## Navigation Patterns

### Tab Bar
- Maximum 5 items
- Use icons + labels
- Highlight active state

### Hamburger Menu
- Reserve for secondary actions
- Show badge counts
- Group related items

## Form Design

- Single column layout
- Clear labels above inputs
- Inline validation
- Keyboard-optimized`,
    authorId: '5',
    author: users[4],
    status: 'draft',
    currentVersion: 1,
    tags: [tags[6]],
    createdAt: '2024-02-18T14:00:00Z',
    updatedAt: '2024-02-18T14:00:00Z',
  },
  {
    id: '8',
    workspaceId: '1',
    title: 'Kubernetes Deployment Guide',
    content: `# Kubernetes Deployment Guide

## Prerequisites

- kubectl installed
- Cluster access configured
- Docker image built and pushed

## Deployment Steps

### 1. Create Namespace
\`\`\`bash
kubectl create namespace production
\`\`\`

### 2. Apply ConfigMaps
\`\`\`bash
kubectl apply -f configmap.yaml
\`\`\`

### 3. Deploy Application
\`\`\`bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
\`\`\`

### 4. Verify Deployment
\`\`\`bash
kubectl get pods -n production
kubectl get svc -n production
\`\`\`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pod stuck pending | Check resource quotas |
| Image pull error | Verify image tag exists |
| Crash loop | Check logs with kubectl logs |`,
    authorId: '2',
    author: users[1],
    status: 'archived',
    currentVersion: 2,
    tags: [tags[2]],
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2023-12-01T16:00:00Z',
  },
];

export const defaultDiscussions: Discussion[] = [
  {
    id: 'd1',
    workspaceId: '1',
    title: 'Should we migrate from REST to GraphQL?',
    content: 'I\'ve been evaluating GraphQL for our next API iteration. The main benefits I see are reduced over-fetching and better developer experience with typed schemas. However, I\'m concerned about caching complexity and the learning curve for the team. What are your thoughts?',
    authorId: '2',
    author: users[1],
    status: 'open',
    replyCount: 3,
    replies: [
      {
        id: 'r1',
        discussionId: 'd1',
        content: 'I think GraphQL would be great for our mobile clients where bandwidth is a concern. We could start with a hybrid approach — keep REST for simple endpoints and use GraphQL for complex data fetching.',
        authorId: '1',
        author: users[0],
        createdAt: '2024-02-16T10:30:00Z',
      },
      {
        id: 'r2',
        discussionId: 'd1',
        content: 'From a frontend perspective, I\'d love to use GraphQL with code generation. It would eliminate most of our type mismatches between frontend and backend.',
        authorId: '5',
        author: users[4],
        createdAt: '2024-02-16T14:15:00Z',
      },
      {
        id: 'r3',
        discussionId: 'd1',
        content: 'We should consider the operational complexity too. GraphQL queries can be unpredictable in terms of DB load. We\'d need query complexity analysis and rate limiting at the query level.',
        authorId: '3',
        author: users[2],
        createdAt: '2024-02-17T09:00:00Z',
      },
    ],
    createdAt: '2024-02-15T16:00:00Z',
    updatedAt: '2024-02-17T09:00:00Z',
  },
  {
    id: 'd2',
    workspaceId: '1',
    title: 'Best practices for error logging in production',
    content: 'We\'ve been having issues tracking down production bugs. Our current logging is inconsistent across services. I propose we standardize on structured logging with correlation IDs. Let\'s discuss the approach.',
    authorId: '3',
    author: users[2],
    status: 'open',
    replyCount: 2,
    replies: [
      {
        id: 'r4',
        discussionId: 'd2',
        content: 'Structured logging is definitely the way to go. I\'d suggest using JSON format with standard fields: timestamp, level, service, correlationId, message, and context. We can use Winston or Pino for Node.js services.',
        authorId: '1',
        author: users[0],
        createdAt: '2024-02-19T11:00:00Z',
      },
      {
        id: 'r5',
        discussionId: 'd2',
        content: 'We should also set up centralized log aggregation. I\'ve had good experiences with the ELK stack (Elasticsearch, Logstash, Kibana). It would give us powerful search and visualization capabilities.',
        authorId: '2',
        author: users[1],
        createdAt: '2024-02-19T14:30:00Z',
      },
    ],
    createdAt: '2024-02-18T15:00:00Z',
    updatedAt: '2024-02-19T14:30:00Z',
  },
  {
    id: 'd3',
    workspaceId: '2',
    title: 'Feature prioritization framework for Q2',
    content: 'We need a better framework for prioritizing features in Q2. Currently we\'re using a simple impact/effort matrix but it doesn\'t account for strategic alignment or technical debt. Any suggestions for a more robust approach?',
    authorId: '4',
    author: users[3],
    status: 'open',
    replyCount: 1,
    replies: [
      {
        id: 'r6',
        discussionId: 'd3',
        content: 'I\'d recommend the RICE framework (Reach, Impact, Confidence, Effort). It provides a quantitative score that makes comparisons more objective. We used it at my previous company and it worked well for cross-functional alignment.',
        authorId: '1',
        author: users[0],
        createdAt: '2024-02-20T10:00:00Z',
      },
    ],
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'd4',
    workspaceId: '3',
    title: 'Dark mode implementation strategy',
    content: 'With dark mode now on the roadmap, we need to decide on our implementation approach. Should we use CSS custom properties for theming, or go with a CSS-in-JS solution with theme providers? Both have trade-offs.',
    authorId: '5',
    author: users[4],
    status: 'resolved',
    replyCount: 2,
    replies: [
      {
        id: 'r7',
        discussionId: 'd4',
        content: 'CSS custom properties are the most performant option. They work natively with the cascade and don\'t require JavaScript at runtime. We can use a class on the HTML element to toggle themes.',
        authorId: '1',
        author: users[0],
        createdAt: '2024-02-12T09:00:00Z',
      },
      {
        id: 'r8',
        discussionId: 'd4',
        content: 'Agreed with CSS custom properties. We went with this approach and it\'s working great. I\'ll document the pattern in our design system article.',
        authorId: '5',
        author: users[4],
        createdAt: '2024-02-12T15:00:00Z',
      },
    ],
    createdAt: '2024-02-11T14:00:00Z',
    updatedAt: '2024-02-12T15:00:00Z',
  },
  {
    id: 'd5',
    workspaceId: '1',
    title: 'Database connection pooling issues',
    content: 'We\'re seeing intermittent connection timeouts during peak hours. I suspect our connection pool configuration is too conservative. Currently set to max 10 connections per service instance. Should we increase this or look at PgBouncer?',
    authorId: '2',
    author: users[1],
    status: 'closed',
    replyCount: 0,
    replies: [],
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
];

// Keep legacy exports for backward compatibility
export const articles = defaultArticles;

export const stats: StatCard[] = [
  { label: 'Total Articles', value: 142, delta: '+12 this month' },
  { label: 'Published', value: 98, delta: '+8 this month' },
  { label: 'Drafts', value: 34, delta: '+4 this month' },
  { label: 'Active Contributors', value: 18, delta: '+3 this month' },
];
