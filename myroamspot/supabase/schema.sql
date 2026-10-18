-- MyRoamSpot schema — Plan 2 creates the Supabase project and applies this
-- in the dashboard. Kept in-repo so the schema is versioned from day one.
-- Money is always integer cents (EUR). No client-side RLS roles yet: Plan 2
-- grants the service key only, accessed server-side.

create table if not exists packages (
  id                     uuid primary key default gen_random_uuid(),
  destination_slug       text not null,
  name_fr                text not null,
  days                   int  not null check (days > 0),
  data_gb                int  not null check (data_gb >= 0),
  price_cents            int  not null check (price_cents >= 0),
  wholesale_net_cents    int,                    -- eSIM Access wholesale price, net
  esim_access_package_id text,                    -- provider package id for fulfillment
  active                 boolean not null default true,
  updated_at             timestamptz not null default now()
);

create index if not exists packages_destination_idx on packages (destination_slug, active, price_cents);

create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  order_ref           text not null unique,
  email               text not null,
  package_id          uuid not null references packages (id),
  provider            text not null check (provider in ('whop', 'paddle')),
  provider_session_id text unique,
  amount_cents        int  not null check (amount_cents >= 0),
  currency            text not null default 'EUR' check (currency in ('EUR')),
  status              text not null check (status in ('pending', 'paid', 'fulfilled', 'refunded', 'failed')),
  esim_details        jsonb,
  created_at          timestamptz not null default now(),
  fulfilled_at        timestamptz
);

-- Idempotent fulfillment: webhook handlers upsert here keyed by
-- provider_session_id so a replayed webhook cannot double-issue eSIMs.
create table if not exists sync_log (
  id           bigserial primary key,
  provider     text not null,
  event        text not null,
  session_id   text,
  payload_hash text,
  processed_at timestamptz not null default now()
);
