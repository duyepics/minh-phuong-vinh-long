import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Tin tức | Minh Phương',
  description: 'Cập nhật những tin tức mới nhất, kiến thức và xu hướng về gốm sứ từ Minh Phương.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="w-full min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <nav className="flex items-center text-sm font-medium text-[var(--color-slate)] mb-4">
            <Link href="/" className="hover:text-[var(--color-gold)] transition-colors flex items-center">
              <Home size={16} className="mr-1.5" />
              Trang chủ
            </Link>
            <span className="mx-2.5 text-[#D8D4CC]">/</span>
            <span className="text-[var(--color-forest)]">
              Blog & Tin Tức
            </span>
          </nav>
          <h1 className="font-heading text-4xl md:text-4xl font-bold text-[var(--color-forest)]">
            Blog & Tin Tức
          </h1>
        </div>

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#E0DCD4]/30">
            <p className="text-[var(--color-slate)] text-lg mb-4">Hiện tại chưa có bài viết nào được xuất bản.</p>
            <Link 
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-forest)] px-8 text-sm font-medium text-white transition-colors hover:bg-[var(--color-teak)]"
            >
              Về trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
