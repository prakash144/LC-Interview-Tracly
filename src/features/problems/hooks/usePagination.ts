"use client";

import { useEffect, useMemo, useState } from "react";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const usePagination = (totalItems: number, initialPageSize = 25) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, totalItems]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const range = useMemo(() => {
    if (totalItems === 0) {
      return { from: 0, to: 0 };
    }

    const from = (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);

    return { from, to };
  }, [currentPage, pageSize, totalItems]);

  return {
    currentPage,
    pageSize,
    range,
    setCurrentPage,
    setPageSize,
    totalPages,
  };
};
