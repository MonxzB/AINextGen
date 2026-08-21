import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import { AdminAnalyticsExclusion } from "@/components/admin/admin-analytics-exclusion";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
export const metadata:Metadata={robots:{index:false,follow:false,nocache:true}};
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className="min-h-screen bg-transparent"><AdminAnalyticsExclusion/><aside className="admin-sidebar fixed inset-y-0 z-40 hidden w-64 border-r p-5 text-white backdrop-blur-xl md:block"><Link href="/" className="inline-flex"><BrandLogo/></Link><p className="ml-[50px] mt-1 text-xs text-white/40">KNOWLEDGE CMS</p><Suspense fallback={<div className="mt-10 h-48"/>}><AdminNav/></Suspense><form action={logout} className="absolute bottom-6 left-5 right-5"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/10"><LogOut size={18}/>Đăng xuất</button></form></aside><div className="md:pl-64"><header className="admin-topbar sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl sm:px-5"><span className="truncate pr-2 font-bold">Quản trị AINextGen</span><div className="flex shrink-0 items-center gap-2"><ThemeToggle/><Link href="/" target="_blank" className="hidden text-sm font-bold text-brand-700 sm:block">Xem website →</Link></div></header><div className="border-b border-white/10 px-4 py-3 md:hidden"><Suspense fallback={<div className="h-9"/>}><AdminNav mobile/></Suspense></div><main className="p-4 sm:p-5 md:p-8">{children}</main></div></div>}
