import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferManager } from "@/components/admin/offer-manager";
import { createClient } from "@/lib/supabase/server";
import type { AffiliateLink } from "@/types/database";
export default async function ProductOffers({params}:{params:Promise<{id:string}>}){const id=(await params).id;const db=await createClient();const [{data:product},{data:offers}]=await Promise.all([db.from("products").select("id,name").eq("id",id).single(),db.from("affiliate_links").select("*,marketplace:marketplaces(name,logo_url)").eq("product_id",id).order("price")]);if(!product)notFound();return <><Link href="/admin/products" className="text-sm font-bold text-brand-700">← Sản phẩm</Link><h1 className="mt-3 text-3xl font-black">Nguồn giá: {product.name}</h1><p className="mb-7 mt-2 text-black/50">Thêm website, ứng dụng, nhà bán và quyền lợi để khách hàng so sánh.</p><OfferManager productId={id} offers={(offers as AffiliateLink[])||[]}/></>}
