"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LazySearchAutocomplete } from "@/components/lazy-search-autocomplete";
import { KnowledgeNav } from "@/components/knowledge-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { localeFromPath, localizePath } from "@/lib/i18n";

export function SiteHeader(){
  const pathname=usePathname();
  const locale=localeFromPath(pathname);
  return <header className="site-header sticky top-0 z-40 border-b backdrop-blur-2xl"><div className="container-page flex h-16 items-center gap-2 sm:gap-3"><Link href={localizePath("/",locale)} className="shrink-0"><BrandLogo/></Link><Suspense fallback={<div className="ml-5 hidden h-5 w-72 lg:block"/>}><KnowledgeNav/></Suspense><LazySearchAutocomplete/><Suspense fallback={<div className="h-9 w-24"/>}><LanguageSwitcher/></Suspense><ThemeToggle/><Link href={localizePath("/tutorials",locale)} aria-label={locale==="vi"?"Thư viện tutorial":"Tutorial library"} className="header-icon-link hidden rounded-xl border p-2 hover:bg-white/5 sm:block"><BookOpen size={20}/></Link></div><div className="lg:hidden"><Suspense fallback={<div className="h-9 border-t"/>}><KnowledgeNav mobile/></Suspense></div></header>;
}
