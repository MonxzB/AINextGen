"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { localeFromPath, localizePath } from "@/lib/i18n";

const links=[{href:"/tutorials",vi:"Tutorial",en:"Tutorials",category:""},{href:"/tutorials?category=Prompting",vi:"Prompt",en:"Prompting",category:"Prompting"},{href:"/tutorials?category=Automation",vi:"Automation",en:"Automation",category:"Automation"},{href:"/tutorials?category=L%E1%BB%99+tr%C3%ACnh",vi:"Lộ trình",en:"Roadmap",category:"Lộ trình"}];

export function KnowledgeNav({mobile=false}:{mobile?:boolean}){
  const path=usePathname();
  const locale=localeFromPath(path);
  const tutorialPath=localizePath("/tutorials",locale);
  const searchParams=useSearchParams();
  const [category,setCategory]=useState(searchParams.get("category")??"");
  useEffect(()=>{const sync=()=>setCategory(new URLSearchParams(window.location.search).get("category")??"");window.addEventListener("popstate",sync);window.addEventListener("knowledge-url-change",sync);return()=>{window.removeEventListener("popstate",sync);window.removeEventListener("knowledge-url-change",sync);};},[]);
  return <nav aria-label={locale==="vi"?"Kho kiến thức AI":"AI knowledge hub"} className={mobile?"container-page flex gap-5 overflow-x-auto border-t py-2 text-xs font-bold":"ml-5 hidden gap-6 text-sm font-medium lg:flex"}>{links.map((item)=>{const targetHref=`${tutorialPath}${item.href.includes("?")?item.href.slice(item.href.indexOf("?")):""}`;const active=path===tutorialPath&&category===item.category;return <Link key={item.href} href={targetHref} aria-current={active?"page":undefined} onClick={(event)=>{if(path===tutorialPath){event.preventDefault();const target=new URL(targetHref,window.location.origin);window.history.pushState({},"",`${target.pathname}${target.search}`);setCategory(item.category);window.dispatchEvent(new CustomEvent("knowledge-content-filter",{detail:{category:item.category}}));}}} className={`shrink-0 transition hover:text-brand-700 ${active?"text-brand-700":""}`}>{item[locale]}</Link>})}</nav>;
}
