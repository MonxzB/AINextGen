"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteRecord } from "@/app/admin/actions";
import { getPageSlice, TablePagination } from "@/components/admin/table-pagination";
import type { Product } from "@/types/database";

export function AdminProductTable({ rows }: { rows: Product[] }) {
  const [page, setPage] = useState(1);
  const pagination = getPageSlice(rows, page);

  return <div className="card mt-7 overflow-hidden">
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-black/[.03]"><tr><th className="p-4">Sản phẩm</th><th className="p-4">Danh mục</th><th className="p-4">Nguồn giá</th><th className="p-4"></th></tr></thead><tbody>{pagination.rows.map((product) => <tr key={product.id} className="border-t"><td className="p-4"><Link className="font-bold hover:text-brand-700" href={`/admin/products/${product.id}`}>{product.name}</Link><p className="text-xs text-black/40">/{product.slug}</p></td><td className="p-4">{product.category?.name}</td><td className="p-4"><Link href={`/admin/products/${product.id}/offers`} className="rounded-lg bg-brand-50 px-3 py-2 font-bold text-brand-700">Quản lý nguồn ({product.affiliate_links?.length||0})</Link></td><td className="p-4"><form action={deleteRecord.bind(null,"products",product.id)}><button className="text-red-600">Xóa</button></form></td></tr>)}</tbody></table></div>
    <TablePagination page={pagination.currentPage} totalItems={rows.length} onPageChange={setPage}/>
  </div>;
}
