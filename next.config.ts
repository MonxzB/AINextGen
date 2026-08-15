import type { NextConfig } from "next";
const isDevelopment=process.env.NODE_ENV==="development";
const contentSecurityPolicy=[
 "default-src 'self'",
 `script-src 'self' 'unsafe-inline'${isDevelopment?" 'unsafe-eval'":""}`,
 "style-src 'self' 'unsafe-inline'",
 "img-src 'self' data: blob: https:",
 "font-src 'self' data:",
 "connect-src 'self' https://*.supabase.co",
 "frame-ancestors 'none'",
 "base-uri 'self'",
 "form-action 'self' mailto:",
 "object-src 'none'",
 "upgrade-insecure-requests",
].join("; ");
const securityHeaders=[
 {key:"Content-Security-Policy",value:contentSecurityPolicy},
 {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
 {key:"X-Content-Type-Options",value:"nosniff"},
 {key:"X-Frame-Options",value:"DENY"},
 {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), browsing-topics=()"},
 ...(!isDevelopment?[{key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains; preload"}]:[]),
];
const nextConfig:NextConfig={
 distDir:isDevelopment?".next-dev":".next",
 poweredByHeader:false,
 images:{remotePatterns:[{protocol:"https",hostname:"**"}]},
 webpack(config,{isServer}){
  // The parser bundled with Next must stay external. Bundling it a second time
  // breaks its HTML entity decoder in the MaxYT import API.
  if(isServer)config.externals.push({"next/dist/compiled/node-html-parser":"commonjs next/dist/compiled/node-html-parser"});
  return config;
 },
 async redirects(){return [
  {source:"/products",destination:"/tutorials",permanent:true},
  {source:"/products/:path*",destination:"/tutorials",permanent:true},
  {source:"/admin/products",destination:"/admin/tutorials",permanent:false},
  {source:"/admin/products/:path*",destination:"/admin/tutorials",permanent:false},
  {source:"/admin/categories",destination:"/admin/tutorials",permanent:false},
  {source:"/admin/brands",destination:"/admin/tutorials",permanent:false},
 ]},
 async headers(){return [{source:"/:path*",headers:securityHeaders}]},
};
export default nextConfig;
