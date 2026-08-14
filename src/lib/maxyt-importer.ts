import "server-only";

import { parse, type HTMLElement } from "next/dist/compiled/node-html-parser";
import { importRemoteImage } from "@/lib/cloudinary-server";
import type { ContentBlock } from "@/types/admin";

const MAX_HTML_SIZE = 2 * 1024 * 1024;
const MAX_CONTENT_IMAGES = 12;
const MAXYT_HOSTS = new Set(["maxyt.vn", "www.maxyt.vn"]);

export type ImportedMaxytArticle = {
  sourceUrl: string;
  title: string;
  excerpt: string;
  content: string;
  contentBlocks: ContentBlock[];
  coverUrl: string | null;
  category: string;
  durationMinutes: number;
  tools: string[];
};

function normalizeText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

function shorten(value: string, max: number) {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  return `${slice.slice(0, Math.max(slice.lastIndexOf(" "), max - 35)).trim()}…`;
}

export function normalizeMaxytArticleUrl(value: string) {
  const parsed = new URL(value.trim());
  const host = parsed.hostname.toLowerCase();
  if (
    parsed.protocol !== "https:" ||
    !MAXYT_HOSTS.has(host) ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    !/^\/(?:en\/)?tin-tuc\/[^/]+\/?$/.test(parsed.pathname)
  ) {
    throw new Error("Chỉ hỗ trợ URL bài viết dạng https://maxyt.vn/en/tin-tuc/ten-bai-viet.");
  }
  parsed.hostname = "maxyt.vn";
  parsed.search = "";
  parsed.hash = "";
  parsed.pathname = parsed.pathname.replace(/\/$/, "");
  return parsed.toString();
}

function resolveSourceImage(value: string | undefined, baseUrl: string) {
  if (!value || value.startsWith("data:")) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function blockId(index: number) {
  return `import-${index + 1}`;
}

function parseContentNode(node: HTMLElement, baseUrl: string, blocks: ContentBlock[]) {
  if (blocks.length >= 300) return;
  const tag = node.tagName?.toLowerCase() || "";
  const text = normalizeText(node.text || "");

  if (["h1", "h2", "h3", "h4"].includes(tag) && text) {
    blocks.push({ id: blockId(blocks.length), type: "heading", text });
    return;
  }
  if (tag === "p") {
    if (text) blocks.push({ id: blockId(blocks.length), type: "paragraph", text });
    for (const image of node.querySelectorAll("img")) parseContentNode(image, baseUrl, blocks);
    return;
  }
  if (tag === "ul" || tag === "ol") {
    const items = node.querySelectorAll("li").map((item) => normalizeText(item.text || "")).filter(Boolean);
    if (items.length) blocks.push({ id: blockId(blocks.length), type: "checklist", text: items.join("\n") });
    return;
  }
  if (tag === "blockquote" && text) {
    blocks.push({ id: blockId(blocks.length), type: "quote", text });
    return;
  }
  if (tag === "pre") {
    const code = normalizeText(node.querySelector("code")?.text || node.text || "");
    const className = node.querySelector("code")?.getAttribute("class") || "";
    const language = className.match(/language-([\w-]+)/)?.[1] || "text";
    if (code) blocks.push({ id: blockId(blocks.length), type: "code", text: code, language });
    return;
  }
  if (tag === "img") {
    const source = resolveSourceImage(node.getAttribute("src") || node.getAttribute("data-src"), baseUrl);
    if (source) blocks.push({ id: blockId(blocks.length), type: "image", url: source, alt: normalizeText(node.getAttribute("alt") || "") });
    return;
  }
  for (const child of node.childNodes || []) parseContentNode(child, baseUrl, blocks);
}

function blocksToLegacyContent(blocks: ContentBlock[]) {
  return blocks.map((block) => {
    if (block.type === "heading") return `## ${block.text}`;
    if (block.type === "image") return block.caption ? `[Ảnh: ${block.caption}]` : "";
    return block.text || "";
  }).filter(Boolean).join("\n\n");
}

function inferCategory(text: string) {
  const value = text.toLocaleLowerCase("vi");
  if (/\bprompt\b|câu lệnh/.test(value)) return "Prompting";
  if (/automation|tự động hóa|workflow|make\.com|n8n|zapier/.test(value)) return "Automation";
  if (/lộ trình|roadmap|từ cơ bản|người mới bắt đầu/.test(value)) return "Lộ trình";
  if (/tạo ảnh|tạo video|midjourney|dall-e|canva|thiết kế|sáng tạo/.test(value)) return "Creative AI";
  if (/năng suất|công việc|văn phòng|productivity|excel|powerpoint/.test(value)) return "Productivity";
  return "AI Fundamentals";
}

function detectTools(text: string) {
  const candidates = ["ChatGPT", "Claude", "Gemini", "Canva", "Midjourney", "DALL·E", "Copilot", "Perplexity", "Notion AI", "Jasper", "Copy.ai", "YouTube", "Make", "n8n", "Zapier"];
  return candidates.filter((tool) => text.toLocaleLowerCase("vi").includes(tool.toLocaleLowerCase("vi")));
}

async function fetchArticleHtml(sourceUrl: string) {
  const response = await fetch(sourceUrl, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    headers: { "User-Agent": "AINextGen-Authorized-Importer/1.0", Accept: "text/html,application/xhtml+xml" },
  });
  const contentType = response.headers.get("content-type") || "";
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (!response.ok) throw new Error(`MaxYT trả về lỗi ${response.status}.`);
  if (!contentType.includes("text/html") || declaredLength > MAX_HTML_SIZE) throw new Error("Phản hồi từ MaxYT không phải trang bài viết hợp lệ.");
  const html = await response.text();
  if (html.length > MAX_HTML_SIZE) throw new Error("Trang nguồn vượt quá giới hạn 2 MB.");
  return html;
}

async function copyImagesToCloudinary(blocks: ContentBlock[], coverSource: string | null, userId: string) {
  const inlineSources = blocks.filter((block) => block.type === "image" && block.url).map((block) => block.url as string).slice(0, MAX_CONTENT_IMAGES);
  const sources = [...new Set([coverSource, ...inlineSources].filter((value): value is string => Boolean(value)))];
  const uploaded = new Map<string, string>();
  for (let offset = 0; offset < sources.length; offset += 3) {
    const batch = sources.slice(offset, offset + 3);
    const results = await Promise.all(batch.map(async (source) => [source, (await importRemoteImage(source, userId)).url] as const));
    for (const [source, cloudinaryUrl] of results) uploaded.set(source, cloudinaryUrl);
  }
  return {
    coverUrl: coverSource ? uploaded.get(coverSource) || null : null,
    blocks: blocks.flatMap((block) => {
      if (block.type !== "image") return [block];
      const cloudinaryUrl = block.url ? uploaded.get(block.url) : null;
      return cloudinaryUrl ? [{ ...block, url: cloudinaryUrl }] : [];
    }),
  };
}

export async function importMaxytArticle(value: string, userId: string): Promise<ImportedMaxytArticle> {
  const sourceUrl = normalizeMaxytArticleUrl(value);
  const root = parse(await fetchArticleHtml(sourceUrl));
  const title = normalizeText(root.querySelector(".block-blog__header h1")?.text || "");
  const contentRoot = root.querySelector(".block-blog__content");
  if (title.length < 5 || !contentRoot) throw new Error("Không tìm thấy cấu trúc bài viết MaxYT trên URL này.");

  const rawBlocks: ContentBlock[] = [];
  for (const child of contentRoot.childNodes || []) parseContentNode(child, sourceUrl, rawBlocks);
  if (!rawBlocks.some((block) => block.type !== "image" && block.text)) throw new Error("Bài nguồn không có nội dung có thể nhập.");

  const coverSource = resolveSourceImage(root.querySelector(".block-blog__preview img")?.getAttribute("src"), sourceUrl);
  const copied = await copyImagesToCloudinary(rawBlocks, coverSource, userId);
  const content = blocksToLegacyContent(copied.blocks);
  const excerptSource = copied.blocks.filter((block) => block.type === "paragraph" && block.text).map((block) => block.text).join(" ");
  const excerpt = shorten(excerptSource || content.replace(/^##\s+/gm, ""), 300);
  const searchableText = `${title}\n${content}`;
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    sourceUrl,
    title: shorten(title, 120),
    excerpt: excerpt.length >= 20 ? excerpt : shorten(`${title}. ${excerpt}`, 300),
    content,
    contentBlocks: copied.blocks,
    coverUrl: copied.coverUrl,
    category: inferCategory(searchableText),
    durationMinutes: Math.min(180, Math.max(3, Math.ceil(words / 220))),
    tools: detectTools(searchableText),
  };
}
