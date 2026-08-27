"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { localeFromPath } from "@/lib/i18n";

function SearchFallback({locale="vi"}:{locale?:"vi"|"en"}){const en=locale==="en";return <form action={en?"/en/search":"/search"} role="search" className="ml-auto flex min-w-0 max-w-sm flex-1"><label className="relative w-full"><span className="sr-only">{en?"Search AI knowledge":"Tìm kiếm kiến thức AI"}</span><Search className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white/45" size={18}/><input name="q" type="search" className="input h-11 !pl-11" placeholder={en?"Search AI knowledge...":"Tìm kiến thức AI..."} autoComplete="off"/></label></form>}

const DeferredSearch=dynamic(()=>import("@/components/search-autocomplete").then((module)=>module.SearchAutocomplete),{ssr:false,loading:()=><SearchFallback/>});
export function LazySearchAutocomplete(){const locale=localeFromPath(usePathname());return locale==="en"?<SearchFallback locale="en"/>:<DeferredSearch/>;}
