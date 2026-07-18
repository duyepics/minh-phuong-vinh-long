import Link from 'next/link'
import Image from 'next/image'
import { Box } from 'lucide-react' // Use lucide-react for 3D icon

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  model3dUrl?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* Hình ảnh sản phẩm */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F1EB]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-forest)]/20">
            {/* Fallback image */}
            <Box size={64} strokeWidth={1} />
          </div>
        )}
        
        {/* Badge 3D Model */}
        {product.model3dUrl && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/90 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-[var(--color-forest)] shadow-sm backdrop-blur-sm">
            <Box size={12} className="text-[var(--color-gold)] sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">3D VIEW</span>
            <span className="sm:hidden">3D</span>
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-3 sm:p-5 border-t border-[#E0DCD4]/30 flex-grow flex flex-col justify-between">
        <div>
          <div className="mb-1 sm:mb-2">
            {product.category && (
              <span className="text-[10px] sm:text-xs font-accent tracking-wider text-[var(--color-slate)] uppercase">
                {product.category.name}
              </span>
            )}
          </div>
          <h3 className="font-heading text-sm sm:text-lg font-semibold text-[var(--color-forest)] transition-colors group-hover:text-[var(--color-teak)] line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        {/* Nút Xem chi tiết ảo */}
        <div className="mt-2 sm:mt-4 flex items-center justify-between">
          <span className="text-[11px] sm:text-sm font-medium text-[var(--color-gold)] opacity-0 transition-all duration-300 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0">
            Xem chi tiết &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
