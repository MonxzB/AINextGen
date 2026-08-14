# AINextGen — AI Knowledge Hub

Website tutorial và chia sẻ kiến thức AI bằng Next.js, TypeScript, Tailwind CSS và Supabase.

## Chạy local

1. Cài dependencies: `pnpm install`
2. Sao chép `.env.example` thành `.env.local` và điền thông tin Supabase.
3. Chạy lần lượt các migration trong `supabase/migrations` bằng Supabase SQL Editor.
4. Tạo tài khoản admin trong Supabase Authentication.
5. Chạy `pnpm dev`, mở `http://localhost:3000`.

Development dùng cache `.next-dev` riêng để không xung đột với cache production `.next` khi chạy build.

Nếu chưa cấu hình Supabase, website tự dùng tutorial demo. Admin xuất bản nội dung thật cần Supabase.

## Chức năng chính

- Trang chủ AI knowledge portal, lộ trình học và chủ đề nổi bật.
- Thư viện tutorial, tìm kiếm/lọc và trang đọc bài.
- Nội dung phân cấp cơ bản, trung cấp, nâng cao.
- Admin CMS viết, lưu nháp và xuất bản tutorial.
- Nhập bài MaxYT đã được cấp quyền vào bản nháp, chuyển ảnh sang Cloudinary và chống trùng nguồn.
- Giao diện Web3 responsive, hỗ trợ Reduce Motion.

Các bảng affiliate cũ được giữ trong database để không làm mất dữ liệu, nhưng không còn xuất hiện trong điều hướng AINextGen.
