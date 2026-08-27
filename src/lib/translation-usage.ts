import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_MONTHLY_LIMIT=450_000;

function monthRange(now=new Date()){
  const start=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1));
  const end=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+1,1));
  return {start:start.toISOString(),end:end.toISOString()};
}

export function getTranslationMonthlyLimit(){
  const configured=Number(process.env.GOOGLE_TRANSLATE_MONTHLY_LIMIT||DEFAULT_MONTHLY_LIMIT);
  return Number.isFinite(configured)&&configured>0?Math.min(Math.floor(configured),500_000):DEFAULT_MONTHLY_LIMIT;
}

export async function assertTranslationBudget(db:SupabaseClient,plannedCharacters:number){
  const {start,end}=monthRange();
  const {data,error}=await db.from("article_translation_usage").select("character_count").gte("created_at",start).lt("created_at",end);
  if(error){
    if(/article_translation_usage|relation .* does not exist/i.test(error.message))throw new Error("Hãy chạy migration 021_automatic_article_translation.sql trước.");
    throw new Error("Không thể kiểm tra quota dịch: "+error.message);
  }
  const used=(data??[]).reduce((total,row)=>total+Number(row.character_count||0),0);
  const limit=getTranslationMonthlyLimit();
  if(used+plannedCharacters>limit)throw new Error("Đã gần hết quota dịch tháng ("+used.toLocaleString("vi-VN")+"/"+limit.toLocaleString("vi-VN")+" ký tự).");
  return {used,limit};
}

export async function recordTranslationUsage(db:SupabaseClient,articleId:string,characterCount:number){
  const {error}=await db.from("article_translation_usage").insert({article_id:articleId,character_count:characterCount});
  if(error)throw new Error("Không thể ghi nhận quota dịch: "+error.message);
}
