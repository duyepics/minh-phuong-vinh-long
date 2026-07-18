import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ChevronLeft } from 'lucide-react'

// Cấu hình revalidate và dynamic params
export const dynamicParams = true
export const revalidate = 60 // Revalidate cache mỗi 60 giây

// Hàm sinh metadata động
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) {
    return { title: 'Bài viết không tồn tại' }
  }

  return {
    title: `${post.title} | Minh Phương`,
    description: post.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...',
    openGraph: {
      title: post.title,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
  })

  if (!post || !post.published) {
    notFound()
  }

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.createdAt))

  return (
    <main className="w-full min-h-screen py-12">
      <article className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Nút quay lại */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-[var(--color-slate)] hover:text-[var(--color-gold)] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Quay lại danh sách
          </Link>
        </div>

        {/* Header bài viết */}
        <header className="mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-[var(--color-forest)] mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-sm text-[var(--color-slate)]/80 font-accent uppercase tracking-wider">
            <Calendar size={15} className="mr-2" />
            {formattedDate}
          </div>
        </header>

        {/* Ảnh Cover */}
        {post.imageUrl && (
          <div className="relative w-full aspect-video md:aspect-[2/1] rounded-2xl overflow-hidden mb-12 shadow-sm">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        {/* Nội dung bài viết (Render HTML từ database) */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.03)] border border-[#E0DCD4]/20">
          <div 
            className="
              text-[var(--color-forest)] leading-relaxed break-words whitespace-pre-wrap
              [&_p]:mb-5 [&_p]:text-[1.05rem] [&_p]:text-[var(--color-slate)]
              [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-[var(--color-forest)] [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-[var(--color-slate)]
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-[var(--color-slate)]
              [&_li]:mb-2
              [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:my-8 [&_img]:w-full [&_img]:object-cover
              [&_a]:text-[var(--color-gold)] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[var(--color-teak)]
              [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-gold)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--color-slate)]/90 [&_blockquote]:my-6 [&_blockquote]:bg-[var(--color-linen)] [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-lg
              [&_strong]:font-semibold [&_strong]:text-[var(--color-forest)]
            "
            dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;/g, ' ') }}
          />
        </div>
      </article>
    </main>
  )
}
