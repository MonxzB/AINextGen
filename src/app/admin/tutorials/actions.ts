"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { ContentBlock, TutorialActionState } from "@/types/admin";

const schema=z.object({id:z.string().uuid().optional().or(z.literal("")),title:z.string().trim().min(5,"Tiêu đề cần ít nhất 5 ký tự").max(120),slug:z.string().trim().max(140).optional(),excerpt:z.string().trim().min(20,"Mô tả cần ít nhất 20 ký tự").max(320),content:z.string().trim().min(10,"Hãy thêm nội dung cho bài viết"),content_blocks:z.string().min(2),cover_url:z.string().url("URL ảnh không hợp lệ").or(z.literal("")),category:z.string().trim().min(2).max(60),difficulty:z.enum(["beginner","intermediate","advanced"]),duration_minutes:z.coerce.number().int().min(1).max(180),tools:z.string().max(300).optional(),seo_title:z.string().max(70).optional(),seo_description:z.string().max(180).optional(),author_name:z.string().trim().min(2,"Hãy nhập tên tác giả").max(100),author_bio:z.string().trim().max(300).optional(),source_references:z.string().max(4000).optional(),reviewed_at:z.string().optional()});
const blockSchema=z.array(z.object({id:z.string().min(1),type:z.enum(["heading","paragraph","image","code","prompt","checklist","warning","quote"]),text:z.string().max(30000).optional(),url:z.string().url().or(z.literal("")).optional(),alt:z.string().max(240).optional(),caption:z.string().max(500).optional(),language:z.string().max(40).optional()})).min(1,"Bài viết cần ít nhất một khối nội dung").max(300);

function parseSources(value?:string){
  const sources=[] as {label:string;url:string}[];
  for(const line of (value||"").split("\n").map((item)=>item.trim()).filter(Boolean)){
    const separator=line.lastIndexOf("|");
    const label=(separator>=0?line.slice(0,separator):line).trim();
    const url=(separator>=0?line.slice(separator+1):line).trim();
    try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol))throw new Error();sources.push({label:label||parsed.hostname,url:parsed.toString()});}
    catch{return {sources:[],error:`Nguồn không hợp lệ: ${line}. Dùng định dạng Tên nguồn | https://...`};}
  }
  return {sources,error:null};
}

async function requireUser(){const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect("/login");return {db,user};}

export async function saveTutorial(_state:TutorialActionState,formData:FormData):Promise<TutorialActionState>{
  if(!isSupabaseConfigured())return {error:"Chưa kết nối Supabase. Hãy cấu hình biến môi trường trước khi lưu nội dung."};
  const parsed=schema.safeParse(Object.fromEntries(formData));
  if(!parsed.success)return {error:"Vui lòng kiểm tra các trường được đánh dấu.",fieldErrors:parsed.error.flatten().fieldErrors};
  let rawBlocks:unknown;
  try{rawBlocks=JSON.parse(parsed.data.content_blocks);}catch{return {error:"Dữ liệu khối nội dung không hợp lệ. Hãy tải lại trang và thử lại."};}
  const parsedBlocks=blockSchema.safeParse(rawBlocks);
  if(!parsedBlocks.success)return {error:parsedBlocks.error.issues[0]?.message||"Khối nội dung không hợp lệ.",fieldErrors:{content_blocks:["Kiểm tra lại nội dung và hình ảnh."]}};
  const contentBlocks=parsedBlocks.data.filter((block)=>block.type==="image"?Boolean(block.url):Boolean(block.text?.trim())) as ContentBlock[];
  if(!contentBlocks.length)return {error:"Bài viết cần ít nhất một đoạn văn, tiêu đề hoặc hình ảnh."};
  const sourceResult=parseSources(parsed.data.source_references);
  if(sourceResult.error)return {error:sourceResult.error,fieldErrors:{source_references:[sourceResult.error]}};
  const {db,user}=await requireUser();
  const input=parsed.data;
  const status=formData.get("intent")==="published"?"published":"draft";
  let publishedAt:string|null=null;
  if(input.id){const {data}=await db.from("articles").select("published_at").eq("id",input.id).single();publishedAt=data?.published_at||null;}
  if(status==="published"&&!publishedAt)publishedAt=new Date().toISOString();
  const values={author_id:user.id,title:input.title,slug:input.slug||slugify(input.title),excerpt:input.excerpt,content:input.content,content_blocks:contentBlocks,cover_url:input.cover_url||null,category:input.category,difficulty:input.difficulty,duration_minutes:input.duration_minutes,tools:input.tools?.split(",").map((item)=>item.trim()).filter(Boolean)||[],is_featured:formData.get("is_featured")==="on",status,article_type:"blog",published_at:status==="published"?publishedAt:null,seo_title:input.seo_title||null,seo_description:input.seo_description||null,author_name:input.author_name,author_bio:input.author_bio||null,source_references:sourceResult.sources,reviewed_at:input.reviewed_at?new Date(`${input.reviewed_at}T12:00:00`).toISOString():null,updated_at:new Date().toISOString()};
  const result=input.id?await db.from("articles").update(values).eq("id",input.id):await db.from("articles").insert(values);
  if(result.error)return {error:result.error.code==="23505"?"Slug đã tồn tại. Hãy chọn slug khác.":result.error.message.includes("content_blocks")?"Database chưa có block editor. Hãy chạy migration 005_article_block_editor.sql.":result.error.message.includes("author_name")||result.error.message.includes("source_references")||result.error.message.includes("reviewed_at")?"Database chưa có trường tác giả và kiểm chứng. Hãy chạy migration 007_content_experience.sql.":result.error.message};
  revalidateTag("tutorials");revalidatePath("/");revalidatePath("/tutorials");revalidatePath("/admin");revalidatePath("/admin/tutorials");if(input.id)revalidatePath(`/tutorials/${values.slug}`);
  const requestedReturn=String(formData.get("return_to")||"");const returnTo=requestedReturn.startsWith("/admin/tutorials")?requestedReturn:"/admin/tutorials";redirect(`${returnTo}${returnTo.includes("?")?"&":"?"}saved=1`);
}

export async function deleteTutorial(id:string){const {db}=await requireUser();const {error}=await db.from("articles").delete().eq("id",id);if(error)throw new Error(error.message);revalidateTag("tutorials");revalidatePath("/");revalidatePath("/tutorials");revalidatePath("/admin/tutorials");}
