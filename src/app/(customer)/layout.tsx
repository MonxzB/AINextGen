import { AiPet } from "@/components/ai-pet";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export default function CustomerLayout({children}:{children:React.ReactNode}){return <><SiteHeader/><main>{children}</main><SiteFooter/><AnalyticsTracker/><AiPet/></>}
