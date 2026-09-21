create extension if not exists pgcrypto;
create schema if not exists private;

create table organizations(id uuid primary key default gen_random_uuid(),name text not null,created_at timestamptz not null default now());
create table organization_members(id uuid primary key default gen_random_uuid(),organization_id uuid not null references organizations(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,role text not null default 'member',created_at timestamptz not null default now(),unique(organization_id,user_id));
create table parties(id uuid primary key default gen_random_uuid(),organization_id uuid not null references organizations(id) on delete cascade,kind text not null check(kind in('person','organization')),display_name text not null,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table assets(id uuid primary key default gen_random_uuid(),organization_id uuid not null references organizations(id) on delete cascade,asset_type text not null,status text not null default 'active',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table opportunities(id uuid primary key default gen_random_uuid(),organization_id uuid not null references organizations(id) on delete cascade,party_id uuid references parties(id),asset_id uuid references assets(id),objective text not null,stage text not null default 'new',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table properties(id uuid primary key default gen_random_uuid(),organization_id uuid not null references organizations(id) on delete cascade,asset_id uuid not null unique references assets(id) on delete cascade,title text not null,country_code text,city text,asking_price numeric,currency text default 'USD',created_at timestamptz not null default now());
create table audit_events(id bigint generated always as identity primary key,organization_id uuid not null references organizations(id) on delete cascade,actor_type text not null,actor_id text,action text not null,entity_type text,entity_id text,metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create table approval_requests(id uuid primary key default gen_random_uuid(),organization_id uuid not null references organizations(id) on delete cascade,action text not null,execution_class text not null check(execution_class in('autonomous','policy_controlled','human_approval')),status text not null default 'pending',payload jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create table usage_records(id bigint generated always as identity primary key,organization_id uuid references organizations(id) on delete cascade,provider text not null,kind text not null,units numeric not null default 0,cost_usd numeric not null default 0,created_at timestamptz not null default now());

alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table parties enable row level security;
alter table assets enable row level security;
alter table opportunities enable row level security;
alter table properties enable row level security;
alter table audit_events enable row level security;
alter table approval_requests enable row level security;
alter table usage_records enable row level security;

create or replace function private.is_org_member(org uuid)
returns boolean language sql stable security definer set search_path=''
as $$select (select auth.uid()) is not null and exists(select 1 from public.organization_members m where m.organization_id=org and m.user_id=(select auth.uid()))$$;
revoke all on function private.is_org_member(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_org_member(uuid) to authenticated;

create policy organizations_member_select on organizations for select to authenticated using(private.is_org_member(id));
create policy org_members_self on organization_members for select to authenticated using(user_id=(select auth.uid()));
create policy parties_tenant on parties for all to authenticated using(private.is_org_member(organization_id)) with check(private.is_org_member(organization_id));
create policy assets_tenant on assets for all to authenticated using(private.is_org_member(organization_id)) with check(private.is_org_member(organization_id));
create policy opportunities_tenant on opportunities for all to authenticated using(private.is_org_member(organization_id)) with check(private.is_org_member(organization_id));
create policy properties_tenant on properties for all to authenticated using(private.is_org_member(organization_id)) with check(private.is_org_member(organization_id));
create policy audit_tenant on audit_events for select to authenticated using(private.is_org_member(organization_id));
create policy approvals_tenant on approval_requests for all to authenticated using(private.is_org_member(organization_id)) with check(private.is_org_member(organization_id));
create policy usage_tenant on usage_records for select to authenticated using(private.is_org_member(organization_id));

create index approval_requests_organization_id_idx on approval_requests(organization_id);
create index assets_organization_id_idx on assets(organization_id);
create index audit_events_organization_id_idx on audit_events(organization_id);
create index opportunities_asset_id_idx on opportunities(asset_id);
create index opportunities_organization_id_idx on opportunities(organization_id);
create index opportunities_party_id_idx on opportunities(party_id);
create index organization_members_user_id_idx on organization_members(user_id);
create index parties_organization_id_idx on parties(organization_id);
create index properties_organization_id_idx on properties(organization_id);
create index usage_records_organization_id_idx on usage_records(organization_id);
