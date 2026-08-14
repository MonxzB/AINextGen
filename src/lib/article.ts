import { slugify } from "@/lib/utils";
import type { ContentBlock } from "@/types/admin";

export type ArticleHeading={id:string;text:string};
export function articleHeadingId(text:string,index:number){return `section-${slugify(text)||"noi-dung"}-${index}`;}
export function getArticleHeadings(blocks:ContentBlock[]|null|undefined,legacyContent:string):ArticleHeading[]{
  if(blocks?.length)return blocks.flatMap((block,index)=>block.type==="heading"&&block.text?.trim()?[{id:articleHeadingId(block.text,index),text:block.text.trim()}]:[]);
  return legacyContent.split("\n").map((line)=>line.trim()).filter(Boolean).map((line,index)=>({line,index})).filter(({line})=>line.startsWith("## ")).map(({line,index})=>({id:articleHeadingId(line.slice(3),index),text:line.slice(3)}));
}
