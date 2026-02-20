-- Update to add Version History
-- Run this in your Supabase SQL Editor

-- 1. Create Article Versions Table
drop table if exists public.article_versions cascade;
create table public.article_versions (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade not null,
  title text not null,
  content text default '',
  author_id uuid references public.profiles(id) not null,
  version_number int not null,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table public.article_versions enable row level security;

-- 3. Policies
create policy "Article versions viewable by authenticated" on public.article_versions
  for select to authenticated using (true);

create policy "Article versions insertable by authenticated" on public.article_versions
  for insert to authenticated with check (true);

-- 4. Initial Trigger or Backfill (Optional)
-- If you want to insert a v1 for existing articles:
-- insert into public.article_versions (article_id, title, content, author_id, version_number, created_at)
-- select id, title, content, author_id, current_version, updated_at from public.articles;
