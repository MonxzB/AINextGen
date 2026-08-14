import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Product } from "@/types/database";

export function ProductCard({product}:{product:Product}){
  const href=`/products/${product.slug}`;
  return <article className="content-auto card group overflow-hidden"><Link href={href} prefetch={false} className="relative block aspect-[4/3] overflow-hidden bg-brand-50">{product.thumbnail_url?<Image src={product.thumbnail_url} alt={product.name} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105"/>:<div className="grid h-full place-items-center text-5xl">📦</div>}{product.is_featured&&<span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 shadow">Nổi bật</span>}</Link><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-brand-700">{product.category?.name??"Sản phẩm"}</p><Link href={href} prefetch={false}><h3 className="mt-2 text-lg font-extrabold group-hover:text-brand-700">{product.name}</h3></Link><p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">{product.short_description}</p><div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-1 text-sm font-bold"><Star size={16} className="fill-amber-400 text-amber-400"/>{product.rating} <span className="font-normal text-black/40">({product.review_count})</span></span><ArrowRight size={18} className="text-brand-700 transition group-hover:translate-x-1"/></div></div></article>;
}
