"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { estimateArticleTranslationCharacters, hasCompleteEnglishTranslation, translateArticleToEnglish, type ArticleTranslationSource } from "@/lib/article-translation";
import { isGoogleTranslationConfigured } from "@/lib/google-translate";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { assertTranslationBudget, recordTranslationUsage } from "@/lib/translation-usage";
import { slugify } from "@/lib/utils";
import type { ContentBlock, TranslationActionState, TutorialActionState } from "@/types/admin";

const schema=z.object({id:z.string().uuid().optional().or(z.literal("")),title:z.string().trim().min(5,"Tiêu đề cần ít nhất 5 ký tự").max(120),slug:z.string().trim().max(140).optional(),excerpt:z.string().trim().min(20,"Mô tả cần ít nhất 20 ký tự").max(320),content:z.string().trim().min(10,"Hãy thêm nội dung cho bài viết"),content_blocks:z.string().min(2),cover_url:z.string().url("URL ảnh không hợp lệ").or(z.literal("")),category:z.string().trim().min(2).max(60),difficulty:z.enum(["beginner","intermediate","advanced"]),duration_minutes:z.coerce.number().int().min(1).max(180),tools:z.string().max(300).optional(),seo_title:z.string().max(70).optional(),seo_description:z.string().max(180).optional(),author_name:z.string().trim().min(2,"Hãy nhập tên tác giả").max(100),author_bio:z.string().trim().max(300).optional(),source_references:z.string().max(4000).optional(),reviewed_at:z.string().optional(),title_en:z.string().trim().max(120).optional(),excerpt_en:z.string().trim().max(320).optional(),content_en:z.string().trim().max(120000).optional(),seo_title_en:z.string().trim().max(70).optional(),seo_description_en:z.string().trim().max(180).optional(),author_bio_en:z.string().trim().max(300).optional()});
const blockSchema=z.array(z.object({id:z.string().min(1),type:z.enum(["heading","paragraph","image","code","prompt","checklist","warning","quote"]),text:z.string().max(30000).optional(),url:z.string().url().or(z.literal("")).optional(),alt:z.string().max(240).optional(),caption:z.string().max(500).optional(),language:z.string().max(40).optional()})).min(1,"Bài viết cần ít nhất một khối nội dung").max(300);
const translationFields="id,title,slug,excerpt,content,content_blocks,seo_title,seo_description,author_bio,title_en,excerpt_en,content_en,content_blocks_en,seo_title_en,seo_description_en,author_bio_en,is_english_published,published_at,status";

type TranslationRow={
  id:string;title:string;slug:string;excerpt:string;content:string;content_blocks:ContentBlock[]|null;
  seo_title:string|null;seo_description:string|null;author_bio:string|null;title_en:string|null;
  excerpt_en:string|null;content_en:string|null;content_blocks_en:ContentBlock[]|null;seo_title_en:string|null;
  seo_description_en:string|null;author_bio_en:string|null;is_english_published:boolean;published_at:string|null;status:string;
};

function parseSources(value?:string){
  const sources=[] as {label:string;url:string}[];
  for(const line of (value||"").split("\n").map((item)=>item.trim()).filter(Boolean)){
    const separator=line.lastIndexOf("|");
    const label=(separator>=0?line.slice(0,separator):line).trim();
    const url=(separator>=0?line.slice(separator+1):line).trim();
    try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol))throw new Error();sources.push({label:label||parsed.hostname,url:parsed.toString()});}
    catch{return {sources:[],error:"Nguồn không hợp lệ: "+line+". Dùng định dạng Tên nguồn | https://..."};}
  }
  return {sources,error:null};
}

async function requireUser(){const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect("/login");return {db,user};}

function translationSource(row:{title:string;excerpt:string;content:string;content_blocks?:ContentBlock[]|null;seo_title?:string|null;seo_description?:string|null;author_bio?:string|null}):ArticleTranslationSource{
  return {title:row.title,excerpt:row.excerpt,content:row.content,contentBlocks:row.content_blocks??[],seoTitle:row.seo_title,seoDescription:row.seo_description,authorBio:row.author_bio};
}

function sourceChanged(previous:TranslationRow|null,next:ArticleTranslationSource){
  if(!previous)return true;
  return JSON.stringify(translationSource(previous))!==JSON.stringify(next);
}

function revalidateTutorials(slug?:string){
  revalidateTag("tutorials");
  for(const path of ["/","/tutorials","/en","/en/tutorials","/admin","/admin/tutorials"])revalidatePath(path);
  if(slug){revalidatePath("/tutorials/"+slug);revalidatePath("/en/tutorials/"+slug);}
}

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
  const requestedStatus=formData.get("publication_intent")??formData.get("intent");
  const status=requestedStatus==="published"?"published":"draft";
  const previousResult=input.id?await db.from("articles").select(translationFields).eq("id",input.id).single():null;
  const previous=(previousResult?.data??null) as unknown as TranslationRow|null;
  let publishedAt=previous?.published_at??null;
  if(status==="published"&&!publishedAt)publishedAt=new Date().toISOString();

  const source:ArticleTranslationSource={title:input.title,excerpt:input.excerpt,content:input.content,contentBlocks,seoTitle:input.seo_title||null,seoDescription:input.seo_description||null,authorBio:input.author_bio||null};
  let english={
    title_en:input.title_en||previous?.title_en||null,
    excerpt_en:input.excerpt_en||previous?.excerpt_en||null,
    content_en:input.content_en||previous?.content_en||null,
    content_blocks_en:previous?.content_blocks_en||null,
    seo_title_en:input.seo_title_en||previous?.seo_title_en||null,
    seo_description_en:input.seo_description_en||previous?.seo_description_en||null,
    author_bio_en:input.author_bio_en||previous?.author_bio_en||null,
  };
  let translationResult:"translated"|"unchanged"|"failed"|"not-configured"=isGoogleTranslationConfigured()?"unchanged":"not-configured";
  let translatedCharacterCount=0;
  if(isGoogleTranslationConfigured()&&(sourceChanged(previous,source)||!hasCompleteEnglishTranslation(english))){
    try{
      await assertTranslationBudget(db,estimateArticleTranslationCharacters(source));
      const automatic=await translateArticleToEnglish(source);
      translatedCharacterCount=automatic.characterCount;
      english={title_en:automatic.title_en,excerpt_en:automatic.excerpt_en,content_en:automatic.content_en,content_blocks_en:automatic.content_blocks_en,seo_title_en:automatic.seo_title_en,seo_description_en:automatic.seo_description_en,author_bio_en:automatic.author_bio_en};
      translationResult="translated";
    }catch(error){
      console.error("Automatic article translation failed",error instanceof Error?error.message:"Unknown translation error");
      translationResult="failed";
    }
  }
  const translationComplete=hasCompleteEnglishTranslation(english);
  const englishPublished=isGoogleTranslationConfigured()
    ? status==="published"&&translationComplete&&translationResult!=="failed"
    : formData.get("is_english_published")==="on";
  if(!isGoogleTranslationConfigured()&&englishPublished&&!translationComplete)return {error:"Bản tiếng Anh chưa đủ nội dung để xuất bản.",fieldErrors:{title_en:["Cần tiêu đề, mô tả và nội dung tiếng Anh đầy đủ."]}};

  const values={author_id:user.id,title:input.title,slug:input.slug||slugify(input.title),excerpt:input.excerpt,content:input.content,content_blocks:contentBlocks,cover_url:input.cover_url||null,category:input.category,difficulty:input.difficulty,duration_minutes:input.duration_minutes,tools:input.tools?.split(",").map((item)=>item.trim()).filter(Boolean)||[],is_featured:formData.get("is_featured")==="on",status,article_type:"blog",published_at:status==="published"?publishedAt:null,seo_title:input.seo_title||null,seo_description:input.seo_description||null,author_name:input.author_name,author_bio:input.author_bio||null,source_references:sourceResult.sources,reviewed_at:input.reviewed_at?new Date(input.reviewed_at+"T12:00:00").toISOString():null,...english,is_english_published:englishPublished,updated_at:new Date().toISOString()};
  const result=input.id?await db.from("articles").update(values).eq("id",input.id).select("id,status").single():await db.from("articles").insert(values).select("id,status").single();
  if(result.error)return {error:result.error.code==="23505"?"Slug đã tồn tại. Hãy chọn slug khác.":/title_en|content_blocks_en|is_english_published/i.test(result.error.message)?"Database chưa có trường song ngữ. Hãy chạy migration 020_bilingual_articles.sql.":result.error.message.includes("content_blocks")?"Database chưa có block editor. Hãy chạy migration 005_article_block_editor.sql.":/author_name|source_references|reviewed_at/i.test(result.error.message)?"Database chưa có trường tác giả và kiểm chứng. Hãy chạy migration 007_content_experience.sql.":result.error.message};
  if(result.data?.status!==status)return {error:"Database chưa lưu đúng trạng thái bài viết. Hãy tải lại trang và thử lại."};
  if(translatedCharacterCount>0){
    try{await recordTranslationUsage(db,result.data.id,translatedCharacterCount);}
    catch(error){console.error("Could not record translation usage",error instanceof Error?error.message:"Unknown usage error");}
  }

  revalidateTutorials(values.slug);
  const requestedReturn=String(formData.get("return_to")||"");
  const returnTo=requestedReturn.startsWith("/admin/tutorials")?requestedReturn:"/admin/tutorials";
  redirect(returnTo+(returnTo.includes("?")?"&":"?")+"saved=1&translation="+translationResult);
}

export async function translatePendingTutorials(_state:TranslationActionState,_formData?:FormData):Promise<TranslationActionState>{
  void _state;void _formData;
  if(!isGoogleTranslationConfigured())return {error:"Vercel chưa có GOOGLE_TRANSLATE_API_KEY."};
  const {db}=await requireUser();
  const {data,error}=await db.from("articles").select(translationFields).eq("status","published").eq("is_english_published",false).order("updated_at",{ascending:false}).limit(3);
  if(error)return {error:/title_en|content_blocks_en|is_english_published/i.test(error.message)?"Hãy chạy migration 020_bilingual_articles.sql trước.":error.message};
  let translated=0;
  let firstError="";
  for(const raw of data??[]){
    const row=raw as unknown as TranslationRow;
    try{
      await assertTranslationBudget(db,estimateArticleTranslationCharacters(translationSource(row)));
      const automatic=await translateArticleToEnglish(translationSource(row));
      const translatedValues={title_en:automatic.title_en,excerpt_en:automatic.excerpt_en,content_en:automatic.content_en,content_blocks_en:automatic.content_blocks_en,seo_title_en:automatic.seo_title_en,seo_description_en:automatic.seo_description_en,author_bio_en:automatic.author_bio_en,is_english_published:true,updated_at:new Date().toISOString()};
      const {error:updateError}=await db.from("articles").update(translatedValues).eq("id",row.id);
      if(updateError)throw new Error(updateError.message);
      await recordTranslationUsage(db,row.id,automatic.characterCount);
      translated+=1;
      revalidateTutorials(row.slug);
    }catch(itemError){
      firstError||=itemError instanceof Error?itemError.message:"Không thể dịch bài viết.";
    }
  }
  const {count}=await db.from("articles").select("id",{count:"exact",head:true}).eq("status","published").eq("is_english_published",false);
  revalidatePath("/admin/tutorials");
  return firstError&&translated===0?{error:firstError,remaining:count??0}:{success:translated?"Đã dịch tự động "+translated+" bài.":"Không còn bài đã đăng nào cần dịch.",translated,remaining:count??0,error:firstError||undefined};
}

export async function deleteTutorial(id:string){const {db}=await requireUser();const {error}=await db.from("articles").delete().eq("id",id);if(error)throw new Error(error.message);revalidateTutorials();}
