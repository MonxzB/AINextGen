import { ProductForm } from "@/components/admin/product-form";
import { getBrands, getCategories } from "@/lib/data";
export default async function NewProduct(){const [categories,brands]=await Promise.all([getCategories(),getBrands()]);return <><h1 className="text-3xl font-black">Thêm sản phẩm</h1><ProductForm categories={categories} brands={brands}/></>}
