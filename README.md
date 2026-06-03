# SlateWork - Smart Team Collaboration & Knowledge Continuity Platform

A centralized platform for technical knowledge management and team collaboration, built to prevent knowledge loss and improve team productivity.

## 🎯 Problem & Solution

**Problem:** Knowledge is scattered across chats, emails, and documents, leading to productivity loss and knowledge gaps when team members leave.

**Solution:** SlateWork centralizes technical knowledge and decision history in one searchable platform with:
- **Articles** - Version-controlled knowledge base with approval workflows
- **Discussions** - Forum-style conversations for async collaboration
- **Workspaces** - Organized spaces for different teams/topics
- **Full-text Search** - Quickly find relevant information
- **Archive** - Preserve outdated content for historical reference

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 7 |
| **UI Components** | shadcn/ui (40+ components), Tailwind CSS 3.4 |
| **Routing** | React Router v7 |
| **State Management** | React Context API |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Search** | PostgreSQL Full-Text Search |
| **Real-time** | Supabase Realtime |
| **Form Handling** | React Hook Form + Zod validation |

## ✨ Features

### Core Features
- 🔐 **Authentication** - Email/password auth with Supabase Auth
- 👥 **Workspace Management** - Create and manage team workspaces
- 📝 **Article System** - Markdown articles with version history
- 🏷️ **Tagging** - Organize content with customizable tags
- 🔍 **Full-text Search** - Fast search across all content
- 💬 **Discussions** - Thread-based conversations with replies
- 📦 **Archive** - Preserve outdated content for future reference
- ⚡ **Real-time Updates** - Live discussions and notifications

### Article Workflow
1. Author writes article (saved as draft)
2. Submit for review → status changes to `in_review`
3. Admin/owner approves → published and visible to workspace
4. Each edit creates a new version entry
5. Outdated articles can be archived

### Permission Levels
- **Owner** - Full control over workspace
- **Admin** - Manage members, approve articles, archive content
- **Editor** - Create/edit articles
- **Viewer** - Read-only access

## 📁 Project Structure

```
/workspace
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Navbar, Layout components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ui-custom/       # Custom UI components
│   ├── pages/               # Page components
│   │   ├── Landing.tsx      # Landing page
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Articles.tsx     # Articles list & management
│   │   ├── ArticleView.tsx  # Article reader/editor
│   │   ├── Discussions.tsx  # Forum discussions
│   │   ├── Archive.tsx      # Archived content
│   │   ├── Settings.tsx     # User/workspace settings
│   │   └── Login.tsx        # Authentication
│   ├── store/               # Context providers (Auth, App)
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Static data & constants
│   └── lib/                 # Utility libraries
├── supabase/
│   ├── schema.sql           # Database schema & RLS policies
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- A [Supabase](https://supabase.com) project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase SQL Editor:
   ```bash
   # Copy contents from supabase/schema.sql
   # Paste into Supabase Dashboard > SQL Editor > Run
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🗄️ Database Schema

The application uses the following core tables:

- **profiles** - User profiles (extends auth.users)
- **workspaces** - Team/knowledge spaces
- **articles** - Knowledge base articles with versioning
- **article_tags** - Junction table for articles and tags
- **tags** - Categorization tags per workspace
- **discussions** - Forum threads
- **replies** - Discussion replies

All tables have Row-Level Security (RLS) policies for data protection.

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row-Level Security (RLS) policies on all tables
- **Permission Hierarchy**: owner > admin > editor > viewer (per workspace)
- **Data Protection**: Only authenticated users can access workspace data

## 🌐 Deployment

### Vercel (Recommended)

This project is configured for Vercel deployment (`vercel.json` included).

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Implementation Plan

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed:
- Data model diagrams
- API design
- Development roadmap
- Security strategies
- Verification plans

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Review the database schema in `supabase/schema.sql`
3. Contact the development team

---

**Built with** ❤️ **using React, TypeScript, Tailwind CSS, and Supabase**
