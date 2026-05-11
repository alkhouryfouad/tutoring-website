-- Run this once in your Supabase SQL editor after migration.sql.
-- Adds the contact_messages table for the general "get in touch" form
-- (separate from the structured booking inquiries stored in tickets).

create table if not exists contact_messages (
  id              uuid        primary key default gen_random_uuid(),

  name            text        not null,
  email           text        not null,
  message         text        not null,

  status          text        not null default 'new'
                              check (status in ('new','replied','archived')),
  internal_notes  text,
  replied_at      timestamptz,

  submitted_at    timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists contact_messages_status_idx       on contact_messages (status);
create index if not exists contact_messages_submitted_at_idx on contact_messages (submitted_at desc);

-- Reuse the _set_updated_at() function defined in migration.sql.
drop trigger if exists set_contact_messages_updated_at on contact_messages;
create trigger set_contact_messages_updated_at
  before update on contact_messages
  for each row execute procedure _set_updated_at();

alter table contact_messages enable row level security;
