"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";

function SearchFallback(){return <form action="/search" role="search" className="ml-auto flex min-w-0 max-w-sm flex-1"><label className="relative w-full"><span className="sr-only">Tìm kiếm kiến thức AI</span><Search className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white/45" size={18}/><input name="q" type="search" className="input h-11 !pl-11" placeholder="Tìm kiến thức AI..." autoComplete="off"/></label></form>}

const DeferredSearch=dynamic(()=>import("@/components/search-autocomplete").then((module)=>module.SearchAutocomplete),{ssr:false,loading:SearchFallback});
export function LazySearchAutocomplete(){return <DeferredSearch/>;}
