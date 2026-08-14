import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getBrands, getCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";
export default async function EditProduct({params}:{params:Promise<{id:string}>}){const db=await createClient();const [{data},categories,brands]=await Promise.all([db.from("products").select("*").eq("id",(await params).id).single(),getCategories(),getBrands()]);if(!data)notFound();return <><h1 className="text-3xl font-black">Sửa sản phẩm</h1><ProductForm product={data as Product} categories={categories} brands={brands}/></>}
