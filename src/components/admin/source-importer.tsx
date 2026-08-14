"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, CloudDownload, ExternalLink, FilePenLine, LoaderCircle, ShieldCheck } from "lucide-react";

type ImportResult = {
  ok?: boolean;
  id?: string;
  title?: string;
  editUrl?: string;
  message?: string;
  error?: string;
  existing?: { id: string; title: string; editUrl: string };
};

export function SourceImporter() {
  const [url, setUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed || !url.trim()) return;
    setPending(true);
    setResult(null);
    try {
      const response = await fetch("/api/admin/import/maxyt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), copyrightConfirmed: confirmed }),
      });
      const payload = await response.json() as ImportResult;
      setResult(payload);
      if (response.ok) {
        setUrl("");
        setConfirmed(false);
      }
    } catch {
      setResult({ error: "Mất kết nối khi nhập bài. Hãy kiểm tra mạng và thử lại." });
    } finally {
      setPending(false);
    }
  }

  const editTarget = result?.editUrl || result?.existing?.editUrl;
  const resultTitle = result?.title || result?.existing?.title;

  return <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
    <form onSubmit={submit} className="card p-5 sm:p-7">
      <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-700"><CloudDownload size={24}/></span><div><h2 className="text-xl font-black">Nhập một bài viết</h2><p className="mt-1 text-sm leading-6 text-black/50">Nội dung và ảnh được đưa vào CMS dưới dạng bản nháp. Bạn vẫn là người kiểm tra, chỉnh sửa và quyết định xuất bản.</p></div></div>

      <label htmlFor="source-url" className="mt-7 block text-sm font-bold">URL bài viết MaxYT</label>
      <div className="mt-2 flex min-w-0 gap-2"><input id="source-url" className="input" type="url" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} disabled={pending} required placeholder="https://maxyt.vn/en/tin-tuc/ten-bai-viet"/><a href="https://maxyt.vn/en/tin-tuc" target="_blank" rel="noreferrer" className="btn-secondary shrink-0 !px-3" aria-label="Mở danh sách bài MaxYT"><ExternalLink size={18}/></a></div>
      <p className="mt-2 text-xs leading-5 text-black/45">Chỉ nhận trang bài chi tiết thuộc maxyt.vn; không nhận trang danh sách hoặc website khác.</p>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6"><input type="checkbox" className="mt-1 size-4 shrink-0 accent-brand-600" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={pending}/><span><b className="block">Tôi xác nhận có quyền sử dụng nội dung này</b><span className="text-black/50">Bao gồm quyền sao chép văn bản và hình ảnh từ nguồn vào AINextGen.</span></span></label>

      {pending && <div role="status" className="mt-5 rounded-2xl border border-brand-500/25 bg-brand-500/10 p-4"><div className="flex items-center gap-3"><LoaderCircle className="animate-spin text-brand-700" size={20}/><div><p className="font-bold">Đang nhập bài và chuyển ảnh…</p><p className="mt-1 text-xs text-black/50">Thường mất 10–40 giây, vui lòng giữ trang này mở.</p></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"/></div></div>}

      {result?.error && <div role="alert" className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm"><p className="font-bold text-red-500">Chưa thể nhập bài</p><p className="mt-1 text-black/60">{result.error}</p>{editTarget && <Link href={editTarget} className="mt-3 inline-flex items-center gap-2 font-bold text-brand-700"><FilePenLine size={16}/> Mở bài đã có</Link>}</div>}
      {result?.ok && <div role="status" className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm"><div className="flex gap-3"><CheckCircle2 className="shrink-0 text-emerald-500" size={21}/><div><p className="font-bold">Đã tạo bản nháp</p><p className="mt-1 text-black/60">{resultTitle}</p>{editTarget && <Link href={editTarget} className="mt-3 inline-flex items-center gap-2 font-bold text-brand-700"><FilePenLine size={16}/> Kiểm tra và chỉnh sửa bài</Link>}</div></div></div>}

      <button type="submit" disabled={pending || !confirmed || !url.trim()} className="btn-primary mt-6 w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"><CloudDownload size={18}/>{pending ? "Đang xử lý…" : "Nhập vào bản nháp"}</button>
    </form>

    <aside className="space-y-4 xl:sticky xl:top-24"><section className="card p-5"><ShieldCheck className="text-emerald-500"/><h2 className="mt-4 font-black">Cơ chế an toàn</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-black/50"><li>• Chỉ cho phép MaxYT và tài khoản quản trị.</li><li>• Không tự động xuất bản ra website.</li><li>• Chống nhập trùng theo URL nguồn.</li><li>• Lưu nguồn tham khảo trong bài viết.</li><li>• Ảnh được chuyển về Cloudinary của bạn.</li></ul></section><section className="card p-5"><h2 className="font-black">Sau khi nhập</h2><ol className="mt-3 space-y-2 text-sm leading-6 text-black/50"><li>1. Đọc lại và cập nhật thông tin.</li><li>2. Kéo thả các khối nội dung, ảnh.</li><li>3. Bổ sung SEO, tác giả và ngày kiểm chứng.</li><li>4. Xem trước rồi mới xuất bản.</li></ol></section></aside>
  </div>;
}
