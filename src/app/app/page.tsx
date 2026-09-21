import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
const nav=["AI Manager","Deals","Leads","Properties","Contacts","Calendar","Agents","Market","Activity","Integrations","Settings"];
export default async function Workspace(){
 const supabase=await createClient();
 const {data}=await supabase.auth.getClaims();
 if(!data?.claims?.sub) redirect("/login");
 const userId=String(data.claims.sub);
 const {data:profile}=await supabase.from("profiles").select("full_name").eq("id",userId).maybeSingle();
 const {data:memberships}=await supabase.from("organization_members").select("role,organizations(id,name)").eq("user_id",userId);
 return <main><aside><h2>Agentic RE OS</h2>{nav.map(x=><div key={x}>{x}</div>)}</aside><section><div className="topbar"><div><p className="eyebrow">SECURE WORKSPACE</p><h1>Welcome {profile?.full_name||""}</h1></div><form action={logout}><button>Sign out</button></form></div><p className="muted">Authenticated session · tenant-isolated by Supabase RLS.</p><div className="grid"><article><b>Authentication</b><strong>Verified</strong><small>Supabase Auth + SSR cookies</small></article><article><b>Organizations</b><strong>{memberships?.length||0}</strong><small>Membership-scoped access</small></article><article><b>Role</b><strong>{memberships?.[0]?.role||"Not assigned"}</strong><small>Owner / Admin / Member</small></article></div><h3>Your organizations</h3><div className="empty">{memberships?.length?memberships.map((m:any)=><div key={m.organizations?.id}>{m.organizations?.name} · {m.role}</div>):"No organization assigned yet."}</div></section></main>
}
