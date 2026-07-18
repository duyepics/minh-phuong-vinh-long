import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import ProductMediaGallery from '@/components/ProductMediaGallery';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Gốm Sứ Minh Phương',
    };
  }

  return {
    title: `${product.name} | Gốm Sứ Minh Phương`,
    description: product.description || `Chi tiết sản phẩm ${product.name}`,
  };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      hotspots: true,
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  let relatedProducts: any[] = [];
  
  if (product.categoryId) {
    const sameCategoryProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 4,
      include: { category: true }
    });

    relatedProducts = [...sameCategoryProducts];

    if (relatedProducts.length < 4) {
      if (product.category?.parentId) {
        const parentCategoryProducts = await prisma.product.findMany({
          where: {
            OR: [
              { categoryId: product.category.parentId },
              { category: { parentId: product.category.parentId } }
            ],
            id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] }
          },
          take: 4 - relatedProducts.length,
          include: { category: true }
        });
        relatedProducts = [...relatedProducts, ...parentCategoryProducts];
      } else {
        const childCategoryProducts = await prisma.product.findMany({
          where: {
            category: { parentId: product.categoryId },
            id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] }
          },
          take: 4 - relatedProducts.length,
          include: { category: true }
        });
        relatedProducts = [...relatedProducts, ...childCategoryProducts];
      }
    }
  }

  const has2D = !!product.imageUrl;
  const has3D = !!product.model3dUrl;
  const hasBoth = has2D && has3D;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <nav className="flex text-sm font-medium" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-[var(--color-slate)] hover:text-[var(--color-gold)] transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link href="/products" className="ml-1 md:ml-2 text-[var(--color-slate)] hover:text-[var(--color-gold)] transition-colors">
                    Sản phẩm
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 md:ml-2 text-[var(--color-forest)] font-semibold truncate max-w-[200px] md:max-w-xs" title={product.name}>
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Khung hiển thị Sản phẩm (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cột Media (2D / 3D) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ProductMediaGallery 
              imageUrl={product.imageUrl} 
              model3dUrl={product.model3dUrl} 
              productName={product.name} 
              hotspots={product.hotspots}
              images={product.images}
            />
          </div>

          {/* Cột Thông tin */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {product.category && (
              <Link href={`/products?category=${product.categoryId}`} className="inline-block px-3 py-1 bg-[#F5F1EB] text-[var(--color-gold)] font-medium text-xs rounded-full uppercase tracking-wider mb-4 hover:bg-[var(--color-gold)] hover:text-white transition-colors w-fit">
                {product.category.name}
              </Link>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--color-forest)] leading-tight mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-[var(--color-gold)] mb-6">
              {product.price ? `Giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}` : 'Giá: Liên hệ'}
            </div>

            <div className="w-16 h-1 bg-[var(--color-gold)] mb-8"></div>

            <div className="space-y-4">
              <div className="p-6 bg-[#F5F1EB]/50 rounded-2xl border border-[#E0DCD4]/50">
                <h4 className="font-semibold text-[var(--color-forest)] mb-2">Bạn quan tâm đến sản phẩm này?</h4>
                <p className="text-sm text-[var(--color-slate)] mb-4">
                  Để lại thông tin, chúng tôi sẽ liên hệ báo giá và tư vấn chi tiết cho bạn trong thời gian sớm nhất.
                </p>
                <Link href={`/bao-gia?productName=${encodeURIComponent(product.name)}&productImage=${encodeURIComponent(product.imageUrl || '')}`} passHref>
                  <Button className="w-full bg-[var(--color-forest)] hover:bg-[var(--color-teak)] text-white h-12 rounded-xl text-md transition-all duration-300 shadow-[0_4px_14px_0_rgba(29,53,49,0.39)] hover:shadow-[0_6px_20px_rgba(29,53,49,0.23)] hover:-translate-y-1">
                    Yêu cầu Báo giá
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>

        {/* Phần mô tả chi tiết phía dưới */}
        <div className="mt-16 pt-10 border-t border-[#E0DCD4] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <h3 className="text-2xl font-heading font-bold text-[var(--color-forest)] mb-8">Mô tả chi tiết</h3>
          <div className="bg-[#F5F1EB]/30 p-6 md:p-8 rounded-2xl border border-[#E0DCD4]/50">
            <div className="prose prose-stone prose-lg max-w-none text-[var(--color-slate)] leading-relaxed">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="italic">Chưa có mô tả chi tiết cho sản phẩm này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Nhóm thông số chi tiết */}
        {(product.height || product.width || product.baseDiameter || product.capacity || product.weight || product.glazeType || product.material || product.pattern || product.artisan || product.packing || product.usageNotes || product.origin) && (
          <div className="mt-16 pt-10 border-t border-[#E0DCD4] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <h3 className="text-2xl font-heading font-bold text-[var(--color-forest)] mb-8">Thông số kỹ thuật</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-[#F5F1EB]/30 p-6 md:p-8 rounded-2xl border border-[#E0DCD4]/50">
              
              {/* Vật lý */}
              {(product.height || product.width || product.baseDiameter || product.capacity || product.weight) && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[var(--color-gold)] border-b border-[#E0DCD4] pb-2">Kích thước & Trọng lượng</h4>
                  <ul className="space-y-3">
                    {product.height && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Chiều cao</span><span className="font-medium text-[var(--color-forest)] text-right">{product.height}</span></li>}
                    {product.width && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Đường kính miệng/rộng</span><span className="font-medium text-[var(--color-forest)] text-right">{product.width}</span></li>}
                    {product.baseDiameter && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Đường kính đáy</span><span className="font-medium text-[var(--color-forest)] text-right">{product.baseDiameter}</span></li>}
                    {product.capacity && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Dung tích</span><span className="font-medium text-[var(--color-forest)] text-right">{product.capacity}</span></li>}
                    {product.weight && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Trọng lượng</span><span className="font-medium text-[var(--color-forest)] text-right">{product.weight}</span></li>}
                  </ul>
                </div>
              )}

              {/* Mỹ thuật */}
              {(product.glazeType || product.material || product.pattern || product.artisan) && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[var(--color-gold)] border-b border-[#E0DCD4] pb-2">Nghệ thuật & Chất liệu</h4>
                  <ul className="space-y-3">
                    {product.glazeType && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Loại men</span><span className="font-medium text-[var(--color-forest)] text-right">{product.glazeType}</span></li>}
                    {product.material && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Chất liệu gốm</span><span className="font-medium text-[var(--color-forest)] text-right">{product.material}</span></li>}
                    {product.pattern && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Họa tiết</span><span className="font-medium text-[var(--color-forest)] text-right">{product.pattern}</span></li>}
                    {product.artisan && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Nghệ nhân/Xưởng</span><span className="font-medium text-[var(--color-forest)] text-right">{product.artisan}</span></li>}
                  </ul>
                </div>
              )}

              {/* Vận hành */}
              {(product.packing || product.usageNotes || product.origin) && (
                <div className="space-y-4 md:col-span-2 mt-4 md:mt-0">
                  <h4 className="text-lg font-semibold text-[var(--color-gold)] border-b border-[#E0DCD4] pb-2">Vận hành & Xuất xứ</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-3 mt-4">
                    {product.origin && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Xuất xứ</span><span className="font-medium text-[var(--color-forest)] text-right">{product.origin}</span></li>}
                    {product.packing && <li className="flex justify-between items-start gap-4"><span className="text-gray-500 text-sm shrink-0 pt-0.5">Quy cách đóng gói</span><span className="font-medium text-[var(--color-forest)] text-right">{product.packing}</span></li>}
                    {product.usageNotes && <li className="flex flex-col gap-1 md:col-span-2 mt-2 pt-3 border-t border-[#E0DCD4]/30"><span className="text-gray-500 text-sm shrink-0">Lưu ý sử dụng</span><span className="font-medium text-[var(--color-forest)]">{product.usageNotes}</span></li>}
                  </ul>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Gợi ý Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#E0DCD4] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-heading font-bold text-[var(--color-forest)]">
                Sản phẩm tương tự
              </h3>
              <Link href="/products" className="text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-teak)] transition-colors">
                Xem tất cả &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
