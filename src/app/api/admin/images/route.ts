import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function hasValidImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/gif") return String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a" || String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a";
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function POST(request: Request) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });

  const { data: profile } = await db.from("users").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "editor"].includes(profile.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền upload ảnh." }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary chưa được cấu hình trong .env.local." }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Không tìm thấy file ảnh." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Chỉ nhận JPG, PNG, WebP hoặc GIF tối đa 8 MB." }, { status: 400 });
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!hasValidImageSignature(buffer, file.type)) {
    return NextResponse.json({ error: "Nội dung file không phải định dạng ảnh hợp lệ." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = `ainextgen/articles/${user.id}`;
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const upload = new FormData();
  upload.append("file", new Blob([buffer], { type: file.type }), file.name);
  upload.append("api_key", apiKey);
  upload.append("timestamp", timestamp);
  upload.append("folder", folder);
  upload.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    body: upload,
    cache: "no-store",
  });
  const result = await response.json() as { secure_url?: string; public_id?: string; width?: number; height?: number; error?: { message?: string } };
  if (!response.ok || !result.secure_url || !result.public_id) {
    return NextResponse.json({ error: result.error?.message || "Cloudinary từ chối file upload." }, { status: 502 });
  }

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? null,
    height: result.height ?? null,
  });
}
