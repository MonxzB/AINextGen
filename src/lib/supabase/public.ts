import "server-only";
import { createClient } from "@supabase/supabase-js";

let publicClient:ReturnType<typeof createClient>|null=null;

export function getPublicClient(){
  if(publicClient)return publicClient;
  publicClient=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
    global:{headers:{"X-Client-Info":"ainextgen-public"}},
  });
  return publicClient;
}
