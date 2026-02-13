"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const { currentPage, totalPages } = meta;

  pages.push(1);

  if (currentPage > 3) pages.push("...");

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <Button
        variant="outline"
        size="icon-xs"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!meta.hasPreviousPage}
      >
        <ChevronLeft />
      </Button>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="xs"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="icon-xs"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!meta.hasNextPage}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
