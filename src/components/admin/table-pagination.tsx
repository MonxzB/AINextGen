"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export const ADMIN_TABLE_PAGE_SIZE = 10;

export function TablePagination({
  page,
  totalItems,
  onPageChange,
  pageSize = ADMIN_TABLE_PAGE_SIZE,
}: {
  page: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.max(1, Math.min(page, pageCount));
  if (totalItems <= pageSize) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm" aria-label="Phân trang bảng">
    <span className="text-xs text-black/45">Hiển thị <b className="text-ink">{start}–{end}</b> / {totalItems} dòng</span>
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-black/60 transition hover:border-brand-500/30 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Trang trước"><ChevronLeft size={17}/></button>
      <span className="min-w-24 text-center text-xs font-semibold">Trang {currentPage} / {pageCount}</span>
      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-black/60 transition hover:border-brand-500/30 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Trang sau"><ChevronRight size={17}/></button>
    </div>
  </nav>;
}

export function getPageSlice<T>(rows: T[], page: number, pageSize = ADMIN_TABLE_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.max(1, Math.min(page, pageCount));
  const start = (currentPage - 1) * pageSize;
  return { currentPage, rows: rows.slice(start, start + pageSize) };
}
