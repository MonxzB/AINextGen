import Link from "next/link";
import { AdminProductTable } from "@/components/admin/admin-product-table";
import { getProducts } from "@/lib/data";
export default async function Products(){const rows=await getProducts();return <><div className="flex items-end justify-between"><div><h1 className="text-3xl font-black">Sản phẩm</h1><p className="mt-2 text-black/50">Quản lý nội dung và các nguồn giá affiliate.</p></div><Link href="/admin/products/new" className="btn-primary">Thêm sản phẩm</Link></div><AdminProductTable rows={rows}/></>}
