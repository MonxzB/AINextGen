"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowUp, Code2, GripVertical, Heading2, ImagePlus,
  ListChecks, LoaderCircle, MessageSquareQuote, Plus, Quote,
  Trash2, TriangleAlert, Type,
} from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";
import type { ContentBlock, ContentBlockType } from "@/types/admin";

const makeId=()=>globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random()}`;
const blockOptions:[ContentBlockType,string,typeof Type][]=[
  ["heading","Tiêu đề",Heading2],["paragraph","Văn bản",Type],["image","Hình ảnh",ImagePlus],
  ["code","Code",Code2],["prompt","Prompt",MessageSquareQuote],["checklist","Checklist",ListChecks],
  ["warning","Cảnh báo",TriangleAlert],["quote","Trích dẫn",Quote],
];
const labels=Object.fromEntries(blockOptions.map(([type,label])=>[type,label])) as Record<ContentBlockType,string>;
const placeholders:Partial<Record<ContentBlockType,string>>={
  heading:"Tiêu đề phần...",paragraph:"Viết nội dung đoạn văn...",code:"Dán đoạn code vào đây...",
  prompt:"Viết prompt để người đọc có thể sao chép...",checklist:"Mỗi dòng là một mục cần kiểm tra...",
  warning:"Thông tin quan trọng người đọc cần chú ý...",quote:"Nội dung trích dẫn...",
};

function emptyBlock(type:ContentBlockType):ContentBlock{
  if(type==="image")return {id:makeId(),type,url:"",alt:"",caption:""};
  if(type==="code")return {id:makeId(),type,text:"",language:"text"};
  return {id:makeId(),type,text:""};
}
function legacyBlocks(content:string):ContentBlock[]{const lines=content.split(/\n{2,}/).map((line)=>line.trim()).filter(Boolean);return (lines.length?lines:[""]).map((line)=>line.startsWith("## ")?{id:makeId(),type:"heading",text:line.slice(3)}:{id:makeId(),type:"paragraph",text:line});}
export function blocksToText(blocks:ContentBlock[]){return blocks.map((block)=>{if(block.type==="heading")return `## ${block.text??""}`;if(block.type==="image")return block.caption||block.alt||"Hình ảnh minh họa";return block.text??"";}).filter(Boolean).join("\n\n");}

export function ContentBlockEditor({initialBlocks,legacyContent,onChange}:{initialBlocks?:ContentBlock[]|null;legacyContent:string;onChange:(blocks:ContentBlock[],text:string)=>void}){
  const seed=useMemo(()=>initialBlocks?.length?initialBlocks:legacyBlocks(legacyContent),[initialBlocks,legacyContent]);
  const [blocks,setBlocks]=useState<ContentBlock[]>(seed);
  const [dragged,setDragged]=useState<string|null>(null);
  const [uploading,setUploading]=useState<string|null>(null);
  const fileRefs=useRef<Record<string,HTMLInputElement|null>>({});
  function commit(next:ContentBlock[]){setBlocks(next);onChange(next,blocksToText(next));}
  function update(id:string,patch:Partial<ContentBlock>){commit(blocks.map((block)=>block.id===id?{...block,...patch}:block));}
  function add(type:ContentBlockType,after?:number){const next=[...blocks];next.splice(after===undefined?next.length:after+1,0,emptyBlock(type));commit(next);}
  function move(index:number,direction:-1|1){const target=index+direction;if(target<0||target>=blocks.length)return;const next=[...blocks];[next[index],next[target]]=[next[target],next[index]];commit(next);}
  function drop(target:number){if(!dragged)return;const from=blocks.findIndex((block)=>block.id===dragged);if(from<0||from===target){setDragged(null);return;}const next=[...blocks];const [item]=next.splice(from,1);next.splice(target,0,item);setDragged(null);commit(next);}
  async function upload(block:ContentBlock,file?:File){if(!file)return;if(!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)||file.size>8*1024*1024){window.alert("Chỉ nhận ảnh JPG, PNG, WebP hoặc GIF tối đa 8 MB.");return;}setUploading(block.id);try{const data=await uploadImageToCloudinary(file);update(block.id,{url:data.url,alt:block.alt||file.name.replace(/\.[^.]+$/,"")});}catch(error){window.alert(error instanceof Error?error.message:"Không thể upload ảnh lên Cloudinary.");}finally{setUploading(null);}}

  return <div>
    <input type="hidden" name="content_blocks" value={JSON.stringify(blocks)}/>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black">Nội dung theo khối</p><p className="mt-1 text-xs text-black/45">Kéo ⋮⋮ để sắp xếp · Có block chuyên dụng để người đọc dễ thực hành.</p></div><div className="flex max-w-2xl flex-wrap justify-end gap-2">{blockOptions.map(([type,label,Icon])=><button key={type} type="button" onClick={()=>add(type)} className="btn-secondary gap-1 !px-3 !py-2 text-xs"><Icon size={15}/>{label}</button>)}</div></div>
    <div className="mt-4 space-y-3">{blocks.map((block,index)=><article key={block.id} draggable onDragStart={()=>setDragged(block.id)} onDragEnd={()=>setDragged(null)} onDragOver={(event)=>event.preventDefault()} onDrop={()=>drop(index)} className={`group rounded-2xl border bg-white/5 p-3 transition ${dragged===block.id?"border-brand-500 opacity-50":"border-white/10 hover:border-brand-500/40"}`}>
      <div className="flex items-start gap-2">
        <button type="button" className="mt-2 cursor-grab touch-none rounded-lg p-2 text-black/35 hover:bg-white/5 hover:text-brand-700" aria-label="Kéo để sắp xếp"><GripVertical size={19}/></button>
        <div className="min-w-0 flex-1"><p className="mb-2 text-[11px] font-black uppercase tracking-wider text-brand-700">{labels[block.type]}</p>
          {block.type==="heading"&&<input className="input text-lg font-black" value={block.text??""} onChange={(event)=>update(block.id,{text:event.target.value})} placeholder={placeholders.heading}/>} 
          {block.type==="image"&&<div className="grid gap-3 sm:grid-cols-[180px_1fr]"><button type="button" onClick={()=>fileRefs.current[block.id]?.click()} className="relative grid aspect-video place-items-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5">{block.url?<Image src={block.url} alt={block.alt||"Ảnh bài viết"} fill unoptimized className="object-cover"/>:uploading===block.id?<LoaderCircle className="animate-spin text-brand-700"/>:<span className="grid place-items-center gap-1 text-xs font-bold text-black/45"><ImagePlus/>Upload ảnh</span>}</button><input ref={(element)=>{fileRefs.current[block.id]=element}} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event)=>upload(block,event.target.files?.[0])}/><div className="space-y-2"><div className="flex gap-2"><input className="input" value={block.url??""} onChange={(event)=>update(block.id,{url:event.target.value})} placeholder="URL ảnh hoặc upload"/><button type="button" onClick={()=>fileRefs.current[block.id]?.click()} disabled={uploading===block.id} className="btn-secondary shrink-0 !px-3">{uploading===block.id?<LoaderCircle className="animate-spin" size={17}/>:<ImagePlus size={17}/>}</button></div><input className="input" value={block.alt??""} onChange={(event)=>update(block.id,{alt:event.target.value})} placeholder="Alt text mô tả ảnh (SEO)"/><input className="input" value={block.caption??""} onChange={(event)=>update(block.id,{caption:event.target.value})} placeholder="Chú thích ảnh (không bắt buộc)"/></div></div>}
          {block.type==="code"&&<div className="space-y-2"><input className="input max-w-48 font-mono text-sm" value={block.language??""} onChange={(event)=>update(block.id,{language:event.target.value})} placeholder="Ngôn ngữ: typescript"/><textarea className="input min-h-44 resize-y font-mono text-sm leading-6" value={block.text??""} onChange={(event)=>update(block.id,{text:event.target.value})} placeholder={placeholders.code}/></div>}
          {!["heading","image","code"].includes(block.type)&&<textarea className={`input min-h-32 resize-y leading-7 ${block.type==="prompt"?"font-mono text-sm":""}`} value={block.text??""} onChange={(event)=>update(block.id,{text:event.target.value})} placeholder={placeholders[block.type]}/>} 
          {block.type==="quote"&&<input className="input mt-2" value={block.caption??""} onChange={(event)=>update(block.id,{caption:event.target.value})} placeholder="Tác giả hoặc nguồn trích dẫn (không bắt buộc)"/>}
        </div>
        <div className="flex shrink-0 items-center"><button type="button" onClick={()=>move(index,-1)} disabled={index===0} className="rounded-lg p-2 text-black/40 hover:bg-white/5 disabled:opacity-20" aria-label="Đưa lên"><ArrowUp size={16}/></button><button type="button" onClick={()=>move(index,1)} disabled={index===blocks.length-1} className="rounded-lg p-2 text-black/40 hover:bg-white/5 disabled:opacity-20" aria-label="Đưa xuống"><ArrowDown size={16}/></button><button type="button" onClick={()=>commit(blocks.filter((item)=>item.id!==block.id))} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Xóa khối"><Trash2 size={16}/></button></div>
      </div>
      <div className="mt-2 flex justify-center opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"><button type="button" onClick={()=>add("paragraph",index)} className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-700"><Plus size={13}/> Chèn đoạn phía dưới</button></div>
    </article>)}</div>
    {blocks.length===0&&<button type="button" onClick={()=>add("paragraph")} className="mt-4 grid w-full place-items-center rounded-2xl border border-dashed border-white/20 p-10 text-sm font-bold text-black/45"><Plus/>Thêm khối đầu tiên</button>}
  </div>;
}
