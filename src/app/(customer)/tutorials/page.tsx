import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { TutorialBrowser } from "@/components/tutorial-browser";
import { absoluteUrl } from "@/lib/site";
import { getTutorialSummaries } from "@/lib/tutorial-data";
import { getTutorialViewCounts } from "@/lib/view-counts";

export const revalidate=300;
export const metadata:Metadata={title:"Thư viện tutorial AI thực chiến",description:"Hướng dẫn AI từng bước: prompt engineering, automation, ChatGPT, sáng tạo nội dung và kiến thức AI nền tảng.",alternates:{canonical:"/tutorials"},openGraph:{type:"website",url:"/tutorials",title:"Thư viện tutorial AI thực chiến | AINextGen",description:"Hướng dẫn AI từng bước, prompt thực chiến và workflow có thể áp dụng ngay."}};

function BrowserFallback(){return <div className="animate-pulse"><div className="h-5 w-32 rounded bg-white/10"/><div className="mt-4 h-12 w-96 max-w-full rounded bg-white/10"/><div className="mt-4 h-6 w-[34rem] max-w-full rounded bg-white/10"/><div className="mt-9 h-11 w-full rounded bg-white/10"/></div>}
export default async function Tutorials(){
  const [summaries,viewCounts]=await Promise.all([getTutorialSummaries(),getTutorialViewCounts()]);
  const tutorials=summaries.map(t=>({...t,view_count:viewCounts[t.slug]??0}));
  const listSchema={"@context":"https://schema.org","@type":"ItemList",name:"Kho kiến thức AI | AINextGen",numberOfItems:tutorials.length,itemListElement:tutorials.map((tutorial,index)=>({"@type":"ListItem",position:index+1,name:tutorial.title,url:absoluteUrl(`/tutorials/${tutorial.slug}`)}))};
  return <div className="container-page py-12"><JsonLd data={listSchema}/><Suspense fallback={<BrowserFallback/>}><TutorialBrowser tutorials={tutorials} initialFilters={{q:"",category:"all",level:"all"}}/></Suspense></div>;
}
