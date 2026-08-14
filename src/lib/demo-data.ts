import type { Brand, Category, Product } from "@/types/database";
const now = new Date().toISOString();
export const demoCategories: Category[] = [
 { id:"c1",name:"Điện thoại",slug:"dien-thoai",description:"Smartphone đáng mua",image_url:null,is_active:true,created_at:now },
 { id:"c2",name:"Laptop",slug:"laptop",description:"Laptop học tập và làm việc",image_url:null,is_active:true,created_at:now },
 { id:"c3",name:"Gia dụng",slug:"gia-dung",description:"Thiết bị cho ngôi nhà",image_url:null,is_active:true,created_at:now },
 { id:"c4",name:"Âm thanh",slug:"am-thanh",description:"Tai nghe và loa",image_url:null,is_active:true,created_at:now }
];
export const demoBrands: Brand[] = [
 { id:"b1",name:"Apple",slug:"apple",description:null,logo_url:null,is_active:true,created_at:now },
 { id:"b2",name:"Samsung",slug:"samsung",description:null,logo_url:null,is_active:true,created_at:now },
 { id:"b3",name:"Sony",slug:"sony",description:null,logo_url:null,is_active:true,created_at:now }
];
export const demoProducts: Product[] = [
 { id:"p1",category_id:"c1",brand_id:"b1",name:"iPhone 16 Pro",slug:"iphone-16-pro",short_description:"Hiệu năng mạnh, camera linh hoạt và thiết kế titanium.",description:"Lựa chọn cao cấp cân bằng giữa hiệu năng, camera và trải nghiệm sử dụng lâu dài.",thumbnail_url:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",rating:4.8,review_count:128,is_featured:true,is_active:true,seo_title:null,seo_description:null,created_at:now,category:{name:"Điện thoại",slug:"dien-thoai"},brand:{name:"Apple",slug:"apple"},affiliate_links:[] },
 { id:"p2",category_id:"c2",brand_id:"b1",name:"MacBook Air M3",slug:"macbook-air-m3",short_description:"Mỏng nhẹ, pin lâu, phù hợp học tập và công việc.",description:"Laptop di động dành cho người cần hiệu suất tốt và thời lượng pin dài.",thumbnail_url:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",rating:4.9,review_count:96,is_featured:true,is_active:true,seo_title:null,seo_description:null,created_at:now,category:{name:"Laptop",slug:"laptop"},brand:{name:"Apple",slug:"apple"},affiliate_links:[] },
 { id:"p3",category_id:"c4",brand_id:"b3",name:"Sony WH-1000XM5",slug:"sony-wh-1000xm5",short_description:"Tai nghe chống ồn chủ động hàng đầu.",description:"Âm thanh chi tiết, chống ồn hiệu quả và thoải mái khi đeo lâu.",thumbnail_url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",rating:4.7,review_count:214,is_featured:true,is_active:true,seo_title:null,seo_description:null,created_at:now,category:{name:"Âm thanh",slug:"am-thanh"},brand:{name:"Sony",slug:"sony"},affiliate_links:[] }
];
