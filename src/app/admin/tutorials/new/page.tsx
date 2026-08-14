import { TutorialEditor } from "@/components/admin/tutorial-editor";
import { getContentPillar } from "@/lib/content-pillars";

export default async function NewTutorial({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const pillar = getContentPillar(category);
  return <><p className="text-sm font-bold text-brand-700">{pillar ? `KHO ${pillar.label.toLocaleUpperCase("vi")}` : "KHO KIẾN THỨC"}</p><h1 className="mt-1 text-3xl font-black">{pillar ? `Viết bài ${pillar.label}` : "Viết nội dung mới"}</h1><p className="mt-2 text-black/50">{pillar?.description ?? "Tạo nội dung AI dễ hiểu, có cấu trúc và tối ưu tìm kiếm ngay từ đầu."}</p><TutorialEditor defaultCategory={category} /></>;
}
