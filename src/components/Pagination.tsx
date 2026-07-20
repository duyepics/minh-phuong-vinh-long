'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        );
      }

      return (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors font-medium ${
            page === currentPage
              ? 'bg-[var(--color-gold)] text-white shadow-sm'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
          }`}
        >
          {page}
        </Link>
      );
    });
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg bg-white/50 border border-gray-200 text-gray-300 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg bg-white/50 border border-gray-200 text-gray-300 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </div>
  )
}
