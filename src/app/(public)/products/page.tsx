import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import Pagination from '@/components/Pagination'

export const metadata = {
  title: 'Sản Phẩm 3D | Gốm Sứ Minh Phương',
  description: 'Khám phá bộ sưu tập sản phẩm gốm sứ độc đáo của Minh Phương với mô hình 3D trực quan.',
}

// Next.js 15+ searchParams is a Promise
export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const categoryId = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest'
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const currentPage = parseInt(pageParam, 10) > 0 ? parseInt(pageParam, 10) : 1
  const pageSize = 9

  // Construct Prisma 'where' clause
  const where: any = {}
  if (q) {
    where.name = { contains: q, mode: 'insensitive' }
  }
  if (categoryId) {
    where.OR = [
      { categoryId: categoryId },
      { category: { parentId: categoryId } }
    ]
  }

  // Construct Prisma 'orderBy' clause
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' }
  } else if (sort === 'name-asc') {
    orderBy = { name: 'asc' }
  } else if (sort === 'name-desc') {
    orderBy = { name: 'desc' }
  }

  // Fetch data in parallel
  const [categories, products, totalProducts] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    }),
    prisma.product.count({ where })
  ])

  const totalPages = Math.ceil(totalProducts / pageSize)

  return (
    <div className="bg-[#F5F1EB] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-[var(--color-forest)]/70 hover:text-[var(--color-gold)] transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 md:ml-2 text-[var(--color-forest)] font-semibold">Sản phẩm 3D</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 shrink-0">
            <ProductFilters categories={categories} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#E0DCD4]/50">
                <h3 className="text-xl font-semibold text-[var(--color-forest)] mb-2">Không tìm thấy sản phẩm nào</h3>
                <p className="text-[var(--color-slate)]">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
