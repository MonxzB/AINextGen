import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnglishTutorialArticle } from "@/components/english-tutorial-article";
import { getEnglishTutorial, getEnglishTutorialSummaries, getTutorial } from "@/lib/tutorial-data";
import { siteConfig } from "@/lib/site";

export const revalidate=300;
export async function generateStaticParams(){const tutorials=await getEnglishTutorialSummaries();return tutorials.map(tutorial=>({slug:tutorial.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const tutorial=await getEnglishTutorial((await params).slug);
  if(!tutorial)return {title:"Tutorial not found",robots:{index:false,follow:false}};
  const path=`/en/tutorials/${tutorial.slug}`;const viPath=`/tutorials/${tutorial.slug}`;const title=tutorial.seo_title||tutorial.title;const description=tutorial.seo_description||tutorial.excerpt;const image=tutorial.cover_url||tutorial.content_blocks?.find(block=>block.type==="image")?.url;
  return {title,description,alternates:{canonical:path,languages:{"vi-VN":viPath,en:path,"x-default":viPath}},authors:[{name:tutorial.author_name||siteConfig.author}],openGraph:{type:"article",locale:"en_US",url:path,title,description,publishedTime:tutorial.published_at,modifiedTime:tutorial.updated_at||tutorial.published_at,images:image?[{url:image,alt:tutorial.title}]:undefined},twitter:{card:"summary_large_image",title,description,images:image?[image]:undefined}};
}
export default async function EnglishTutorialDetail({params}:{params:Promise<{slug:string}>}){
  const slug=(await params).slug;const tutorial=await getEnglishTutorial(slug);
  if(!tutorial){const vietnamese=await getTutorial(slug);if(!vietnamese)notFound();return <div className="container-page grid min-h-[55vh] place-items-center py-16 text-center"><div className="card max-w-2xl p-8 sm:p-12"><p className="font-bold text-brand-700">Translation in progress</p><h1 className="mt-3 text-3xl font-black">{vietnamese.title}</h1><p className="mt-4 leading-7 text-black/55">This tutorial is currently available in Vietnamese. The English translation has not been published yet.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href={`/tutorials/${slug}`} hrefLang="vi" className="btn-primary">Read in Vietnamese</Link><Link href="/en/tutorials" className="btn-secondary">English library</Link></div></div></div>;}
  const all=await getEnglishTutorialSummaries();const related=all.filter(item=>item.id!==tutorial.id&&(item.category===tutorial.category||item.tools.some(tool=>tutorial.tools.includes(tool)))).slice(0,3);
  return <EnglishTutorialArticle tutorial={tutorial} related={related}/>;
}
