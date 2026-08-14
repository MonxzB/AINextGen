"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useRef, useState } from "react";
import { ArrowLeft, Eye, ImagePlus, LoaderCircle, Save, Send } from "lucide-react";
import { saveTutorial } from "@/app/admin/tutorials/actions";
import { ContentBlockEditor } from "@/components/admin/content-block-editor";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";
import { tutorialCategories } from "@/lib/content-pillars";
import { slugify } from "@/lib/utils";
import type { AdminTutorial, TutorialActionState } from "@/types/admin";

const initialState: TutorialActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? <span className="mt-1 block text-xs font-medium text-red-600">{errors[0]}</span> : null;
}

export function TutorialEditor({ tutorial, defaultCategory }: { tutorial?: AdminTutorial; defaultCategory?: string }) {
  const [state, formAction, pending] = useActionState(saveTutorial, initialState);
  const [title, setTitle] = useState(tutorial?.title ?? "");
  const [slug, setSlug] = useState(tutorial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(tutorial?.slug));
  const [excerpt, setExcerpt] = useState(tutorial?.excerpt ?? "");
  const [content, setContent] = useState(tutorial?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(tutorial?.cover_url ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [seoTitle, setSeoTitle] = useState(tutorial?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(tutorial?.seo_description ?? "");
  const coverInput = useRef<HTMLInputElement>(null);
  const previewTitle = useMemo(() => seoTitle.trim() || title.trim() || "Tiêu đề tutorial", [seoTitle, title]);
  const previewDescription = seoDescription.trim() || excerpt.trim() || "Mô tả ngắn sẽ xuất hiện trên Google và khi chia sẻ bài viết.";
  const selectedCategory = tutorial?.category ?? defaultCategory ?? "Prompting";
  const categoryOptions = tutorialCategories.includes(selectedCategory as typeof tutorialCategories[number]) ? tutorialCategories : [...tutorialCategories, selectedCategory];
  const returnTo = `/admin/tutorials${selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ""}`;
  const sourceText = tutorial?.source_references?.map((source) => `${source.label} | ${source.url}`).join("\n") ?? "";
  const reviewedDate = (tutorial?.reviewed_at ?? new Date().toISOString()).slice(0, 10);

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function uploadCover(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      window.alert("Chỉ nhận ảnh JPG, PNG, WebP hoặc GIF tối đa 8 MB.");
      return;
    }
    setCoverUploading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      setCoverUrl(result.url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Không thể upload ảnh bìa lên Cloudinary.");
    } finally {
      setCoverUploading(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  }

  return (
    <form action={formAction} className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      {tutorial && <input type="hidden" name="id" value={tutorial.id} />}
      <input type="hidden" name="return_to" value={returnTo} />
      <section className="card min-w-0 space-y-5 p-5 sm:p-7">
        {state.error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-700"><b>Chưa thể lưu.</b> {state.error}</div>}
        {tutorial?.source_url && <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-4 text-sm"><p className="font-bold">Bài nhập từ {tutorial.source_site || "nguồn bên ngoài"}</p><p className="mt-1 break-all text-xs text-black/50"><a href={tutorial.source_url} target="_blank" rel="noreferrer" className="hover:text-brand-700">{tutorial.source_url}</a></p><p className="mt-2 text-xs text-black/45">Hãy kiểm chứng và biên tập lại trước khi xuất bản.</p></div>}
        <div>
          <label htmlFor="title" className="text-sm font-bold">Tiêu đề <span className="text-red-600">*</span></label>
          <input id="title" className="input mt-2 text-lg font-bold" name="title" value={title} onChange={(event) => handleTitle(event.target.value)} placeholder="Ví dụ: Xây trợ lý AI với ChatGPT trong 30 phút" required />
          <FieldError errors={state.fieldErrors?.title} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3"><label htmlFor="slug" className="text-sm font-bold">Đường dẫn</label><span className="text-xs text-black/40">Tự tạo từ tiêu đề</span></div>
          <div className="mt-2 flex min-w-0 items-center rounded-xl border border-white/15 bg-white/5 px-3.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"><span className="shrink-0 text-sm text-black/40">/tutorials/</span><input id="slug" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none" name="slug" value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} /></div>
          <FieldError errors={state.fieldErrors?.slug} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3"><label htmlFor="excerpt" className="text-sm font-bold">Mô tả ngắn <span className="text-red-600">*</span></label><span className="text-xs text-black/40">20–320 ký tự</span></div>
          <textarea id="excerpt" className="input mt-2" name="excerpt" rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="Nêu rõ người đọc sẽ học được gì và kết quả nhận được." required />
          <FieldError errors={state.fieldErrors?.excerpt} />
        </div>
        <div><input type="hidden" name="content" value={content}/><ContentBlockEditor initialBlocks={tutorial?.content_blocks} legacyContent={tutorial?.content??""} onChange={(_,text)=>setContent(text)}/><FieldError errors={state.fieldErrors?.content}/><FieldError errors={state.fieldErrors?.content_blocks}/></div>
        <div>
          <label htmlFor="cover_url" className="text-sm font-bold">Ảnh bìa</label>
          <div className="mt-2 grid gap-3 sm:grid-cols-[180px_1fr]">
            <button type="button" onClick={() => coverInput.current?.click()} className="relative grid aspect-video place-items-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5">
              {coverUploading ? <LoaderCircle className="animate-spin text-brand-700" /> : coverUrl ? <Image src={coverUrl} alt="Xem trước ảnh bìa" fill unoptimized className="object-cover" /> : <span className="grid place-items-center gap-1 text-xs font-bold text-black/45"><ImagePlus />Upload lên Cloudinary</span>}
            </button>
            <div className="space-y-2">
              <div className="flex gap-2"><input id="cover_url" className="input" type="url" name="cover_url" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="URL Cloudinary hoặc upload ảnh" /><button type="button" onClick={() => coverInput.current?.click()} disabled={coverUploading} className="btn-secondary shrink-0 !px-3">{coverUploading ? <LoaderCircle className="animate-spin" size={17} /> : <ImagePlus size={17} />}</button></div>
              <p className="text-xs text-black/45">JPG, PNG, WebP hoặc GIF · tối đa 8 MB.</p>
            </div>
          </div>
          <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => uploadCover(event.target.files?.[0])} />
          <FieldError errors={state.fieldErrors?.cover_url} />
        </div>
      </section>

      <aside className="space-y-5 xl:sticky xl:top-24">
        <section className="card p-5">
          <h2 className="font-black">Xuất bản</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="text-sm font-bold">Kho nội dung<select className="input mt-2" name="category" defaultValue={selectedCategory}>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select><FieldError errors={state.fieldErrors?.category} /></label>
            <label className="text-sm font-bold">Cấp độ<select className="input mt-2" name="difficulty" defaultValue={tutorial?.difficulty ?? "beginner"}><option value="beginner">Cơ bản</option><option value="intermediate">Trung cấp</option><option value="advanced">Nâng cao</option></select></label>
            <label className="text-sm font-bold">Thời gian đọc (phút)<input className="input mt-2" type="number" name="duration_minutes" min="1" max="180" defaultValue={tutorial?.duration_minutes ?? 10} required /><FieldError errors={state.fieldErrors?.duration_minutes} /></label>
            <label className="text-sm font-bold">Công cụ<input className="input mt-2" name="tools" defaultValue={tutorial?.tools?.join(", ") ?? ""} placeholder="ChatGPT, Claude, Make" /></label>
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold"><input type="checkbox" name="is_featured" defaultChecked={tutorial?.is_featured} className="size-4 accent-brand-600" /> Đánh dấu bài nổi bật</label>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button type="submit" name="intent" value="draft" disabled={pending} className="btn-secondary gap-2 disabled:opacity-50"><Save size={17} />{pending ? "Đang lưu..." : "Lưu bản nháp"}</button>
            <button type="submit" name="intent" value="published" disabled={pending} className="btn-primary gap-2 disabled:opacity-50"><Send size={17} />{pending ? "Đang lưu..." : tutorial?.status === "published" ? "Cập nhật bài" : "Xuất bản"}</button>
            {tutorial&&<Link href={`/preview/tutorials/${tutorial.id}`} target="_blank" className="btn-secondary gap-2 sm:col-span-2 xl:col-span-1"><Eye size={17}/> Xem trước bản hiện tại</Link>}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-black">Tác giả & kiểm chứng</h2><p className="mt-1 text-xs leading-5 text-black/45">Thông tin này giúp người đọc và Google đánh giá độ tin cậy của bài viết.</p>
          <label className="mt-4 block text-sm font-bold">Tên tác giả<input className="input mt-2" name="author_name" defaultValue={tutorial?.author_name ?? "Đội ngũ AINextGen"} maxLength={100} required/></label><FieldError errors={state.fieldErrors?.author_name}/>
          <label className="mt-4 block text-sm font-bold">Giới thiệu tác giả<textarea className="input mt-2" name="author_bio" defaultValue={tutorial?.author_bio ?? ""} rows={3} maxLength={300} placeholder="Kinh nghiệm hoặc trách nhiệm biên tập nội dung..."/></label><FieldError errors={state.fieldErrors?.author_bio}/>
          <label className="mt-4 block text-sm font-bold">Ngày kiểm chứng gần nhất<input className="input mt-2" type="date" name="reviewed_at" defaultValue={reviewedDate}/></label>
          <label className="mt-4 block text-sm font-bold">Nguồn tham khảo<textarea className="input mt-2 font-mono text-xs leading-5" name="source_references" defaultValue={sourceText} rows={5} placeholder={"OpenAI Docs | https://platform.openai.com/docs\nAnthropic Docs | https://docs.anthropic.com"}/><span className="mt-1 block text-xs font-normal text-black/40">Mỗi dòng: Tên nguồn | URL</span></label><FieldError errors={state.fieldErrors?.source_references}/>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-black">SEO Google</h2><span className="text-xs font-semibold text-brand-700">Xem trước</span></div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="truncate text-xs text-black/50">ainextgen.vn › tutorials › {slug || "duong-dan"}</p>
            <p className="mt-1 line-clamp-2 text-base font-semibold text-brand-700">{previewTitle}</p>
            <p className="mt-1 line-clamp-3 text-xs leading-5 text-black/50">{previewDescription}</p>
          </div>
          <label className="mt-4 block text-sm font-bold">SEO title <span className={`float-right text-xs ${seoTitle.length > 60 ? "text-red-600" : "text-black/40"}`}>{seoTitle.length}/60</span><input className="input mt-2" name="seo_title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} maxLength={70} placeholder="Để trống sẽ dùng tiêu đề bài" /></label>
          <label className="mt-4 block text-sm font-bold">Meta description <span className={`float-right text-xs ${seoDescription.length > 160 ? "text-red-600" : "text-black/40"}`}>{seoDescription.length}/160</span><textarea className="input mt-2" name="seo_description" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} rows={3} maxLength={180} placeholder="Mô tả hấp dẫn để tăng tỷ lệ nhấp" /></label>
        </section>

        <div className="flex flex-wrap gap-3 px-1">
          <Link href="/admin/tutorials" className="inline-flex items-center gap-1 text-sm font-bold text-black/50 hover:text-brand-700"><ArrowLeft size={16} /> Danh sách</Link>
          {tutorial?.status === "published" && <Link href={`/tutorials/${tutorial.slug}`} target="_blank" className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-brand-700"><Eye size={16} /> Xem bài công khai</Link>}
        </div>
      </aside>
    </form>
  );
}
