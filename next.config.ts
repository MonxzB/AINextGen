import type { NextConfig } from "next";
const isDevelopment=process.env.NODE_ENV==="development";
const nextConfig:NextConfig={
 distDir:isDevelopment?".next-dev":".next",
 images:{remotePatterns:[{protocol:"https",hostname:"**"}]},
 async redirects(){return [
  {source:"/products",destination:"/tutorials",permanent:true},
  {source:"/products/:path*",destination:"/tutorials",permanent:true},
  {source:"/admin/products",destination:"/admin/tutorials",permanent:false},
  {source:"/admin/products/:path*",destination:"/admin/tutorials",permanent:false},
  {source:"/admin/categories",destination:"/admin/tutorials",permanent:false},
  {source:"/admin/brands",destination:"/admin/tutorials",permanent:false},
 ]}
};
export default nextConfig;
