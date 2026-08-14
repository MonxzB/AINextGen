import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorialArticle } from "@/components/tutorial-article";
import { createClient } from "@/lib/supabase/server";
import type { Tutorial } from "@/types/tutorial";

export const metadata:Metadata={title:"Xem trước tutorial",robots:{index:false,follow:false,nocache:true}};
const fields="id,title,slug,excerpt,content,content_blocks,cover_url,difficulty,duration_minutes,category,tools,is_featured,seo_title,seo_description,author_name,author_bio,source_references,reviewed_at,published_at,updated_at";
export default async function DraftPreview({params}:{params:Promise<{id:string}>}){
  const db=await createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user)notFound();
  const {data:profile}=await db.from("users").select("role").eq("id",user.id).single();
  if(!profile||!["admin","editor"].includes(profile.role))notFound();
  const {data}=await db.from("articles").select(fields).eq("id",(await params).id).single();
  if(!data)notFound();
  const tutorial={...data,published_at:data.published_at||data.updated_at||new Date().toISOString()} as unknown as Tutorial;
  return <TutorialArticle tutorial={tutorial} preview/>;
}
