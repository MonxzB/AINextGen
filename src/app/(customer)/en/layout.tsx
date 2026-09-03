import type { Metadata } from "next";
import { englishIndexingEnabled } from "@/lib/features";

export const metadata:Metadata={
  robots:englishIndexingEnabled?{index:true,follow:true}:{index:false,follow:true},
};

export default function EnglishLayout({children}:{children:React.ReactNode}){
  return children;
}

