"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agentic-realestate-os-jvar2.vercel.app";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  redirect("/app");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const full_name = String(formData.get("full_name") || "");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: siteUrl + "/auth/confirm",
    },
  });
  if (error) redirect("/signup?error=" + encodeURIComponent(error.message));
  if (!data.session) redirect("/login?message=" + encodeURIComponent("Check your email to confirm your account."));
  redirect("/app");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
