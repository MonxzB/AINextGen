import Image from "next/image";
import { CheckCircle2, MessageSquareQuote, Quote, TriangleAlert } from "lucide-react";
import { CopyBlockButton } from "@/components/copy-block-button";
import { articleHeadingId } from "@/lib/article";
import type { ContentBlock } from "@/types/admin";

function LegacyContent({value}:{value:string}){
  return <div className="space-y-4 text-[1.05rem] leading-8 text-black/60">{value.split("\n").map((line)=>line.trim()).filter(Boolean).map((line,index)=>line.startsWith("## ")?<h2 id={articleHeadingId(line.slice(3),index)} key={index} className="!mt-10 scroll-mt-24 text-2xl font-black text-ink">{line.slice(3)}</h2>:/^\d+\. /.test(line)?<p key={index} className="rounded-xl border border-white/10 bg-white/5 p-4 text-ink">{line}</p>:line.startsWith("- ")?<p key={index} className="flex gap-2"><CheckCircle2 className="mt-1 shrink-0 text-cyan-300" size={18}/>{line.slice(2)}</p>:<p key={index}>{line.replaceAll("**","")}</p>)}</div>;
}

export function ArticleContent({blocks,legacyContent,intro}:{blocks?:ContentBlock[]|null;legacyContent:string;intro?:string}){
  const normalizedIntro=intro?.replace(/\s+/g," ").trim().toLocaleLowerCase("vi");
  const introBlock=intro?<p className="mb-9 border-l-4 border-brand-500 pl-5 text-xl font-medium leading-9 text-ink sm:pl-6">{intro}</p>:null;
  if(!blocks?.length)return <>{introBlock}<LegacyContent value={legacyContent}/></>;
  return <div className="space-y-6 text-[1.05rem] leading-8 text-black/60">{introBlock}{blocks.map((block,index)=>{
    if(block.type==="paragraph"&&normalizedIntro){
      const normalizedText=block.text?.replace(/\s+/g," ").trim().toLocaleLowerCase("vi");
      if(normalizedText&&normalizedText.length>=40&&normalizedIntro.includes(normalizedText))return null;
    }
    if(block.type==="heading")return <h2 id={articleHeadingId(block.text??"",index)} key={block.id} className="!mt-12 scroll-mt-24 text-2xl font-black text-ink">{block.text}</h2>;
    if(block.type==="image"&&block.url)return <figure key={block.id} className="!my-9"><div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5"><Image src={block.url} alt={block.alt||block.caption||"Hình minh họa bài viết"} fill loading="lazy" sizes="(max-width: 1024px) 100vw, 760px" className="object-contain"/></div>{block.caption&&<figcaption className="mt-3 text-center text-sm text-black/45">{block.caption}</figcaption>}</figure>;
    if(block.type==="code")return <section key={block.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#070a12] text-white"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5"><span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">{block.language||"code"}</span><CopyBlockButton text={block.text??""} label="Sao chép code"/></div><pre className="overflow-x-auto p-5 text-sm leading-7"><code>{block.text}</code></pre></section>;
    if(block.type==="prompt")return <section key={block.id} className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5 text-ink"><div className="mb-4 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-brand-700"><MessageSquareQuote size={18}/>Prompt mẫu</p><CopyBlockButton text={block.text??""} label="Sao chép prompt"/></div><pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-ink">{block.text}</pre></section>;
    if(block.type==="checklist")return <section key={block.id} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[.07] p-5"><p className="mb-3 font-black text-ink">Checklist thực hành</p><ul className="space-y-2">{(block.text??"").split("\n").map((item)=>item.replace(/^[-*]\s*/,"").trim()).filter(Boolean).map((item,itemIndex)=><li key={itemIndex} className="flex gap-2"><CheckCircle2 className="mt-1 shrink-0 text-emerald-400" size={18}/><span>{item}</span></li>)}</ul></section>;
    if(block.type==="warning")return <aside key={block.id} className="flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-5 text-ink"><TriangleAlert className="mt-1 shrink-0 text-amber-400" size={21}/><div><p className="font-black">Lưu ý quan trọng</p><p className="mt-1 whitespace-pre-line text-black/60">{block.text}</p></div></aside>;
    if(block.type==="quote")return <blockquote key={block.id} className="relative rounded-2xl border-l-4 border-brand-500 bg-white/5 px-6 py-5 text-xl font-semibold italic leading-8 text-ink"><Quote className="mb-3 text-brand-700" size={24}/><p>{block.text}</p>{block.caption&&<cite className="mt-3 block text-sm font-normal not-italic text-black/45">— {block.caption}</cite>}</blockquote>;
    return <p key={block.id} className="whitespace-pre-line">{block.text}</p>;
  })}</div>;
}
