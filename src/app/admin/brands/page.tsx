import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { getBrands } from "@/lib/data";
export default async function Brands(){const rows=await getBrands();return <><h1 className="text-3xl font-black">Thương hiệu</h1><p className="mb-7 mt-2 text-black/50">Quản lý thương hiệu sản phẩm.</p><TaxonomyManager type="brands" rows={rows}/></>}
