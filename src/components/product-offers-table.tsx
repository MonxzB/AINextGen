"use client";

import { useState } from "react";
import { BadgeCheck, ExternalLink, Truck } from "lucide-react";
import { getPageSlice, TablePagination } from "@/components/admin/table-pagination";
import { money } from "@/lib/utils";
import type { AffiliateLink } from "@/types/database";

export function ProductOffersTable({ links }: { links: AffiliateLink[] }) {
  const [page, setPage] = useState(1);
  const pagination = getPageSlice(links, page);

  if (!links.length) {
    return <div className="card mt-6 p-10 text-center"><p className="font-bold">Chưa có nguồn giá cho sản phẩm này</p><p className="mt-2 text-sm text-black/45">Admin có thể thêm website, ứng dụng và URL đích trong phần quản trị sản phẩm.</p></div>;
  }

  return <div className="card mt-6 overflow-hidden">
    <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-black/[.03]"><tr><th className="p-4">Nơi bán</th><th className="p-4">Giá</th><th className="p-4">Bảo hành</th><th className="p-4">Vận chuyển</th><th className="p-4">Ưu đãi</th><th className="p-4"></th></tr></thead><tbody>{pagination.rows.map((link, index) => {const absoluteIndex=(pagination.currentPage-1)*10+index;return <tr key={link.id} className="border-t align-top"><td className="p-4"><div className="flex items-center gap-2"><b>{link.marketplace?.name||"Nhà bán"}</b>{link.is_official_store&&<BadgeCheck size={17} className="text-brand-600"/>}</div><p className="mt-1 text-xs text-black/45">{link.seller_name||"Nhà bán chưa cập nhật"}</p>{absoluteIndex===0&&link.price!=null&&<span className="mt-2 inline-block rounded-full bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">Giá thấp nhất</span>}</td><td className="p-4"><p className="text-lg font-black text-brand-700">{money(link.price)}</p>{link.original_price&&<p className="text-xs text-black/35 line-through">{money(link.original_price)}</p>}</td><td className="max-w-48 p-4">{link.warranty||"Chưa cập nhật"}</td><td className="max-w-48 p-4"><span className="flex gap-1"><Truck size={16}/>{link.shipping_info||"Chưa cập nhật"}</span></td><td className="max-w-48 p-4">{link.voucher_info||"—"}</td><td className="p-4"><a href={`/go/${link.id}`} rel="nofollow sponsored" target="_blank" className="btn-primary whitespace-nowrap">Đến nơi bán <ExternalLink className="ml-2" size={15}/></a></td></tr>})}</tbody></table></div>
    <TablePagination page={pagination.currentPage} totalItems={links.length} onPageChange={setPage}/>
  </div>;
}
