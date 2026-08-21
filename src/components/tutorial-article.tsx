import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BookOpenCheck, Clock, ExternalLink, Sparkles, UserRound } from "lucide-react";
import { ArticleContent } from "@/components/article-content";
import { ArticleEngagementTracker } from "@/components/article-engagement-tracker";
import { ArticleTools } from "@/components/article-tools";
import { JsonLd } from "@/components/json-ld";
import { TutorialCard } from "@/components/tutorial-card";
import { getArticleHeadings } from "@/lib/article";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Tutorial, TutorialSummary } from "@/types/tutorial";

const levels={beginner:"Cơ bản",intermediate:"Trung cấp",advanced:"Nâng cao"};
const dateFormat=new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium"});

export function TutorialArticle({tutorial,related=[],preview=false}:{tutorial:Tutorial;related?:TutorialSummary[];preview?:boolean}){
  const url=absoluteUrl(`/tutorials/${tutorial.slug}`);
  const articleImage=tutorial.cover_url||tutorial.content_blocks?.find((block)=>block.type==="image")?.url;
  const image=articleImage||absoluteUrl("/opengraph-image");
  const updated=tutorial.updated_at||tutorial.published_at;
  const reviewed=tutorial.reviewed_at||updated;
  const author=tutorial.author_name||siteConfig.author;
  const headings=getArticleHeadings(tutorial.content_blocks,tutorial.content);
  const articleSchema={"@context":"https://schema.org","@type":"Article",headline:tutorial.title,description:tutorial.excerpt,datePublished:tutorial.published_at,dateModified:updated,inLanguage:"vi-VN",mainEntityOfPage:{"@type":"WebPage","@id":url},author:{"@type":"Person",name:author},publisher:{"@type":"Organization",name:siteConfig.name,url:siteConfig.url,logo:{"@type":"ImageObject",url:absoluteUrl("/icon")}},articleSection:tutorial.category,keywords:[tutorial.category,...tutorial.tools].join(", "),image:[image]};
  const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Trang chủ",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:"Tutorial AI",item:absoluteUrl("/tutorials")},{"@type":"ListItem",position:3,name:tutorial.title,item:url}]};
  return <div className="container-page py-10">
    {!preview&&<ArticleEngagementTracker path={`/tutorials/${tutorial.slug}`} estimatedReadSeconds={tutorial.duration_minutes*60}/>}
    {!preview&&<><JsonLd data={articleSchema}/><JsonLd data={breadcrumbSchema}/></>}
    {preview&&<div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm"><div><b>Đang xem trước bản nháp.</b><span className="ml-2 text-black/55">Trang này không được Google lập chỉ mục.</span></div><Link href={`/admin/tutorials/${tutorial.id}`} className="font-bold text-brand-700">Quay lại chỉnh sửa →</Link></div>}
    <nav aria-label="Breadcrumb"><Link href="/tutorials" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700"><ArrowLeft size={17}/> Thư viện tutorial</Link></nav>
    {articleImage&&<figure className="mx-auto mt-10 max-w-6xl"><div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-black/10 bg-white/5 shadow-2xl shadow-brand-500/10 sm:aspect-[16/7]"><Image src={articleImage} alt={`Ảnh bìa bài viết ${tutorial.title}`} fill priority sizes="(max-width: 1280px) 100vw, 1152px" className="object-cover"/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"/></div></figure>}
    <header className="mx-auto mt-10 max-w-4xl text-center"><span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm font-bold text-brand-700">{tutorial.category}</span><h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">{tutorial.title}</h1><div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-black/45"><span>{levels[tutorial.difficulty]}</span><span className="flex items-center gap-1"><Clock size={16}/>{tutorial.duration_minutes} phút đọc</span><span className="flex items-center gap-1"><UserRound size={16}/>{author}</span><time dateTime={reviewed}>Kiểm chứng {dateFormat.format(new Date(reviewed))}</time></div></header>
    <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-6"><article id="tutorial-content" className="card p-6 sm:p-8 lg:p-10"><ArticleContent blocks={tutorial.content_blocks} legacyContent={tutorial.content} intro={tutorial.excerpt}/></article>
        <section className="card p-6 sm:p-8" aria-labelledby="editorial-trust"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-700"><BadgeCheck size={24}/></span><div><h2 id="editorial-trust" className="text-lg font-black">Được kiểm chứng bởi {author}</h2><p className="mt-2 text-sm leading-6 text-black/55">{tutorial.author_bio||"Đội ngũ AINextGen biên soạn nội dung theo hướng thực hành, nêu rõ giới hạn và cập nhật khi công cụ AI thay đổi."}</p><p className="mt-2 text-xs font-semibold text-black/40">Kiểm chứng lần cuối: {dateFormat.format(new Date(reviewed))}</p></div></div></section>
        {Boolean(tutorial.source_references?.length)&&<section className="card p-6 sm:p-8" aria-labelledby="sources-heading"><h2 id="sources-heading" className="flex items-center gap-2 text-xl font-black"><BookOpenCheck className="text-cyan-300"/> Nguồn tham khảo</h2><ol className="mt-5 space-y-3">{tutorial.source_references!.map((source,index)=><li key={`${source.url}-${index}`} className="flex gap-3 text-sm"><span className="font-black text-brand-700">{index+1}.</span><a href={source.url} target="_blank" rel="noopener noreferrer" className="min-w-0 break-words font-semibold text-ink hover:text-brand-700">{source.label}<ExternalLink className="ml-1 inline" size={13}/></a></li>)}</ol></section>}
      </div>
      <aside className="h-fit space-y-4 lg:sticky lg:top-24"><ArticleTools headings={headings} title={tutorial.title} url={url}/><div className="card p-5"><p className="flex items-center gap-2 font-black"><Sparkles className="text-cyan-300" size={18}/> Công cụ sử dụng</p><div className="mt-4 flex flex-wrap gap-2">{tutorial.tools.map((tool)=><span key={tool} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm">{tool}</span>)}</div></div><div className="card p-5"><p className="font-black">Học hiệu quả</p><p className="mt-2 text-sm leading-6 text-black/55">Thực hành ngay sau mỗi phần và luôn kiểm tra lại kết quả AI tạo ra.</p></div></aside>
    </div>
    {related.length>0&&<section className="mx-auto mt-16 max-w-6xl" aria-labelledby="related-heading"><h2 id="related-heading" className="text-3xl font-black">Tutorial liên quan</h2><div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{related.map((item)=><TutorialCard key={item.id} tutorial={item}/>)}</div></section>}
  </div>;
}
