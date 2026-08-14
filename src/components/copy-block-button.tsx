"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyBlockButton({text,label="Sao chép"}:{text:string;label?:string}){
  const [copied,setCopied]=useState(false);
  async function copy(){try{await navigator.clipboard.writeText(text);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
  return <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/75 transition hover:border-brand-500/50 hover:text-white" aria-label={`${label} vào clipboard`}>{copied?<><Check size={14}/>Đã chép</>:<><Copy size={14}/>{label}</>}</button>;
}
