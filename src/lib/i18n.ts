export type Locale = "vi" | "en";

export const LOCALE_COOKIE = "ainext-locale";

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "vi";
}

export function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) || "/" : pathname;
}

export function localizePath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  return locale === "en" ? (base === "/" ? "/en" : `/en${base}`) : base;
}

export function languageAlternates(pathname: string) {
  const base = stripLocale(pathname);
  return { "vi-VN": base, en: localizePath(base, "en"), "x-default": base };
}
