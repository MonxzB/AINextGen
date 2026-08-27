"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE, localeFromPath, localizePath, type Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = localeFromPath(pathname);

  function hrefFor(nextLocale: Locale) {
    const path = localizePath(pathname, nextLocale);
    const query = searchParams.toString();
    return query ? `${path}?${query}` : path;
  }

  function remember(nextLocale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
  }

  return <div className="language-switcher flex shrink-0 items-center rounded-xl border p-1 text-xs font-black" aria-label={locale === "vi" ? "Chọn ngôn ngữ" : "Choose language"}>
    <Languages aria-hidden="true" className="mx-1 text-black/45" size={16}/>
    <Link href={hrefFor("vi")} hrefLang="vi" onClick={() => remember("vi")} aria-current={locale === "vi" ? "page" : undefined} className={`rounded-lg px-2 py-1.5 transition ${locale === "vi" ? "bg-brand-600 text-white" : "hover:bg-white/5"}`}>VN</Link>
    <Link href={hrefFor("en")} hrefLang="en" onClick={() => remember("en")} aria-current={locale === "en" ? "page" : undefined} className={`rounded-lg px-2 py-1.5 transition ${locale === "en" ? "bg-brand-600 text-white" : "hover:bg-white/5"}`}>EN</Link>
  </div>;
}
