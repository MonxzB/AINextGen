import type { SourceReference } from "@/types/admin";
import type { Tutorial, TutorialSummary } from "@/types/tutorial";

type VerifiedMetadata = {
  cover_url: string;
  source_references: SourceReference[];
};

const REVIEWED_AT = "2026-08-15T05:00:00.000Z";

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
  if (!metadata) return tutorial;
  return { ...tutorial, ...metadata, reviewed_at: REVIEWED_AT, updated_at: REVIEWED_AT };
}