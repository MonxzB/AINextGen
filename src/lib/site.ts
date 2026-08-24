const siteUrl=process.env.NODE_ENV==="production"?"https://ainextgen.io.vn":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
const contactEmail=(process.env.NEXT_PUBLIC_CONTACT_EMAIL||"hello@ainextgen.io.vn").replace("@ainextgen.vn","@ainextgen.io.vn");
export const siteConfig={name:"AINextGen",alternateName:"AI Next Gen Việt Nam",seoTitle:"AINextGen - AI Next Gen Việt Nam | Hướng dẫn AI",description:"AINextGen là nền tảng AI Next Gen Việt Nam, chia sẻ tutorial, workflow, prompt và kiến thức AI thực chiến dành cho người Việt.",url:siteUrl.replace(/\/$/,""),locale:"vi_VN",author:"Đội ngũ AINextGen",email:contactEmail};
export function absoluteUrl(path="/"){return `${siteConfig.url}${path.startsWith("/")?path:`/${path}`}`;}
