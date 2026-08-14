"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BookOpen, Bot, CloudDownload, LayoutDashboard, Map, WandSparkles } from "lucide-react";

const links=[
 {href:"/admin",label:"Tổng quan",icon:LayoutDashboard,exact:true},
 {href:"/admin/tutorials",label:"Tất cả nội dung",icon:BookOpen,category:""},
 {href:"/admin/tutorials?category=Prompting",label:"Prompt",icon:WandSparkles,category:"Prompting"},
 {href:"/admin/tutorials?category=Automation",label:"Automation",icon:Bot,category:"Automation"},
 {href:"/admin/tutorials?category=L%E1%BB%99+tr%C3%ACnh",label:"Lộ trình",icon:Map,category:"Lộ trình"},
 {href:"/admin/import",label:"Nhập từ nguồn",icon:CloudDownload,exact:true},
];

export function AdminNav({mobile=false}:{mobile?:boolean}) {
  const path=usePathname();
  const searchParams=useSearchParams();
  const [queryCategory,setQueryCategory]=useState(searchParams.get("category")??"");

  useEffect(() => {
    const sync=()=>setQueryCategory(new URLSearchParams(window.location.search).get("category")??"");
    window.addEventListener("popstate",sync);
    window.addEventListener("admin-url-change",sync);
    return()=>{window.removeEventListener("popstate",sync);window.removeEventListener("admin-url-change",sync);};
  },[]);

  return <nav aria-label="Quản trị nội dung" className={mobile?"flex gap-2 overflow-x-auto":"mt-10 space-y-2"}>{links.map(({href,label,icon:Icon,exact,category})=>{
    const active=exact?path===href:path.startsWith("/admin/tutorials")&&queryCategory===category;
    return <Link key={href} href={href} onClick={(event)=>{if(path==="/admin/tutorials"&&category!==undefined){event.preventDefault();const target=new URL(href,window.location.origin);window.history.pushState({},"",`${target.pathname}${target.search}`);setQueryCategory(category);window.dispatchEvent(new CustomEvent("admin-content-filter",{detail:{category}}));}}} aria-current={active?"page":undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active?"bg-brand-500/20 text-white ring-1 ring-brand-500/30":mobile?"border border-white/10 bg-white/5":"text-white/70 hover:bg-white/10 hover:text-white"}`}><Icon size={19}/>{label}</Link>;
  })}</nav>;
}
