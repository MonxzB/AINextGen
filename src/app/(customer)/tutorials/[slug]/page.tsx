import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorialArticle } from "@/components/tutorial-article";
import { getTutorial, getTutorialSummaries } from "@/lib/tutorial-data";
import { siteConfig } from "@/lib/site";

export const revalidate=300;
export async function generateStaticParams(){const tutorials=await getTutorialSummaries();return tutorials.map((tutorial)=>({slug:tutorial.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const tutorial=await getTutorial((await params).slug);
  if(!tutorial)return {title:"Không tìm thấy tutorial",robots:{index:false,follow:false}};
  const path=`/tutorials/${tutorial.slug}`;
  const title=tutorial.seo_title||tutorial.title;
  const description=tutorial.seo_description||tutorial.excerpt;
  const image=tutorial.cover_url||tutorial.content_blocks?.find((block)=>block.type==="image")?.url;
  return {title,description,keywords:[tutorial.category,...tutorial.tools,"tutorial AI","hướng dẫn AI"],alternates:{canonical:path},authors:[{name:tutorial.author_name||siteConfig.author}],openGraph:{type:"article",url:path,title,description,publishedTime:tutorial.published_at,modifiedTime:tutorial.updated_at||tutorial.published_at,authors:[tutorial.author_name||siteConfig.author],section:tutorial.category,tags:tutorial.tools,images:image?[{url:image,alt:tutorial.title}]:undefined},twitter:{card:"summary_large_image",title,description,images:image?[image]:undefined}};
}

export default async function TutorialDetail({params}:{params:Promise<{slug:string}>}){
  const tutorial=await getTutorial((await params).slug);
  if(!tutorial)notFound();
  const all=await getTutorialSummaries();
  const related=all.filter((item)=>item.id!==tutorial.id&&(item.category===tutorial.category||item.tools.some((tool)=>tutorial.tools.includes(tool)))).slice(0,3);
  return <TutorialArticle tutorial={tutorial} related={related}/>;
}
