import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { TutorialCard } from "@/components/tutorial-card";
import { getEnglishTutorialSummaries } from "@/lib/tutorial-data";
import { getTutorialViewCounts } from "@/lib/view-counts";
import { absoluteUrl } from "@/lib/site";

export const revalidate=300;
export const metadata:Metadata={title:"Practical AI tutorial library",description:"Step-by-step AI tutorials, reusable prompts, automation workflows, and AI fundamentals.",alternates:{canonical:"/en/tutorials",languages:{"vi-VN":"/tutorials",en:"/en/tutorials","x-default":"/tutorials"}},openGraph:{locale:"en_US",url:"/en/tutorials",title:"Practical AI tutorial library | AINextGen",description:"Learn AI step by step and apply it to real work."}};

export default async function EnglishTutorials(){
  const [summaries,viewCounts]=await Promise.all([getEnglishTutorialSummaries(),getTutorialViewCounts()]);
  const tutorials=summaries.map(t=>({...t,view_count:viewCounts[t.slug]??0}));
  return <div className="container-page py-12"><JsonLd data={{"@context":"https://schema.org","@type":"ItemList",name:"AINextGen English tutorial library",numberOfItems:tutorials.length,itemListElement:tutorials.map((tutorial,index)=>({"@type":"ListItem",position:index+1,name:tutorial.title,url:absoluteUrl(`/en/tutorials/${tutorial.slug}`)}))}}/><p className="font-bold text-brand-700">Knowledge hub</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Practical AI tutorials</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-black/55">Step-by-step guides, reusable prompts, and reliable workflows for real work.</p>{tutorials.length?<div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{tutorials.map(t=><TutorialCard key={t.id} tutorial={t} locale="en"/>)}</div>:<div className="card mt-9 p-10 text-center"><h2 className="text-xl font-black">No English tutorials have been published yet.</h2><p className="mt-2 text-black/50">Add an English translation in Admin, then enable English publishing for that article.</p></div>}</div>;
}
