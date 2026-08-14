import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export default function PreviewLayout({children}:{children:React.ReactNode}){return <><SiteHeader/><main>{children}</main><SiteFooter/></>}
