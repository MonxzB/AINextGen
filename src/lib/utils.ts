export function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
export function money(value?: number | null) { return value == null ? "Xem giá tốt nhất" : new Intl.NumberFormat("vi-VN", { style:"currency",currency:"VND",maximumFractionDigits:0 }).format(value); }
