const siteUrl=process.env.NODE_ENV==="production"?"https://ainextgen.io.vn":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
const contactEmail=(process.env.NEXT_PUBLIC_CONTACT_EMAIL||"hello@ainextgen.io.vn").replace("@ainextgen.vn","@ainextgen.io.vn");
export const siteConfig={name:"AINextGen",description:"Tutorial, workflow, prompt và kiến thức AI thực chiến dành cho người Việt.",url:siteUrl.replace(/\/$/,""),locale:"vi_VN",author:"Đội ngũ AINextGen",email:contactEmail};
export function absoluteUrl(path="/"){return `${siteConfig.url}${path.startsWith("/")?path:`/${path}`}`;}
