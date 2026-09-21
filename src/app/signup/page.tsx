import Link from "next/link";
import { signup } from "@/app/auth/actions";
export default async function Signup({searchParams}:{searchParams:Promise<{error?:string}>}){
 const p=await searchParams;
 return <div className="authPage"><form className="authCard" action={signup}><p className="eyebrow">AGENTIC RE OS</p><h1>Create account</h1><p className="muted">Start a secure workspace for your team.</p>{p.error&&<p className="notice error">{p.error}</p>}<label>Name<input name="full_name" required autoComplete="name"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type="password" required minLength={8} autoComplete="new-password"/></label><button type="submit">Create account</button><small>Already registered? <Link href="/login">Sign in</Link></small></form></div>
}
