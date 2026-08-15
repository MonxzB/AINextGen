"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Facebook, Flag, Linkedin, List } from "lucide-react";
import type { ArticleHeading } from "@/lib/article";
import { siteConfig } from "@/lib/site";

export function ArticleTools({headings,title,url}:{headings:ArticleHeading[];title:string;url:string}){
  const reportHref=`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Báo lỗi nội dung: ${title}`)}&body=${encodeURIComponent(`Chào AINextGen,\n\nTôi muốn báo một vấn đề trong bài viết:\n${url}\n\nĐoạn cần kiểm tra:\n\nMô tả vấn đề:\n\nNguồn đối chiếu (nếu có):\n`)}`;
  const [progress,setProgress]=useState(0);
  const [active,setActive]=useState(headings[0]?.id??"");
  const [copied,setCopied]=useState(false);
  useEffect(()=>{const update=()=>{const total=document.documentElement.scrollHeight-window.innerHeight;setProgress(total>0?Math.min(100,Math.max(0,(window.scrollY/total)*100)):0);};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};},[]);
  useEffect(()=>{const elements=headings.map(({id})=>document.getElementById(id)).filter(Boolean) as HTMLElement[];if(!elements.length)return;const observer=new IntersectionObserver((entries)=>{const visible=entries.filter((entry)=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(visible)setActive(visible.target.id);},{rootMargin:"-18% 0px -68% 0px"});elements.forEach((element)=>observer.observe(element));return()=>observer.disconnect();},[headings]);
  async function copy(){try{await navigator.clipboard.writeText(url);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
  return <>
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent" aria-hidden="true"><div className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-[width] duration-100" style={{width:`${progress}%`}}/></div>
    {headings.length>0&&<nav aria-label="Mục lục bài viết" className="card p-5"><p className="flex items-center gap-2 font-black"><List className="text-cyan-300" size={18}/> Mục lục</p><ol className="mt-4 space-y-2 border-l border-white/10">{headings.map((heading)=><li key={heading.id}><a href={`#${heading.id}`} className={`block border-l-2 py-1 pl-3 text-sm leading-5 transition ${active===heading.id?"-ml-px border-brand-500 font-bold text-brand-700":"border-transparent text-black/50 hover:text-ink"}`}>{heading.text}</a></li>)}</ol></nav>}
    <div className="card p-5"><p className="font-black">Chia sẻ bài viết</p><div className="mt-3 grid grid-cols-3 gap-2"><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên Facebook" className="btn-secondary !px-2"><Facebook size={17}/></a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên LinkedIn" className="btn-secondary !px-2"><Linkedin size={17}/></a><button type="button" onClick={copy} aria-label="Sao chép liên kết" className="btn-secondary !px-2">{copied?<Check size={17}/>:<Copy size={17}/>}</button></div>{copied&&<p className="mt-2 text-center text-xs font-bold text-emerald-400">Đã sao chép liên kết</p>}<a href={reportHref} className="btn-secondary mt-3 w-full gap-2 text-sm"><Flag size={16}/> Báo lỗi nội dung</a></div>
  </>;
}
