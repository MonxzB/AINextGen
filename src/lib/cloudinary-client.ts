type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
};

export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/admin/images", {
    method: "POST",
    body,
  });
  const result = (await response.json().catch(() => null)) as (CloudinaryUploadResult & { error?: string }) | null;

  if (!response.ok || !result?.url) {
    throw new Error(result?.error || "Không thể upload ảnh lên Cloudinary.");
  }

  return result;
}
