-- Update the constraint on the status column of the articles table to include 'in_review'
alter table public.articles drop constraint articles_status_check;
alter table public.articles add constraint articles_status_check check (status in ('published', 'draft', 'archived', 'in_review'));
