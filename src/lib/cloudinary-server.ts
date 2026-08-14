import "server-only";

import { createHash } from "node:crypto";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const IMPORT_IMAGE_HOSTS = new Set(["storage.perfectcdn.com", "maxyt.vn", "www.maxyt.vn"]);

export type CloudinaryUpload = {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
};

function hasValidImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/gif") {
    const signature = String.fromCharCode(...bytes.slice(0, 6));
    return signature === "GIF87a" || signature === "GIF89a";
  }
  if (type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function uploadImageBytes(bytes: Uint8Array, type: string, fileName: string, folder: string): Promise<CloudinaryUpload> {
  if (!ALLOWED_TYPES.has(type) || bytes.byteLength > MAX_FILE_SIZE || !hasValidImageSignature(bytes, type)) {
    throw new Error("Ảnh nguồn không hợp lệ hoặc vượt quá 8 MB.");
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary chưa được cấu hình trong .env.local.");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const form = new FormData();
  const fileBytes = new Uint8Array(bytes.byteLength);
  fileBytes.set(bytes);
  form.append("file", new Blob([fileBytes.buffer], { type }), fileName);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    body: form,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const result = await response.json() as { secure_url?: string; public_id?: string; width?: number; height?: number; error?: { message?: string } };
  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(result.error?.message || "Cloudinary từ chối ảnh nguồn.");
  }
  return { url: result.secure_url, publicId: result.public_id, width: result.width ?? null, height: result.height ?? null };
}

function assertAllowedImageUrl(value: string) {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" || !IMPORT_IMAGE_HOSTS.has(parsed.hostname.toLowerCase()) || parsed.username || parsed.password || parsed.port) {
    throw new Error("Nguồn ảnh không thuộc miền MaxYT được cho phép.");
  }
  return parsed;
}

async function fetchRemoteImage(value: string) {
  let current = assertAllowedImageUrl(value);
  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const response = await fetch(current, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "AINextGen-Authorized-Importer/1.0" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirect === 3) throw new Error("Ảnh nguồn chuyển hướng không hợp lệ.");
      current = assertAllowedImageUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new Error(`Không tải được ảnh nguồn (${response.status}).`);
    const type = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() || "";
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (!ALLOWED_TYPES.has(type) || declaredLength > MAX_FILE_SIZE) throw new Error("Định dạng hoặc kích thước ảnh nguồn không được hỗ trợ.");
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > MAX_FILE_SIZE) throw new Error("Ảnh nguồn vượt quá 8 MB.");
    return { bytes, type, url: current };
  }
  throw new Error("Không tải được ảnh nguồn.");
}

export async function importRemoteImage(value: string, userId: string): Promise<CloudinaryUpload> {
  const { bytes, type, url } = await fetchRemoteImage(value);
  const extension = type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const baseName = url.pathname.split("/").pop()?.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 70) || "source-image";
  return uploadImageBytes(bytes, type, `${baseName}.${extension}`, `ainextgen/imports/maxyt/${userId}`);
}
