-- Run this once in your Supabase SQL editor (https://supabase.com → project → SQL Editor)

create table if not exists tickets (
  id              uuid        primary key default gen_random_uuid(),

  -- Student info
  student_name    text        not null,
  grade           text        not null check (grade in ('9','10','11','12')),
  subjects        text        not null,
  session_format  text        not null check (session_format in ('In-Person','Online','Either')),
  preferred_times text,

  -- Parent/guardian contact
  parent_name     text        not null,
  parent_email    text        not null,
  parent_phone    text        not null,
  notes           text,

  -- Internal workflow
  status          text        not null default 'new'
                              check (status in ('new','contacted','completed','archived')),
  internal_notes  text,
  contacted_at    timestamptz,

  -- Timestamps
  submitted_at    timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Fast lookups by status and time
create index if not exists tickets_status_idx       on tickets (status);
create index if not exists tickets_submitted_at_idx on tickets (submitted_at desc);

-- Auto-bump updated_at on every row change
create or replace function _set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tickets_updated_at on tickets;
create trigger set_tickets_updated_at
  before update on tickets
  for each row execute procedure _set_updated_at();

-- Row Level Security: all access goes through the service-role key (server only).
-- Anon/authenticated roles cannot read or write tickets at all.
alter table tickets enable row level security;

-- If applying to an existing database that was created without contacted_at:
-- alter table tickets add column if not exists contacted_at timestamptz;
