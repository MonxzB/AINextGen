import type { Metadata } from "next";
export const metadata:Metadata={title:"Đăng nhập quản trị",robots:{index:false,follow:false,nocache:true}};
export default function AuthLayout({children}:{children:React.ReactNode}){return children;}
