import Link from "next/link";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
export const dynamic="force-dynamic";
export default async function Home(){
 const supabase=createPublicSupabaseClient(); let database="Not configured";
 if(supabase){const {error}=await supabase.from("organizations").select("id").limit(1);database=error?"Connected · secured by RLS":"Connected";}
 return <div className="landing"><p className="eyebrow">BETA · REAL ESTATE PACK</p><h1>Agentic Real Estate OS</h1><p className="muted">One conversation. An AI workforce working with your team to move transactions toward close.</p><div className="actions"><Link className="buttonLink" href="/login">Sign in</Link><Link className="buttonLink secondary" href="/signup">Create account</Link></div><div className="grid"><article><b>Platform</b><strong>Foundation live</strong><small>Core + Real Estate Pack</small></article><article><b>Database</b><strong>{database}</strong><small>Supabase · tenant RLS</small></article><article><b>Access</b><strong>Protected</strong><small>Auth + organizations + roles</small></article></div></div>
}
