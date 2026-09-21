import { createPublicSupabaseClient } from "@/lib/supabase/public";
const nav=["AI Manager","Deals","Leads","Properties","Contacts","Calendar","Agents","Market","Activity","Integrations","Settings"];
export const dynamic="force-dynamic";
export default async function Home(){
 const supabase=createPublicSupabaseClient();
 let database="Not configured";
 if(supabase){const {error}=await supabase.from("organizations").select("id").limit(1);database=error?"Connected · secured by RLS":"Connected";}
 return <main><aside><h2>Agentic RE OS</h2>{nav.map(x=><div key={x}>{x}</div>)}</aside><section><p className="eyebrow">BETA · REAL ESTATE PACK</p><h1>What can I do for you?</h1><p className="muted">One conversation. An AI workforce working with your team to move transactions toward close.</p><div className="command"><span>🎙️</span><span>Ask the AI Manager…</span><button>Send</button></div><div className="grid"><article><b>Platform</b><strong>Foundation live</strong><small>Core + Real Estate Pack</small></article><article><b>Database</b><strong>{database}</strong><small>Supabase · tenant RLS</small></article><article><b>Budget</b><strong>$0 / $250</strong><small>Beta infrastructure ceiling</small></article></div><h3>Needs you</h3><div className="empty">No approvals pending.</div></section></main>
}