'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect, useTransition } from 'react'
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Category {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state cho search term để debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Reset page if filtering
      params.delete('page')
      return params.toString()
    },
    [searchParams]
  )

  // Xử lý Search với debounce (hoặc form submit)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('q', searchTerm))
    })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('category', e.target.value))
    })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('sort', e.target.value))
    })
  }

  // Đồng bộ URL parameters về local state nếu user navigate back/forward
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
  }, [searchParams])

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0DCD4]/50 space-y-6 relative sticky top-24">
      
      {/* Loading overlay khi đang transition */}
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
           <Loader2 className="h-6 w-6 animate-spin text-[var(--color-forest)]" />
        </div>
      )}

      {/* Tìm kiếm */}
      <div>
        <h3 className="font-semibold text-[var(--color-forest)] mb-3">Tìm kiếm</h3>
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Tên sản phẩm..."
            className="pl-10 w-full rounded-full border-[#E0DCD4] focus-visible:ring-[var(--color-gold)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="hidden">Submit</button>
        </form>
      </div>

      {/* Lọc danh mục */}
      <div>
        <h3 className="font-semibold text-[var(--color-forest)] mb-3">Danh mục</h3>
        <div className="relative">
          <select
            className="w-full appearance-none bg-transparent border border-[#E0DCD4] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-[var(--color-forest)]"
            value={searchParams.get('category') || ''}
            onChange={handleCategoryChange}
          >
            <option value="">Tất cả</option>
            {categories.flatMap((cat) => [
              <option key={cat.id} value={cat.id} className="font-bold text-[#1C2B2B]">
                {cat.name}
              </option>,
              ...(cat.children || []).map(child => (
                <option key={child.id} value={child.id}>
                  &nbsp;&nbsp;&nbsp;— {child.name}
                </option>
              ))
            ])}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Sắp xếp */}
      <div>
        <h3 className="font-semibold text-[var(--color-forest)] mb-3">Sắp xếp</h3>
        <div className="relative">
          <select
            className="w-full appearance-none bg-transparent border border-[#E0DCD4] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent text-[var(--color-forest)]"
            value={searchParams.get('sort') || 'newest'}
            onChange={handleSortChange}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name-asc">Tên (A-Z)</option>
            <option value="name-desc">Tên (Z-A)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
    </div>
  )
}
