-- SNG Company — database schema (Supabase / Postgres)
-- The Supabase project is shared with other apps: every SNG object is prefixed "sng-" / sng_.
-- Paste the whole file into Supabase › SQL Editor and run it. It is idempotent (can be re-run).
--
-- Access:
--   - backoffice: only users listed in "sng-staff" (created with scripts/create-staff.mjs)
--   - public site: may only submit quote requests, through the sng_submit_demande() function

-- ---------- staff ----------
create table if not exists "sng-staff" (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  role text not null default 'Administrateur'
);

create or replace function sng_is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from "sng-staff" where user_id = auth.uid())
$$;

-- ---------- references (DEM-0001, FAC-2026-0001…) ----------
create sequence if not exists sng_ref_demandes;
create sequence if not exists sng_ref_locations;
create sequence if not exists sng_ref_transports;
create sequence if not exists sng_ref_locations_equipement;
create sequence if not exists sng_ref_lavages;
create sequence if not exists sng_ref_ventes_elevage;
create sequence if not exists sng_ref_factures;

-- ---------- tables ----------
create table if not exists "sng-clients" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  name text not null, type text default 'particulier', phone text, email text, city text, address text, notes text
);

create table if not exists "sng-demandes" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'DEM-' || lpad(nextval('sng_ref_demandes')::text, 4, '0'),
  service text not null, name text not null, phone text not null, email text,
  details text, wished_date date, date date default current_date, status text default 'nouvelle', notes text
);

create table if not exists "sng-vehicules" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  plate text unique not null, brand text, model text, year int, category text, gearbox text, seats int,
  mileage int, price_day numeric, status text default 'disponible', insurance_end date, next_service date,
  photos jsonb default '[]'::jsonb
);

create table if not exists "sng-locations" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'LOC-' || lpad(nextval('sng_ref_locations')::text, 4, '0'),
  client text, vehicle text, debut date, fin date, driver text default 'non',
  amount numeric, deposit numeric, status text default 'reservee', notes text,
  documents jsonb default '[]'::jsonb
);

create table if not exists "sng-transports" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'TRP-' || lpad(nextval('sng_ref_transports')::text, 4, '0'),
  kind text, client text, "from" text, "to" text, date date, volume text,
  driver text, vehicle text, amount numeric, status text default 'planifiee', notes text
);

create table if not exists "sng-equipements" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  code text unique, name text not null, category text, quantity int default 1, available int default 1,
  price_day numeric, condition text default 'bon', status text default 'disponible',
  photos jsonb default '[]'::jsonb
);

create table if not exists "sng-locations-equipement" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'LEQ-' || lpad(nextval('sng_ref_locations_equipement')::text, 4, '0'),
  client text, equipment text, quantity int, site text, debut date, fin date,
  amount numeric, status text default 'reservee'
);

create table if not exists "sng-lavages" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'LAV-' || lpad(nextval('sng_ref_lavages')::text, 4, '0'),
  client text, plate text, vehicle_type text, formula text, place text,
  date date, time text, amount numeric, status text default 'planifie'
);

create table if not exists "sng-lots" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  code text unique, species text, building text, headcount int, deaths int default 0,
  debut date, expected_end date, feed_kg numeric, status text default 'en_cours', notes text,
  photos jsonb default '[]'::jsonb
);

create table if not exists "sng-ventes-elevage" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'VEL-' || lpad(nextval('sng_ref_ventes_elevage')::text, 4, '0'),
  client text, date date, product text, quantity numeric, unit_price numeric,
  amount numeric, status text default 'commandee'
);

create table if not exists "sng-factures" (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ref text unique default 'FAC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('sng_ref_factures')::text, 4, '0'),
  client text, activity text, date date, due date, label text,
  amount numeric, paid numeric default 0, payment_method text, status text default 'brouillon',
  documents jsonb default '[]'::jsonb
);

-- ---------- row level security: staff only ----------
do $$ declare t text; begin
  foreach t in array array['sng-staff','sng-clients','sng-demandes','sng-vehicules','sng-locations','sng-transports',
    'sng-equipements','sng-locations-equipement','sng-lavages','sng-lots','sng-ventes-elevage','sng-factures'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists sng_staff_all on %I', t);
    execute format('create policy sng_staff_all on %I for all to authenticated using (sng_is_staff()) with check (sng_is_staff())', t);
  end loop;
end $$;

-- A signed-in user may read their own staff row (used to check access at login)
drop policy if exists sng_staff_self on "sng-staff";
create policy sng_staff_self on "sng-staff" for select to authenticated using (user_id = auth.uid());

-- ---------- public quote form ----------
-- The site cannot read or write tables: it calls this function, which only inserts a new request.
create or replace function sng_submit_demande(
  p_service text, p_name text, p_phone text, p_email text default null, p_wished_date date default null, p_details text default null
) returns text
language plpgsql security definer set search_path = public as $$
declare v_ref text;
begin
  if p_service not in ('location-vehicules','transport-logistique','location-equipements','lavage-vehicules','elevage') then
    raise exception 'Service inconnu';
  end if;
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_phone), '') = '' then
    raise exception 'Nom et téléphone requis';
  end if;
  insert into "sng-demandes" (service, name, phone, email, wished_date, details, status)
  values (p_service, left(trim(p_name), 120), left(trim(p_phone), 40), nullif(left(trim(p_email), 160), ''), p_wished_date, left(p_details, 3000), 'nouvelle')
  returning ref into v_ref;
  return v_ref;
end $$;

revoke all on function sng_submit_demande(text, text, text, text, date, text) from public;
grant execute on function sng_submit_demande(text, text, text, text, date, text) to anon, authenticated;

-- =====================================================================
-- Contenu du site (textes et images modifiables depuis Gestion › Site web)
-- key: "company", "home", "service:<slug>" — value: document JSON fusionné avec les valeurs par défaut du code
-- =====================================================================
create table if not exists "sng-content" (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table "sng-content" enable row level security;
drop policy if exists sng_staff_all on "sng-content";
create policy sng_staff_all on "sng-content" for all to authenticated using (sng_is_staff()) with check (sng_is_staff());
drop policy if exists sng_public_read on "sng-content";
create policy sng_public_read on "sng-content" for select to anon, authenticated using (true);

-- =====================================================================
-- Catalogue d'équipements (boutique en ligne)
-- =====================================================================
alter table "sng-equipements" add column if not exists description text;
alter table "sng-equipements" add column if not exists published boolean default true;
drop policy if exists sng_public_catalogue on "sng-equipements";
create policy sng_public_catalogue on "sng-equipements" for select to anon, authenticated using (published = true);

alter table "sng-locations-equipement" add column if not exists equipment_id uuid;
alter table "sng-locations-equipement" add column if not exists phone text;
alter table "sng-locations-equipement" add column if not exists email text;
alter table "sng-locations-equipement" add column if not exists notes text;
alter table "sng-locations-equipement" add column if not exists source text default 'backoffice';

-- Commande depuis le site : vérifie la disponibilité, calcule le montant, enregistre une demande à valider
create or replace function sng_submit_commande(
  p_equipment_id uuid, p_quantity int, p_debut date, p_fin date,
  p_name text, p_phone text, p_email text default null, p_site text default null, p_notes text default null
) returns text
language plpgsql security definer set search_path = public as $$
declare e "sng-equipements"%rowtype; v_days int; v_ref text;
begin
  select * into e from "sng-equipements" where id = p_equipment_id and published = true;
  if not found then raise exception 'Équipement introuvable'; end if;
  if coalesce(p_quantity, 0) < 1 then raise exception 'Quantité invalide'; end if;
  if p_quantity > coalesce(e.available, 0) then raise exception 'Stock insuffisant : % disponible(s)', coalesce(e.available, 0); end if;
  if p_debut is null or p_fin is null or p_fin < p_debut or p_debut < current_date then raise exception 'Dates invalides'; end if;
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_phone), '') = '' then raise exception 'Nom et téléphone requis'; end if;
  v_days := (p_fin - p_debut) + 1;
  insert into "sng-locations-equipement" (client, equipment, equipment_id, quantity, site, debut, fin, amount, status, phone, email, notes, source)
  values (left(trim(p_name), 120), e.name, e.id, p_quantity, left(p_site, 200), p_debut, p_fin,
          p_quantity * coalesce(e.price_day, 0) * v_days, 'demande', left(trim(p_phone), 40), nullif(left(trim(p_email), 160), ''), left(p_notes, 2000), 'site')
  returning ref into v_ref;
  return v_ref;
end $$;
revoke all on function sng_submit_commande(uuid, int, date, date, text, text, text, text, text) from public;
grant execute on function sng_submit_commande(uuid, int, date, date, text, text, text, text, text) to anon, authenticated;
