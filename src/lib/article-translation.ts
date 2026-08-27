import "server-only";
import { estimateGoogleTranslationCharacters, translateTextsToEnglish } from "@/lib/google-translate";
import type { ContentBlock } from "@/types/admin";

export type ArticleTranslationSource = {
  title: string;
  excerpt: string;
  content: string;
  contentBlocks: ContentBlock[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  authorBio?: string | null;
};

export type ArticleEnglishTranslation = {
  title_en: string;
  excerpt_en: string;
  content_en: string;
  content_blocks_en: ContentBlock[];
  seo_title_en: string;
  seo_description_en: string;
  author_bio_en: string | null;
  characterCount: number;
};

type TranslationIndexes = { text?: number; alt?: number; caption?: number };

function clampAtWord(value: string, limit: number) {
  const clean = value.trim();
  if (clean.length <= limit) return clean;
  const slice = clean.slice(0, Math.max(1, limit - 1));
  const boundary = slice.lastIndexOf(" ");
  return slice.slice(0, boundary >= limit * 0.55 ? boundary : slice.length).trimEnd()+"…";
}

function blocksToText(blocks: ContentBlock[]) {
  return blocks.map((block) => {
    if (block.type === "heading") return "## "+(block.text ?? "");
    if (block.type === "image") return block.caption || block.alt || "Illustration";
    if (block.type === "code") return "\x60\x60\x60"+(block.language || "text")+"\n"+(block.text ?? "")+"\n\x60\x60\x60";
    return block.text ?? "";
  }).filter(Boolean).join("\n\n");
}

function createTranslationInput(source: ArticleTranslationSource) {
  const values: string[] = [];
  const add = (value?: string | null) => { const index = values.length; values.push(value?.trim() ?? ""); return index; };
  const title = add(source.title);
  const excerpt = add(source.excerpt);
  const legacyContent = source.contentBlocks.length ? undefined : add(source.content);
  const seoTitle = add(source.seoTitle || source.title);
  const seoDescription = add(source.seoDescription || source.excerpt);
  const authorBio = add(source.authorBio);
  const blockIndexes: TranslationIndexes[] = source.contentBlocks.map((block) => ({
    text: block.type === "code" ? undefined : add(block.text),
    alt: block.alt ? add(block.alt) : undefined,
    caption: block.caption ? add(block.caption) : undefined,
  }));
  return { values, title, excerpt, legacyContent, seoTitle, seoDescription, authorBio, blockIndexes };
}

export function estimateArticleTranslationCharacters(source: ArticleTranslationSource) {
  return estimateGoogleTranslationCharacters(createTranslationInput(source).values);
}

export async function translateArticleToEnglish(source: ArticleTranslationSource): Promise<ArticleEnglishTranslation> {
  const input = createTranslationInput(source);
  const result = await translateTextsToEnglish(input.values);
  const contentBlocks = source.contentBlocks.map((block, index) => {
    const indexes = input.blockIndexes[index];
    return {
      ...block,
      text: indexes.text === undefined ? block.text : result.texts[indexes.text],
      alt: indexes.alt === undefined ? block.alt : result.texts[indexes.alt],
      caption: indexes.caption === undefined ? block.caption : result.texts[indexes.caption],
    };
  });
  return {
    title_en: clampAtWord(result.texts[input.title], 120),
    excerpt_en: clampAtWord(result.texts[input.excerpt], 320),
    content_en: input.legacyContent === undefined ? blocksToText(contentBlocks) : result.texts[input.legacyContent],
    content_blocks_en: contentBlocks,
    seo_title_en: clampAtWord(result.texts[input.seoTitle], 70),
    seo_description_en: clampAtWord(result.texts[input.seoDescription], 180),
    author_bio_en: result.texts[input.authorBio]?.trim() || null,
    characterCount: result.characterCount,
  };
}

export function hasCompleteEnglishTranslation(value: {
  title_en?: string | null;
  excerpt_en?: string | null;
  content_en?: string | null;
  content_blocks_en?: ContentBlock[] | null;
}) {
  return Boolean((value.title_en?.trim().length ?? 0) >= 5
    && (value.excerpt_en?.trim().length ?? 0) >= 20
    && ((value.content_en?.trim().length ?? 0) >= 10 || value.content_blocks_en?.length));
}
