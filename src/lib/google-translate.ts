import "server-only";

const TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
const MAX_SEGMENT_CHARACTERS = 4_500;
const MAX_BATCH_CHARACTERS = 24_000;
const PROTECTED_CONTENT = /\x60\x60\x60[\s\S]*?\x60\x60\x60|\x60[^\x60\r\n]+\x60|https?:\/\/[^\s<>()]+|<\/?[a-z][^>]*>/gi;

type PlannedPart = { literal: string } | { requestIndex: number };

export function isGoogleTranslationConfigured() {
  return Boolean(process.env.GOOGLE_TRANSLATE_API_KEY?.trim());
}

function splitLongText(value: string) {
  const chunks: string[] = [];
  let remaining = value;
  while (remaining.length > MAX_SEGMENT_CHARACTERS) {
    const window = remaining.slice(0, MAX_SEGMENT_CHARACTERS + 1);
    const candidates = [window.lastIndexOf("\n\n"), window.lastIndexOf("\n"), window.lastIndexOf(". "), window.lastIndexOf(" ")];
    const boundary = candidates.find((index) => index >= Math.floor(MAX_SEGMENT_CHARACTERS * 0.55));
    const cut = boundary === undefined ? MAX_SEGMENT_CHARACTERS : boundary + (window.slice(boundary, boundary + 2) === ". " ? 1 : 0);
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut);
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function addTranslatablePart(raw: string, parts: PlannedPart[], requests: string[]) {
  if (!raw || !raw.trim()) {
    if (raw) parts.push({ literal: raw });
    return;
  }
  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const trailing = raw.match(/\s*$/)?.[0] ?? "";
  const core = raw.slice(leading.length, raw.length - trailing.length);
  if (leading) parts.push({ literal: leading });
  for (const chunk of splitLongText(core)) {
    const requestIndex = requests.length;
    requests.push(chunk);
    parts.push({ requestIndex });
  }
  if (trailing) parts.push({ literal: trailing });
}

function buildPlans(values: string[]) {
  const requests: string[] = [];
  const plans = values.map((value) => {
    const parts: PlannedPart[] = [];
    let cursor = 0;
    for (const match of value.matchAll(PROTECTED_CONTENT)) {
      const index = match.index ?? 0;
      addTranslatablePart(value.slice(cursor, index), parts, requests);
      parts.push({ literal: match[0] });
      cursor = index + match[0].length;
    }
    addTranslatablePart(value.slice(cursor), parts, requests);
    return parts;
  });
  return { plans, requests };
}

function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = { amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === "#") {
      const hex = code[1]?.toLowerCase() === "x";
      const point = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

async function requestBatch(values: string[], apiKey: string) {
  let response: Response;
  try {
    const url = new URL(TRANSLATE_ENDPOINT);
    url.searchParams.set("key", apiKey);
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q: values, source: "vi", target: "en", format: "text" }),
      cache: "no-store",
    });
  } catch {
    throw new Error("Không thể kết nối Google Cloud Translation.");
  }
  const payload = await response.json().catch(() => null) as { data?: { translations?: { translatedText?: string }[] }; error?: { message?: string } } | null;
  if (!response.ok) throw new Error(payload?.error?.message || "Google Translation trả về lỗi "+response.status+".");
  const translations = payload?.data?.translations;
  if (!translations || translations.length !== values.length) throw new Error("Google Translation trả về dữ liệu không đầy đủ.");
  return translations.map((item) => decodeHtmlEntities(item.translatedText ?? ""));
}

export function estimateGoogleTranslationCharacters(values: string[]) {
  return buildPlans(values).requests.reduce((total, value) => total + value.length, 0);
}

export async function translateTextsToEnglish(values: string[]) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (!apiKey) throw new Error("GOOGLE_TRANSLATE_API_KEY chưa được cấu hình trên server.");
  const { plans, requests } = buildPlans(values);
  const translated: string[] = new Array(requests.length);
  for (let start = 0; start < requests.length;) {
    let end = start;
    let characters = 0;
    while (end < requests.length && end - start < 100) {
      const next = requests[end].length;
      if (end > start && characters + next > MAX_BATCH_CHARACTERS) break;
      characters += next;
      end += 1;
    }
    const batch = await requestBatch(requests.slice(start, end), apiKey);
    batch.forEach((value, index) => { translated[start + index] = value; });
    start = end;
  }
  return {
    texts: plans.map((parts) => parts.map((part) => "literal" in part ? part.literal : translated[part.requestIndex]).join("")),
    characterCount: requests.reduce((total, value) => total + value.length, 0),
  };
}
