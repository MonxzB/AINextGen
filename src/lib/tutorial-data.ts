import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Tutorial, TutorialSummary } from "@/types/tutorial";
import { getPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { enrichTutorial } from "@/lib/tutorial-enrichment";
const content={
 prompt:`## Bạn sẽ học được gì?\n\nPrompt tốt không cần dài, nhưng phải đưa cho AI đủ bối cảnh, mục tiêu và tiêu chuẩn đầu ra.\n\n## Công thức 5 phần\n\n1. **Vai trò:** AI cần suy nghĩ như ai?\n2. **Bối cảnh:** Vấn đề và dữ liệu liên quan.\n3. **Nhiệm vụ:** Kết quả cụ thể cần tạo.\n4. **Ràng buộc:** Độ dài, giọng điệu, điều không được làm.\n5. **Định dạng:** Bảng, checklist hay từng bước.\n\n## Prompt mẫu\n\nBạn là chuyên gia nội dung B2B. Hãy xây dựng dàn ý bài viết dành cho chủ doanh nghiệp nhỏ, giọng văn thực tế, không dùng thuật ngữ khó. Trả về bảng gồm tiêu đề, ý chính và ví dụ.\n\n## Mẹo nâng cao\n\nYêu cầu AI tự kiểm tra câu trả lời theo 3 tiêu chí trước khi trả kết quả cuối cùng.`,
 workflow:`## Mục tiêu workflow\n\nBiến ghi chú thô thành bản tóm tắt, danh sách việc cần làm và email follow-up trong vài phút.\n\n## Quy trình\n\n1. Thu thập transcript hoặc ghi chú.\n2. Dùng AI tách quyết định, rủi ro và action items.\n3. Chuẩn hóa người phụ trách và deadline.\n4. Tạo email follow-up để người dùng duyệt.\n\n## Kiểm soát chất lượng\n\nKhông tự động gửi nội dung do AI tạo. Luôn có bước con người kiểm tra tên, số liệu và cam kết.`,
 image:`## Khi nào nên tạo ảnh bằng AI?\n\nDùng ảnh AI cho concept, social post và moodboard. Với logo, dữ liệu chính xác hoặc nhận diện thương hiệu quan trọng, cần kiểm tra và chỉnh sửa thủ công.\n\n## Prompt hình ảnh\n\nMô tả chủ thể, bối cảnh, ánh sáng, góc máy, bảng màu, chất liệu và tỉ lệ khung hình.\n\n## Checklist\n\n- Không có chữ sai.\n- Không có chi tiết thừa.\n- Màu sắc đúng thương hiệu.\n- Có quyền sử dụng phù hợp.`};
const now=new Date().toISOString();
export const demoTutorials:Tutorial[]=[
 {id:"t1",title:"Prompt Engineering: từ cơ bản đến thực chiến",slug:"prompt-engineering-thuc-chien",excerpt:"Công thức viết prompt rõ ràng, có thể tái sử dụng cho công việc hằng ngày.",content:content.prompt,cover_url:null,difficulty:"beginner",duration_minutes:12,category:"Prompting",tools:["ChatGPT","Claude","Gemini"],is_featured:true,published_at:now},
 {id:"t2",title:"Xây workflow AI tự động hóa công việc",slug:"workflow-ai-tu-dong-hoa",excerpt:"Thiết kế luồng AI có kiểm soát để xử lý ghi chú, báo cáo và follow-up.",content:content.workflow,cover_url:null,difficulty:"intermediate",duration_minutes:18,category:"Automation",tools:["Make","Zapier","ChatGPT"],is_featured:true,published_at:now},
 {id:"t3",title:"Tạo hình ảnh AI đúng ý và đúng thương hiệu",slug:"tao-hinh-anh-ai",excerpt:"Từ prompt hình ảnh đến checklist kiểm tra chất lượng đầu ra.",content:content.image,cover_url:null,difficulty:"beginner",duration_minutes:10,category:"Creative AI",tools:["ImageGen","Canva"],is_featured:true,published_at:now},
 {id:"t4",title:"RAG là gì? Giải thích dễ hiểu cho người mới",slug:"rag-la-gi",excerpt:"Hiểu cách AI đọc dữ liệu riêng và trả lời có căn cứ mà không cần học máy chuyên sâu.",content:content.workflow,cover_url:null,difficulty:"intermediate",duration_minutes:15,category:"AI Fundamentals",tools:["Vector DB","LLM"],is_featured:false,published_at:now},
 {id:"t5",title:"Dùng AI nghiên cứu nhanh nhưng không hallucinate",slug:"nghien-cuu-voi-ai",excerpt:"Quy trình kiểm chứng nguồn, trích dẫn và tách dữ kiện khỏi suy luận.",content:content.prompt,cover_url:null,difficulty:"advanced",duration_minutes:14,category:"Productivity",tools:["ChatGPT","Perplexity"],is_featured:false,published_at:now}
 ,{id:"t6",title:"Lộ trình học AI thực chiến trong 30 ngày",slug:"lo-trinh-hoc-ai-30-ngay",excerpt:"Kế hoạch từng tuần giúp người mới đi từ nền tảng đến một sản phẩm AI có thể sử dụng.",content:content.workflow,cover_url:null,difficulty:"beginner",duration_minutes:16,category:"Lộ trình",tools:["ChatGPT","Notebook"],is_featured:true,published_at:now}
];
const publicFields="id,title,slug,excerpt,content,content_blocks,cover_url,difficulty,duration_minutes,category,tools,is_featured,seo_title,seo_description,author_name,author_bio,source_references,reviewed_at,published_at,updated_at";
const summaryFields="id,title,slug,excerpt,cover_url,difficulty,duration_minutes,category,tools,is_featured,published_at,updated_at";
const legacyPublicFields="id,title,slug,excerpt,content,content_blocks,cover_url,difficulty,duration_minutes,category,tools,is_featured,seo_title,seo_description,published_at,updated_at";

const demoSummaries=()=>demoTutorials.map((tutorial)=>enrichTutorial({id:tutorial.id,title:tutorial.title,slug:tutorial.slug,excerpt:tutorial.excerpt,cover_url:tutorial.cover_url,difficulty:tutorial.difficulty,duration_minutes:tutorial.duration_minutes,category:tutorial.category,tools:tutorial.tools,is_featured:tutorial.is_featured,published_at:tutorial.published_at,updated_at:tutorial.updated_at}));

async function fetchTutorials(){
  const db=getPublicClient();
  const result=await db.from("articles").select(publicFields).eq("status","published").order("published_at",{ascending:false});
  if(!result.error)return ((result.data as unknown as Tutorial[])||[]).map(enrichTutorial);
  const fallback=await db.from("articles").select(legacyPublicFields).eq("status","published").order("published_at",{ascending:false});
  return ((fallback.data as unknown as Tutorial[])||[]).map(enrichTutorial);
}
const cachedTutorials=unstable_cache(fetchTutorials,["ainextgen-public-tutorials-v4"],{revalidate:300,tags:["tutorials"]});

async function fetchTutorialSummaries(){
  const {data}=await getPublicClient().from("articles").select(summaryFields).eq("status","published").order("published_at",{ascending:false});
  return ((data as TutorialSummary[])||[]).map(enrichTutorial);
}
const cachedSummaries=unstable_cache(fetchTutorialSummaries,["ainextgen-public-tutorial-summaries-v4"],{revalidate:300,tags:["tutorials"]});

async function fetchTutorial(slug:string){
  const db=getPublicClient();
  const result=await db.from("articles").select(publicFields).eq("slug",slug).eq("status","published").single();
  const tutorial=result.data as unknown as Tutorial|null;
  if(!result.error)return tutorial ? enrichTutorial(tutorial) : null;
  const fallback=await db.from("articles").select(legacyPublicFields).eq("slug",slug).eq("status","published").single();
  const legacyTutorial=fallback.data as unknown as Tutorial|null;
  return legacyTutorial ? enrichTutorial(legacyTutorial) : null;
}
const cachedTutorial=unstable_cache(fetchTutorial,["ainextgen-public-tutorial-v4"],{revalidate:300,tags:["tutorials"]});

const loadTutorials=process.env.NODE_ENV==="development"?fetchTutorials:cachedTutorials;
const loadTutorialSummaries=process.env.NODE_ENV==="development"?fetchTutorialSummaries:cachedSummaries;
const loadTutorial=process.env.NODE_ENV==="development"?fetchTutorial:cachedTutorial;

export const getTutorials=cache(async():Promise<Tutorial[]>=>isSupabaseConfigured()?loadTutorials():demoTutorials);
export const getTutorialSummaries=cache(async():Promise<TutorialSummary[]>=>isSupabaseConfigured()?loadTutorialSummaries():demoSummaries());
export const getTutorial=cache(async(slug:string):Promise<Tutorial|null>=>isSupabaseConfigured()?loadTutorial(slug):demoTutorials.find((tutorial)=>tutorial.slug===slug)||null);
