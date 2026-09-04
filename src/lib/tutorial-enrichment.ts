import type { SourceReference } from "@/types/admin";
import type { Tutorial, TutorialSummary } from "@/types/tutorial";

type VerifiedMetadata = {
  cover_url: string;
  source_references: SourceReference[];
};

const REVIEWED_AT = "2026-08-15T05:00:00.000Z";
const DEFAULT_AUTHOR_BIO="Đội ngũ AINextGen biên tập hướng dẫn từ tài liệu chính thức, chịu trách nhiệm về bản công khai và cập nhật khi công cụ hoặc chính sách thay đổi.";
const FLOW={label:"Google Flow — Công cụ làm phim AI",url:"https://labs.google/fx/tools/flow"};
const OPENAI_PROMPT={label:"OpenAI — Cách viết prompt hiệu quả",url:"https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt"};
const CLAUDE_PROMPT={label:"Anthropic — Prompting best practices",url:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables"};
const YOUTUBE_ORIGINAL={label:"YouTube — Nội dung nguyên bản và chính sách kiếm tiền",url:"https://support.google.com/youtube/answer/1311392"};
const YOUTUBE_AI={label:"YouTube — Công bố nội dung tạo bằng AI",url:"https://support.google.com/youtube/answer/14328491"};

function fallbackSources(tools:string[]):SourceReference[]{
  if(tools.includes("Remotion"))return [
    {label:"Remotion — Tài liệu chính thức",url:"https://www.remotion.dev/docs/"},
    {label:"ElevenLabs — Tài liệu Text to Speech",url:"https://elevenlabs.io/docs/overview/capabilities/text-to-speech"},
    YOUTUBE_AI,
  ];
  if(tools.includes("Higgsfield AI"))return [
    {label:"Higgsfield — Tài liệu sản phẩm AI Video",url:"https://higgsfield.ai/ai-video"},
    CLAUDE_PROMPT,
    YOUTUBE_AI,
  ];
  if(tools.includes("Magic Hour AI"))return [
    {label:"Magic Hour — Nền tảng tạo video AI",url:"https://magichour.ai/"},
    YOUTUBE_ORIGINAL,
    YOUTUBE_AI,
  ];
  if(tools.includes("YouTube Kids"))return [
    YOUTUBE_ORIGINAL,
    {label:"YouTube — Nội dung chất lượng cho trẻ em và gia đình",url:"https://support.google.com/youtube/answer/10774223"},
    {label:"YouTube — Nội dung dành cho trẻ em",url:"https://support.google.com/youtube/answer/9684541"},
  ];
  if(tools.includes("Canva"))return [
    FLOW,
    {label:"Canva — Thỏa thuận cấp phép nội dung",url:"https://www.canva.com/policies/content-license-agreement/"},
    YOUTUBE_ORIGINAL,
  ];
  if(tools.includes("Claude AI"))return [CLAUDE_PROMPT,FLOW,YOUTUBE_AI];
  return [OPENAI_PROMPT,FLOW,YOUTUBE_ORIGINAL];
}

function neutralizeHeadline(value:string|null|undefined){
  if(!value)return value;
  return value
    .replace(/\s+triệu view(?:\s+và bật kiếm tiền YouTube)?/gi,"")
    .replace(/\s+million[- ]view/gi,"")
    .replace(/\s+viral/gi,"")
    .replace(/\s{2,}/g," ")
    .trim();
}

function neutralizeDescription(value:string|null|undefined){
  if(!value)return value;
  return value
    .replace(/triệu view/gi,"thu hút người xem")
    .replace(/million[- ]view/gi,"audience-focused")
    .replace(/bật kiếm tiền YouTube/gi,"đáp ứng yêu cầu xuất bản trên YouTube")
    .replace(/\bviral\b/gi,"dễ chia sẻ")
    .replace(/\s{2,}/g," ")
    .trim();
}

export const verifiedTutorialMetadata: Record<string, VerifiedMetadata> = {
  "nghien-cuu-voi-ai-khong-hallucination": { cover_url: "/images/tutorials/nghien-cuu-voi-ai-khong-hallucination.webp", source_references: [
    { label: "NIST — Generative AI Profile", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" },
    { label: "Google AI — Prompt design strategies", url: "https://ai.google.dev/gemini-api/docs/prompting-strategies" },
  ] },
  "prompt-engineering-tu-co-ban-den-thuc-chien": { cover_url: "/images/tutorials/prompt-engineering-tu-co-ban-den-thuc-chien.webp", source_references: [
    { label: "OpenAI — Prompt engineering best practices", url: "https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt" },
    { label: "Google AI — Prompt design strategies", url: "https://ai.google.dev/gemini-api/docs/prompting-strategies" },
  ] },
  "tu-dong-tom-tat-cuoc-hop-voi-ai": { cover_url: "/images/tutorials/tu-dong-tom-tat-cuoc-hop-voi-ai.webp", source_references: [
    { label: "Microsoft Learn — Craft effective prompts for Copilot", url: "https://learn.microsoft.com/en-us/training/paths/craft-effective-prompts-copilot-microsoft-365/" },
    { label: "Make — OpenAI integration", url: "https://www.make.com/en/integrations/make/openai-gpt-3" },
  ] },
  "lo-trinh-hoc-ai-thuc-chien-30-ngay": { cover_url: "/images/tutorials/lo-trinh-hoc-ai-thuc-chien-30-ngay.webp", source_references: [
    { label: "Google — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
    { label: "OpenAI Academy — Prompting", url: "https://academy.openai.com/public/clubs/work-users-ynjqu/resources/prompting" },
  ] },
  "llm-la-gi-cho-nguoi-moi": { cover_url: "/images/tutorials/llm-la-gi-cho-nguoi-moi.webp", source_references: [
    { label: "Google — Introduction to large language models", url: "https://developers.google.com/machine-learning/crash-course/llm" },
    { label: "Vaswani et al. — Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
  ] },
  "tao-hinh-anh-ai-dung-thuong-hieu": { cover_url: "/images/tutorials/tao-hinh-anh-ai-dung-thuong-hieu.webp", source_references: [
    { label: "OpenAI — Image generation guide", url: "https://developers.openai.com/api/docs/guides/image-generation" },
    { label: "Canva — Brand Hub", url: "https://www.canva.com/newsroom/news/home-for-every-brand/" },
  ] },
  "12-prompt-ai-cho-dan-van-phong": { cover_url: "/images/tutorials/12-prompt-ai-cho-dan-van-phong.webp", source_references: [
    { label: "Microsoft Learn — Write effective prompts", url: "https://learn.microsoft.com/en-us/training/modules/write-effective-prompts-do-more-prompting/" },
    { label: "OpenAI — Prompt engineering best practices", url: "https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt" },
  ] },
  "content-calendar-tu-dong-voi-make-va-ai": { cover_url: "/images/tutorials/content-calendar-tu-dong-voi-make-va-ai.webp", source_references: [
    { label: "Make — OpenAI integration", url: "https://www.make.com/en/integrations/make/openai-gpt-3" },
    { label: "Notion — API quickstart", url: "https://developers.notion.com/guides/get-started/quick-start" },
  ] },
  "lo-trinh-prompt-engineer-8-tuan": { cover_url: "/images/tutorials/lo-trinh-prompt-engineer-8-tuan.webp", source_references: [
    { label: "OpenAI — Prompt engineering best practices", url: "https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt" },
    { label: "OpenAI — Evals guide", url: "https://developers.openai.com/api/docs/guides/evals" },
    { label: "Anthropic — Prompting best practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
  ] },
  "rag-la-gi-va-cach-hoat-dong": { cover_url: "/images/tutorials/rag-la-gi-va-cach-hoat-dong.webp", source_references: [
    { label: "Lewis et al. — Retrieval-Augmented Generation", url: "https://arxiv.org/abs/2005.11401" },
    { label: "Google — Embeddings", url: "https://developers.google.com/machine-learning/crash-course/embeddings" },
  ] },
  "prompt-chaining-chia-viec-lon-thanh-nhiem-vu-nho": { cover_url: "/images/tutorials/prompt-chaining-chia-viec-lon-thanh-nhiem-vu-nho.webp", source_references: [
    { label: "Google AI — Prompt design strategies", url: "https://ai.google.dev/gemini-api/docs/prompting-strategies" },
    { label: "Anthropic — Prompting best practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
  ] },
  "ai-agent-an-toan-voi-human-in-the-loop": { cover_url: "/images/tutorials/ai-agent-an-toan-voi-human-in-the-loop.webp", source_references: [
    { label: "OpenAI Agents SDK — Human-in-the-loop", url: "https://openai.github.io/openai-agents-js/guides/human-in-the-loop/" },
    { label: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
  ] },
};

export function enrichTutorial<T extends Tutorial | TutorialSummary>(tutorial: T): T {
  const metadata = verifiedTutorialMetadata[tutorial.slug];
  const sourceReferences=(tutorial.source_references?.length??0)>=2?tutorial.source_references:fallbackSources(tutorial.tools);
  const coverUrl=tutorial.cover_url?.replace("https://ainextgen.vn/","https://ainextgen.io.vn/")
    ||(tutorial.slug==="tao-video-tu-dong-bang-code-remotion-ai-voice"?"/images/tutorials/tao-video-tu-dong-bang-code-remotion-ai-voice.webp":null);
  const normalized={
    ...tutorial,
    title:neutralizeHeadline(tutorial.title)??tutorial.title,
    excerpt:neutralizeDescription(tutorial.excerpt)??tutorial.excerpt,
    seo_title:neutralizeHeadline(tutorial.seo_title),
    seo_description:neutralizeDescription(tutorial.seo_description),
    cover_url:coverUrl,
    author_bio:tutorial.author_bio||DEFAULT_AUTHOR_BIO,
    source_references:sourceReferences,
  } as T;
  if (!metadata) return normalized;
  return { ...normalized, ...metadata, reviewed_at: REVIEWED_AT, updated_at: REVIEWED_AT };
}
