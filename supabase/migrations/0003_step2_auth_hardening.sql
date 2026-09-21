-- Step 2 hardening: safe organization onboarding and non-recursive role policies.
create or replace function private.is_org_admin(org uuid)
returns boolean language sql stable security definer set search_path=''
as $$select (select auth.uid()) is not null and exists(select 1 from public.organization_members m where m.organization_id=org and m.user_id=(select auth.uid()) and m.role in ('owner','admin'))$$;
revoke all on function private.is_org_admin(uuid) from public, anon;
grant execute on function private.is_org_admin(uuid) to authenticated;

drop policy if exists roles_tenant_write on public.roles;
drop policy if exists roles_tenant_insert on public.roles;
drop policy if exists roles_tenant_update on public.roles;
drop policy if exists roles_tenant_delete on public.roles;
create policy roles_tenant_insert on public.roles for insert to authenticated with check(private.is_org_admin(organization_id));
create policy roles_tenant_update on public.roles for update to authenticated using(private.is_org_admin(organization_id)) with check(private.is_org_admin(organization_id));
create policy roles_tenant_delete on public.roles for delete to authenticated using(private.is_org_admin(organization_id));

drop policy if exists org_members_admin_insert on public.organization_members;
drop policy if exists org_members_admin_update on public.organization_members;
drop policy if exists org_members_admin_delete on public.organization_members;
create policy org_members_admin_insert on public.organization_members for insert to authenticated with check(private.is_org_admin(organization_id));
create policy org_members_admin_update on public.organization_members for update to authenticated using(private.is_org_admin(organization_id)) with check(private.is_org_admin(organization_id));
create policy org_members_admin_delete on public.organization_members for delete to authenticated using(private.is_org_admin(organization_id));

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path=''
as $$
declare org_id uuid; role_id uuid; display_name text;
begin
 display_name:=coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1), 'My');
 insert into public.profiles(id,full_name) values(new.id,display_name) on conflict(id) do nothing;
 insert into public.organizations(name) values(display_name || ' Workspace') returning id into org_id;
 insert into public.roles(organization_id,name,permissions) values(org_id,'Owner','["*"]'::jsonb) returning id into role_id;
 insert into public.organization_members(organization_id,user_id,role,role_id) values(org_id,new.id,'owner',role_id);
 return new;
end; $$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
