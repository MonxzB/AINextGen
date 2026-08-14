"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const links=[{href:"/tutorials",label:"Tutorial",category:""},{href:"/tutorials?category=Prompting",label:"Prompt",category:"Prompting"},{href:"/tutorials?category=Automation",label:"Automation",category:"Automation"},{href:"/tutorials?category=L%E1%BB%99+tr%C3%ACnh",label:"Lộ trình",category:"Lộ trình"}];

export function KnowledgeNav({mobile=false}:{mobile?:boolean}){
  const path=usePathname();
  const searchParams=useSearchParams();
  const [category,setCategory]=useState(searchParams.get("category")??"");
  useEffect(()=>{const sync=()=>setCategory(new URLSearchParams(window.location.search).get("category")??"");window.addEventListener("popstate",sync);window.addEventListener("knowledge-url-change",sync);return()=>{window.removeEventListener("popstate",sync);window.removeEventListener("knowledge-url-change",sync);};},[]);
  return <nav aria-label="Kho kiến thức AI" className={mobile?"container-page flex gap-5 overflow-x-auto border-t py-2 text-xs font-bold":"ml-5 hidden gap-6 text-sm font-medium lg:flex"}>{links.map((item)=>{const active=path==="/tutorials"&&category===item.category;return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} onClick={(event)=>{if(path==="/tutorials"){event.preventDefault();const target=new URL(item.href,window.location.origin);window.history.pushState({},"",`${target.pathname}${target.search}`);setCategory(item.category);window.dispatchEvent(new CustomEvent("knowledge-content-filter",{detail:{category:item.category}}));}}} className={`shrink-0 transition hover:text-brand-700 ${active?"text-brand-700":""}`}>{item.label}</Link>})}</nav>;
}
