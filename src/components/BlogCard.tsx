import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
}

// Hàm trích xuất một đoạn text ngắn từ content (nếu content chứa HTML)
const getExcerpt = (htmlOrText: string, maxLength: number = 120) => {
  // Loại bỏ các thẻ HTML đơn giản bằng regex và thay thế &nbsp; bằng khoảng trắng
  const text = htmlOrText.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(post.createdAt));

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full block overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* Hình ảnh bài viết */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F5F1EB]">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-forest)]/20">
            {/* Fallback image */}
            <span className="font-heading text-xl opacity-50">Blog</span>
          </div>
        )}
      </div>

      {/* Thông tin bài viết */}
      <div className="flex flex-col flex-grow p-6 border-t border-[#E0DCD4]/30">
        <div className="mb-3 flex items-center text-xs font-accent tracking-wider text-[var(--color-slate)]">
          <Calendar size={14} className="mr-1.5" />
          {formattedDate}
        </div>
        
        <h3 className="mb-3 font-heading text-xl font-semibold text-[var(--color-forest)] transition-colors group-hover:text-[var(--color-teak)] line-clamp-2">
          {post.title}
        </h3>
        
        <p className="mb-4 text-sm text-[var(--color-slate)]/90 line-clamp-3 flex-grow">
          {getExcerpt(post.content)}
        </p>
        
        {/* Nút Xem chi tiết */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-gold)] opacity-0 transition-all duration-300 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0">
            Đọc tiếp &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
