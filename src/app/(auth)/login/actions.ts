"use server";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
export async function login(formData:FormData){if(!isSupabaseConfigured())redirect("/login?error=Hãy cấu hình Supabase trong .env.local trước");const supabase=await createClient();const {error}=await supabase.auth.signInWithPassword({email:String(formData.get("email")),password:String(formData.get("password"))});if(error)redirect(`/login?error=${encodeURIComponent("Email hoặc mật khẩu không đúng")}`);redirect("/admin")}
export async function logout(){const supabase=await createClient();await supabase.auth.signOut();redirect("/login")}
