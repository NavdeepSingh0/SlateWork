-- ====================================
-- SlateWork Database Schema
-- Run this in Supabase SQL Editor
-- ====================================

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  initials text not null default '',
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'editor', 'member', 'viewer')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, initials, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'initials', ''),
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Workspaces
create table if not exists public.workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  created_by uuid references public.profiles(id),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now()
);

alter table public.workspaces enable row level security;

create policy "Workspaces viewable by authenticated" on public.workspaces
  for select to authenticated using (true);

create policy "Workspaces insertable by authenticated" on public.workspaces
  for insert to authenticated with check (true);

create policy "Workspaces updatable by creator" on public.workspaces
  for update to authenticated using (auth.uid() = created_by);

-- 3. Tags
create table if not exists public.tags (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  color text default '#5A5C5A'
);

alter table public.tags enable row level security;

create policy "Tags viewable by authenticated" on public.tags
  for select to authenticated using (true);

create policy "Tags insertable by authenticated" on public.tags
  for insert to authenticated with check (true);

-- 4. Articles
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  content text default '',
  author_id uuid references public.profiles(id),
  status text not null default 'draft' check (status in ('published', 'draft', 'archived', 'in_review')),
  current_version int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.articles enable row level security;

create policy "Articles viewable by authenticated" on public.articles
  for select to authenticated using (true);

create policy "Articles insertable by authenticated" on public.articles
  for insert to authenticated with check (auth.uid() = author_id);

create policy "Articles updatable by author" on public.articles
  for update to authenticated using (auth.uid() = author_id);

create policy "Articles deletable by author" on public.articles
  for delete to authenticated using (auth.uid() = author_id);

-- 5. Article-Tag junction
create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

alter table public.article_tags enable row level security;

create policy "Article tags viewable by authenticated" on public.article_tags
  for select to authenticated using (true);

create policy "Article tags insertable by authenticated" on public.article_tags
  for insert to authenticated with check (true);

create policy "Article tags deletable by authenticated" on public.article_tags
  for delete to authenticated using (true);

-- 6. Discussions
create table if not exists public.discussions (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  content text default '',
  author_id uuid references public.profiles(id),
  status text not null default 'open' check (status in ('open', 'closed', 'resolved')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.discussions enable row level security;

create policy "Discussions viewable by authenticated" on public.discussions
  for select to authenticated using (true);

create policy "Discussions insertable by authenticated" on public.discussions
  for insert to authenticated with check (auth.uid() = author_id);

create policy "Discussions updatable by author" on public.discussions
  for update to authenticated using (auth.uid() = author_id);

-- 7. Replies
create table if not exists public.replies (
  id uuid default gen_random_uuid() primary key,
  discussion_id uuid references public.discussions(id) on delete cascade,
  content text not null,
  author_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

alter table public.replies enable row level security;

create policy "Replies viewable by authenticated" on public.replies
  for select to authenticated using (true);

create policy "Replies insertable by authenticated" on public.replies
  for insert to authenticated with check (auth.uid() = author_id);

-- ====================================
-- Seed Data
-- ====================================

-- Default workspaces
insert into public.workspaces (name, description, status) values
  ('Engineering', 'Engineering team knowledge base', 'active'),
  ('Product', 'Product team documentation', 'active'),
  ('Design', 'Design system and guidelines', 'active');

-- Tags for each workspace
insert into public.tags (workspace_id, name, color)
select w.id, t.name, '#5A5C5A'
from public.workspaces w
cross join (values ('API'), ('Database'), ('DevOps')) as t(name)
where w.name = 'Engineering';

insert into public.tags (workspace_id, name, color)
select w.id, t.name, '#5A5C5A'
from public.workspaces w
cross join (values ('Roadmap'), ('Requirements')) as t(name)
where w.name = 'Product';

insert into public.tags (workspace_id, name, color)
select w.id, t.name, '#5A5C5A'
from public.workspaces w
cross join (values ('UI'), ('UX')) as t(name)
where w.name = 'Design';
