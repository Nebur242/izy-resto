import { useState, useMemo } from 'react';

interface PaginationOptions<T> {
  items: T[];
  pageSize: number;
  initialPage?: number;
}

export function usePagination<T>({ items, pageSize, initialPage = 1 }: PaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const totalPages = Math.ceil(items.length / pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}