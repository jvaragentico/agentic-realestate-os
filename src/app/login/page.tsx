import Link from "next/link";
import { login } from "@/app/auth/actions";
export default async function Login({searchParams}:{searchParams:Promise<{error?:string;message?:string}>}){
 const p=await searchParams;
 return <div className="authPage"><form className="authCard" action={login}><p className="eyebrow">AGENTIC RE OS</p><h1>Sign in</h1><p className="muted">Secure access to your real estate operating system.</p>{p.error&&<p className="notice error">{p.error}</p>}{p.message&&<p className="notice">{p.message}</p>}<label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type="password" required minLength={8} autoComplete="current-password"/></label><button type="submit">Sign in</button><small>New organization? <Link href="/signup">Create an account</Link></small></form></div>
}
