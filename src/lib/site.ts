const defaultSiteUrl=process.env.NODE_ENV==="production"?"https://ainextgen.io.vn":"http://localhost:3000";
export const siteConfig={name:"AINextGen",description:"Tutorial, workflow, prompt và kiến thức AI thực chiến dành cho người Việt.",url:(process.env.NEXT_PUBLIC_SITE_URL||defaultSiteUrl).replace(/\/$/,""),locale:"vi_VN",author:"Đội ngũ AINextGen",email:process.env.NEXT_PUBLIC_CONTACT_EMAIL||"hello@ainextgen.io.vn"};
export function absoluteUrl(path="/"){return `${siteConfig.url}${path.startsWith("/")?path:`/${path}`}`;}
