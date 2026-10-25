create table if not exists header_profiles (
  id text primary key,
  display_name text not null default '',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists header_tasks (
  id text primary key,
  owner_id text not null,
  parent_id text references header_tasks(id) on delete cascade,
  is_parent boolean not null default false,
  title text not null,
  weekday integer not null check (weekday between 0 and 6),
  period text not null,
  completed boolean not null default false,
  position integer not null default 0,
  description text not null default '',
  due_time text not null default '',
  kind text not null default 'check',
  background text not null default '',
  text_color text not null default '',
  accent text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists header_tasks_owner_position_idx on header_tasks(owner_id,position);
create index if not exists header_tasks_parent_idx on header_tasks(parent_id);

create table if not exists header_events (
  id text primary key,
  owner_id text not null,
  title text not null,
  date text not null,
  time text not null default '',
  type text not null default '',
  description text not null default '',
  color text not null default '',
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists header_events_owner_date_idx on header_events(owner_id,date);

create table if not exists header_habits (
  id text primary key,
  owner_id text not null,
  title text not null,
  goal text not null default '',
  days integer[] not null default '{}',
  completions text[] not null default '{}',
  color text not null default '',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists header_habits_owner_idx on header_habits(owner_id);

create table if not exists header_challenges (
  id text primary key,
  owner_id text not null,
  title text not null,
  situation text not null default '',
  desired text not null default '',
  strategy text not null default '',
  checks jsonb not null default '[]'::jsonb,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists header_challenges_owner_idx on header_challenges(owner_id);

create table if not exists header_finance_items (
  id text primary key,
  owner_id text not null,
  kind text not null,
  title text not null,
  category text not null default '',
  amount numeric(14,2) not null default 0,
  description text not null default '',
  product_url text not null default '',
  photo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists header_finance_owner_created_idx on header_finance_items(owner_id,created_at desc);
