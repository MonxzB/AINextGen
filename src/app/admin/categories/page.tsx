import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { getCategories } from "@/lib/data";
export default async function Categories(){const rows=await getCategories();return <><h1 className="text-3xl font-black">Danh mục</h1><p className="mb-7 mt-2 text-black/50">Quản lý nhóm sản phẩm trên website.</p><TaxonomyManager type="categories" rows={rows}/></>}
