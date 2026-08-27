import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { estimateArticleTranslationCharacters, translateArticleToEnglish, type ArticleTranslationSource } from "@/lib/article-translation";
import { isGoogleTranslationConfigured } from "@/lib/google-translate";
import { getAdminClient } from "@/lib/supabase/admin";
import { assertTranslationBudget, recordTranslationUsage } from "@/lib/translation-usage";
import type { ContentBlock } from "@/types/admin";

export const dynamic="force-dynamic";
export const maxDuration=300;

const fields="id,slug,title,excerpt,content,content_blocks,seo_title,seo_description,author_bio";

type PendingRow={
  id:string;slug:string;title:string;excerpt:string;content:string;content_blocks:ContentBlock[]|null;
  seo_title:string|null;seo_description:string|null;author_bio:string|null;
};

function sourceFromRow(row:PendingRow):ArticleTranslationSource{
  return {title:row.title,excerpt:row.excerpt,content:row.content,contentBlocks:row.content_blocks??[],seoTitle:row.seo_title,seoDescription:row.seo_description,authorBio:row.author_bio};
}

export async function GET(request:Request){
  const secret=process.env.CRON_SECRET;
  if(!secret||request.headers.get("authorization")!=="Bearer "+secret)return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!isGoogleTranslationConfigured())return NextResponse.json({error:"Google Translation is not configured"},{status:503});
  const db=getAdminClient();
  const {data,error}=await db.from("articles").select(fields).eq("status","published").eq("is_english_published",false).order("updated_at",{ascending:false}).limit(3);
  if(error)return NextResponse.json({error:error.message},{status:500});
  let translated=0;
  const failures:string[]=[];
  for(const raw of data??[]){
    const row=raw as unknown as PendingRow;
    try{
      const source=sourceFromRow(row);
      await assertTranslationBudget(db,estimateArticleTranslationCharacters(source));
      const automatic=await translateArticleToEnglish(source);
      const values={title_en:automatic.title_en,excerpt_en:automatic.excerpt_en,content_en:automatic.content_en,content_blocks_en:automatic.content_blocks_en,seo_title_en:automatic.seo_title_en,seo_description_en:automatic.seo_description_en,author_bio_en:automatic.author_bio_en,is_english_published:true,updated_at:new Date().toISOString()};
      const {error:updateError}=await db.from("articles").update(values).eq("id",row.id);
      if(updateError)throw new Error(updateError.message);
      await recordTranslationUsage(db,row.id,automatic.characterCount);
      translated+=1;
    }catch(itemError){
      failures.push(row.slug+": "+(itemError instanceof Error?itemError.message:"Translation failed"));
    }
  }
  if(translated>0){
    revalidateTag("tutorials");
    for(const path of ["/","/tutorials","/en","/en/tutorials","/sitemap.xml"])revalidatePath(path);
  }
  return NextResponse.json({translated,failed:failures.length,failures});
}
