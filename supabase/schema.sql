-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Tables
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  banner_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  author_name text,
  message text not null,
  approved boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint message_length check (char_length(message) <= 300)
);

create table public.post_images (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Storage Bucket
-- NOTA: O bucket 'event-media' deve ser criado MANUALMENTE na aba "Storage" do painel do Supabase.
-- Certifique-se de marcá-lo como "Public" (Público).

-- 3. Row Level Security (RLS)
alter table public.events enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;

-- Policies for Events
create policy "Events are viewable by everyone" on public.events
  for select using (true);

-- Policies for Posts
create policy "Posts are viewable by everyone if approved" on public.posts
  for select using (approved = true);

create policy "Admins can view all posts" on public.posts
  for select using (auth.role() = 'authenticated');

create policy "Admins can update posts" on public.posts
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete posts" on public.posts
  for delete using (auth.role() = 'authenticated');

create policy "Anyone can create a post" on public.posts
  for insert with check (true);

-- Policies for Post Images
create policy "Post images are viewable by everyone" on public.post_images
  for select using (
    exists (
      select 1 from public.posts
      where posts.id = post_images.post_id and posts.approved = true
    )
  );

create policy "Admins can view all post images" on public.post_images
  for select using (auth.role() = 'authenticated');

create policy "Anyone can insert a post image" on public.post_images
  for insert with check (true);

-- Policies for Storage (event-media)
create policy "Anyone can upload to event-media" on storage.objects
  for insert with check (bucket_id = 'event-media');

-- 4. Create Indexes
create index posts_event_id_idx on public.posts(event_id);
create index post_images_post_id_idx on public.post_images(post_id);

-- 5. Enable Realtime
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.post_images;

-- Setup Sample Event
insert into public.events (slug, title, description)
values ('demo-event', 'Semana da Indústria 2026', 'Welcome to our social wall demo!');
