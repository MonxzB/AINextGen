import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, localizePath, type Locale } from "@/lib/i18n";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const PUBLIC_FILE=/\.[a-z0-9]+$/i;
const BOT_USER_AGENT=/(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|twitterbot|mediapartners-google|adsbot-google|googleother)/i;

function rememberLocale(response:NextResponse,locale:Locale){
  response.cookies.set(LOCALE_COOKIE,locale,{path:"/",maxAge:60*60*24*365,sameSite:"lax",secure:process.env.NODE_ENV==="production"});
  return response;
}

function publicLocale(request:NextRequest):{locale:Locale;redirect?:NextResponse}{
  const path=request.nextUrl.pathname;
  const isEnglish=path==="/en"||path.startsWith("/en/");
  const chosen=request.cookies.get(LOCALE_COOKIE)?.value;
  const explicit=chosen==="vi"||chosen==="en"?chosen:null;
  const ignored=path.startsWith("/admin")||path.startsWith("/preview")||path.startsWith("/login")||path.startsWith("/api")||path.startsWith("/go/")||path.startsWith("/_next")||PUBLIC_FILE.test(path);
  if(ignored||BOT_USER_AGENT.test(request.headers.get("user-agent")||""))return {locale:isEnglish?"en":"vi"};
  if(isEnglish)return {locale:"en"};
  // A non-prefixed content URL is an explicit Vietnamese choice. Only the
  // neutral homepage may use geo/cookie detection; otherwise an old EN cookie
  // could hijack links such as /tutorials/[slug] while browsing the VN site.
  if(path!=="/")return {locale:"vi"};
  const country=request.headers.get("x-vercel-ip-country")?.toUpperCase();
  const locale:Locale=explicit??(country&&country!=="VN"?"en":"vi");
  if(locale==="en"){
    const target=request.nextUrl.clone();
    target.pathname=localizePath(path,"en");
    return {locale,redirect:rememberLocale(NextResponse.redirect(target,307),locale)};
  }
  return {locale};
}

export async function middleware(request:NextRequest){
  const detected=publicLocale(request);
  if(detected.redirect)return detected.redirect;

  let response=NextResponse.next({request});
  const path=request.nextUrl.pathname;
  const authRoute=path.startsWith("/admin")||path.startsWith("/preview")||path==="/login";
  if(!authRoute)return rememberLocale(response,detected.locale);

  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key||url.includes("your-project"))return rememberLocale(response,detected.locale);
  const supabase=createServerClient(url,key,{cookies:{
    getAll:()=>request.cookies.getAll(),
    setAll(items:CookieToSet[]){
      items.forEach(({name,value})=>request.cookies.set(name,value));
      response=NextResponse.next({request});
      items.forEach(({name,value,options})=>response.cookies.set(name,value,options));
    }
  }});
  const {data:{user}}=await supabase.auth.getUser();
  const protectedRoute=path.startsWith("/admin")||path.startsWith("/preview");
  if(protectedRoute&&!user){
    const redirect=request.nextUrl.clone();redirect.pathname="/login";redirect.searchParams.set("next",path);
    return rememberLocale(NextResponse.redirect(redirect),detected.locale);
  }
  if(path==="/login"&&user){
    const redirect=request.nextUrl.clone();redirect.pathname="/admin";
    return rememberLocale(NextResponse.redirect(redirect),detected.locale);
  }
  return rememberLocale(response,detected.locale);
}

export const config={matcher:["/((?!api|_next/static|_next/image|favicon.ico|icon|opengraph-image|manifest.webmanifest|robots.txt|sitemap.xml|rss.xml).*)"]};
