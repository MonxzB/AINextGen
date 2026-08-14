import { SourceImporter } from "@/components/admin/source-importer";

export default function ImportSourcePage() {
  return <><p className="text-sm font-bold text-brand-700">NHẬP NỘI DUNG CÓ QUYỀN</p><h1 className="mt-1 text-3xl font-black">Nhập bài từ MaxYT</h1><p className="mt-2 max-w-3xl text-black/50">Dùng cho nội dung bạn đã được chủ sở hữu cho phép tái sử dụng. Mỗi lần nhập tạo một bản nháp để bạn biên tập trước khi đăng.</p><SourceImporter/></>;
}
