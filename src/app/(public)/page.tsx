import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  HeartHandshake,
  RotateCcw,
  CalendarDays,
  ChevronRight,
  Package,
  Box,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { getSiteSettings } from '@/app/admin/settings/actions'
import ModelViewer from '@/components/ModelViewer'

async function getFeaturedProducts(featuredProductIdsRaw?: string) {
  try {
    let ids: string[] = []
    if (featuredProductIdsRaw) {
      try {
        ids = JSON.parse(featuredProductIdsRaw)
      } catch {
        ids = []
      }
    }

    if (Array.isArray(ids) && ids.length > 0) {
      const prods = await prisma.product.findMany({
        where: {
          id: { in: ids },
        },
        include: { category: true },
      })
      // Keep exact order of selected IDs
      return ids
        .map(id => prods.find(p => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
    }

    // Fallback if no specific featured products selected
    return await prisma.product.findMany({
      where: {
        imageUrl: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { category: true },
    })
  } catch {
    return []
  }
}

async function getNewestProducts() {
  try {
    return await prisma.product.findMany({
      where: {
        imageUrl: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { category: true },
    })
  } catch {
    return []
  }
}

async function getFeatured3DProduct(productId: string) {
  try {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: { hotspots: true }
    })
  } catch {
    return null
  }
}

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
  } catch {
    return []
  }
}

export default async function Home() {
  const settings = await getSiteSettings()
  const [featuredProducts, newestProducts, posts] = await Promise.all([
    getFeaturedProducts(settings.featured_product_ids),
    getNewestProducts(),
    getLatestPosts(),
  ])

  let featured3DProduct = null
  if (settings.featured_3d_product_id) {
    featured3DProduct = await getFeatured3DProduct(settings.featured_3d_product_id)
  }

  // Default values mapping
  const hero_tagline = settings.hero_tagline || 'Gốm Sứ Mỹ Nghệ Cao Cấp'
  const hero_title_line1 = settings.hero_title_line1 || 'Tinh Hoa Đất Việt'
  const hero_title_highlight = settings.hero_title_highlight || 'Nâng Tầm'
  const hero_title_line2 = settings.hero_title_line2 || 'Không Gian'
  const hero_subtitle = settings.hero_subtitle || 'Chào mừng đến với cơ sở gốm sứ mỹ nghệ Minh Phương – Vĩnh Long.\nNhững tác phẩm gốm sứ độc bản, tinh xảo được chế tác từ bàn tay các nghệ nhân lành nghề, kết hợp công nghệ tương tác 3D đột phá.'
  const hero_bg_image = settings.hero_bg_image || '/hero_pottery_bg.png'

  const about_tagline = settings.about_tagline || 'Về Chúng Tôi'
  const about_title_line1 = settings.about_title_line1 || 'Nơi Đất Đỏ'
  const about_title_highlight = settings.about_title_highlight || 'Hóa Thành Nghệ Thuật'
  const about_paragraph1 = 'Tọa lạc bên dòng sông Cổ Chiên hiền hòa, cơ sở gốm sứ mỹ nghệ Minh Phương đã gắn bó gần 10 năm với nghề gốm truyền thống Vĩnh Long – nơi hội tụ tinh hoa làng nghề gốm đỏ vang danh Nam Bộ. Mỗi tác phẩm là sự kết tinh giữa chất đất sét trù phú, ngọn lửa nung rực cháy và bàn tay tài hoa của người nghệ nhân, cùng tâm huyết gìn giữ và nâng tầm di sản văn hóa Việt qua từng đường nét tinh xảo.'
  const about_years = settings.about_years || '9+'
  const about_image = settings.about_image || '/about_artisan.png'

  return (
    <div className="flex flex-col bg-[#F5F1EB] text-[var(--color-forest)] font-sans selection:bg-[var(--color-gold)] selection:text-[var(--color-forest)]">

      {/* ═══════════════════════════════════════════════════
          SECTION 1: HERO BANNER — Full-screen (100vh)
          ═══════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-0"
        style={{ minHeight: '100vh' }}
      >
        {/* Background Image */}
        <Image
          src={hero_bg_image}
          alt={hero_tagline}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2B2B]/75 via-[#1C2B2B]/55 to-[#1C2B2B]/85" />

        {/* Decorative blurred shapes */}
        <div className="absolute top-1/3 left-[5%] w-80 h-80 bg-[var(--color-gold)]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-[10%] w-64 h-64 bg-[#F5F1EB]/10 rounded-full blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-5 sm:space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md text-[var(--color-gold)] px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] font-accent uppercase border border-white/10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Sparkles size={13} className="sm:w-3.5 sm:h-3.5" />
            {hero_tagline}
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            {hero_title_line1} <br />
            <span className="text-[var(--color-gold)] font-light italic">{hero_title_highlight}</span>{' '}
            {hero_title_line2}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-xs sm:text-lg text-white/75 leading-relaxed font-body whitespace-pre-line animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both px-2">
            {hero_subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both w-full max-w-xs sm:max-w-none mx-auto">
            <Link href="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[var(--color-gold)] hover:bg-[var(--color-teak)] text-[var(--color-forest)] rounded-full px-6 sm:px-10 py-5 sm:py-7 text-xs sm:text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                Trải Nghiệm Sản Phẩm 3D
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>

            <Link href="/bao-gia" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-white/30 hover:border-white/60 hover:bg-white/10 text-white rounded-full px-6 sm:px-10 py-5 sm:py-7 text-xs sm:text-sm font-semibold tracking-wider font-accent uppercase transition-all backdrop-blur-sm"
              >
                Liên Hệ Nhận Báo Giá
              </Button>
            </Link>
          </div>

          {/* Quick Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-16 pt-6 sm:pt-8 border-t border-white/10 mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-700 fill-mode-both">
            {[
              { number: '9+', label: 'Năm Kinh Nghiệm' },
              { number: '100%', label: 'Chế Tác Thủ Công' },
              { number: '1000+', label: 'Khách Hàng Tin Dùng' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block text-2xl sm:text-4xl font-bold font-heading text-[var(--color-gold)]">
                  {stat.number}
                </span>
                <span className="text-[10px] sm:text-xs text-white/50 font-body tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[9px] sm:text-[10px] text-white/40 font-accent tracking-widest uppercase">Cuộn xuống</span>
          <ChevronRight size={16} className="text-white/40 rotate-90" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: VỀ CHÚNG TÔI (About Us)
          ═══════════════════════════════════════════════════ */}
      <section id="about" className="py-14 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E0DCD4]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-gold)]/20 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-[#E0DCD4]/50">
              <Image
                src={about_image}
                alt={about_title_line1}
                width={640}
                height={640}
                className="object-cover w-full h-[260px] sm:h-[420px] lg:h-[460px] transition-transform duration-700 group-hover:scale-105"
              />
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 sm:px-5 sm:py-3 shadow-lg border border-[#E0DCD4]/60">
                <span className="block text-xl sm:text-2xl font-bold font-heading text-[var(--color-teak)]">{about_years}</span>
                <span className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body">Năm Chế Tác</span>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] font-accent uppercase">
                <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-gold)]" />
                {about_tagline}
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-forest)] leading-tight">
                {about_title_line1} <br />
                <span className="text-[var(--color-teak)]">{about_title_highlight}</span>
              </h2>
            </div>

            <p className="text-sm sm:text-lg text-[var(--color-slate)] leading-relaxed font-body whitespace-pre-line">
              {about_paragraph1}
            </p>

            {/* Link Xem thêm -> /about */}
            <div className="pt-2 flex items-center">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[var(--color-forest)] hover:text-[var(--color-teak)] font-heading text-base sm:text-lg font-bold transition-colors group"
              >
                <span className="relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[var(--color-gold)] group-hover:after:bg-[var(--color-teak)] after:transition-colors">
                  Xem thêm
                </span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5 text-[var(--color-gold)] group-hover:text-[var(--color-teak)]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: 3D MODEL FEATURE SHOWCASE 
          ═══════════════════════════════════════════════════ */}
      {featured3DProduct && (featured3DProduct.model3dUrl || featured3DProduct.model3dIosUrl) && (
        <section className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--color-forest)] text-white overflow-hidden relative">
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
            {/* Left Content */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider w-fit mb-4 sm:mb-6 border border-white/10">
                <Box size={13} />
                <span>Trải Nghiệm Thực Tế Ảo AR</span>
              </div>
              
              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4 sm:mb-6 leading-tight">
                {featured3DProduct.name}
              </h2>
              
              {featured3DProduct.description && (
                <p className="text-[#D8D4CD] text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 line-clamp-4 font-light">
                  {featured3DProduct.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/products/${featured3DProduct.slug}`} className="w-full sm:w-auto">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-[var(--color-gold)] hover:bg-[#B58A3E] text-white font-medium px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-base rounded-2xl shadow-lg transition-all hover:scale-105"
                  >
                    Xem Chi Tiết Sản Phẩm
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - 3D Viewer */}
            <div className="relative order-1 lg:order-2 h-[300px] sm:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 p-2">
              <ModelViewer
                src={featured3DProduct.model3dUrl || featured3DProduct.model3dIosUrl || ''}
                iosSrc={featured3DProduct.model3dIosUrl || undefined}
                alt={featured3DProduct.name}
                hotspots={featured3DProduct.hotspots || []}
              />
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 4: SẢN PHẨM NỔI BẬT (Featured Products)
          ═══════════════════════════════════════════════════ */}
      <section id="featured-products" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F5F1EB] to-[#EDE9E0]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] font-accent uppercase">
              <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-gold)]" />
              Bộ Sưu Tập Nổi Bật
              <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-gold)]" />
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[var(--color-forest)]">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-[var(--color-slate)] font-body text-xs sm:text-sm max-w-lg mx-auto">
              Khám phá những tác phẩm gốm sứ được chọn lọc kỹ lưỡng, mỗi sản phẩm là một câu chuyện về nghệ thuật và tâm huyết.
            </p>
          </div>

          {/* Products Grid — Slightly smaller cards */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E0DCD4]/60 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-[16/11] bg-[#F5F1EB]">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={32} className="text-[#D8D4CC] sm:w-10 sm:h-10" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B2B]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category badge */}
                    {product.category && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-md text-[var(--color-teak)] text-[9px] sm:text-[10px] font-semibold tracking-wider font-accent uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#E0DCD4]/60">
                        {product.category.name}
                      </div>
                    )}

                    {/* 360° Button — appears on hover */}
                    {product.model3dUrl && (
                      <Link
                        href={`/products/${product.slug}`}
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 bg-[var(--color-gold)] text-[var(--color-forest)] text-[9px] sm:text-xs font-semibold font-accent tracking-wider px-2 py-1 sm:px-3 sm:py-2 rounded-full opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-md hover:bg-[var(--color-teak)] hover:text-white"
                      >
                        <RotateCcw size={11} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Xem Xoay 360°</span>
                        <span className="sm:hidden">360°</span>
                      </Link>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4.5 space-y-1 sm:space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-xs sm:text-base font-bold text-[var(--color-forest)] group-hover:text-[var(--color-teak)] transition-colors duration-300 line-clamp-2 sm:line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-1 text-[10px] sm:text-xs text-[var(--color-slate)] font-body line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[var(--color-teak)] hover:text-[var(--color-forest)] transition-colors font-accent pt-1 sm:pt-2 group/link"
                    >
                      Xem Chi Tiết
                      <ArrowRight size={11} className="sm:w-3 sm:h-3 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-[#D8D4CC] mb-3" />
              <p className="text-[var(--color-slate)] font-body text-sm">Sản phẩm nổi bật đang được cập nhật, vui lòng quay lại sau.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: SẢN PHẨM MỚI (Sản phẩm nhỏ nhắn, gọn gàng)
          ═══════════════════════════════════════════════════ */}
      <section id="new-products" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#EDE9E0]/50 border-t border-[#E0DCD4]/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] font-accent uppercase">
              <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-gold)]" />
              Mới Ra Mắt
              <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-gold)]" />
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[var(--color-forest)]">
              Sản Phẩm Mới
            </h2>
            <p className="text-[var(--color-slate)] font-body text-xs sm:text-sm max-w-lg mx-auto">
              Cập nhật các mẫu gốm sứ mới nhất vừa được tạo tác từ cơ sở Minh Phương.
            </p>
          </div>

          {/* 2 cards per row on Mobile, 3 cards on Desktop */}
          {newestProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              {newestProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E0DCD4]/60 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-[16/11] bg-[#F5F1EB]">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={32} className="text-[#D8D4CC] sm:w-10 sm:h-10" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B2B]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category & New Badges */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1">
                      {product.category && (
                        <div className="bg-white/90 backdrop-blur-md text-[var(--color-teak)] text-[9px] sm:text-[10px] font-semibold tracking-wider font-accent uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#E0DCD4]/60">
                          {product.category.name}
                        </div>
                      )}
                      <div className="bg-[var(--color-gold)] text-[var(--color-forest)] text-[9px] sm:text-[10px] font-bold tracking-wider font-accent uppercase px-2 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm">
                        Mới
                      </div>
                    </div>

                    {/* 360° Button — appears on hover */}
                    {product.model3dUrl && (
                      <Link
                        href={`/products/${product.slug}`}
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 bg-[var(--color-gold)] text-[var(--color-forest)] text-[9px] sm:text-xs font-semibold font-accent tracking-wider px-2 py-1 sm:px-3 sm:py-2 rounded-full opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-md hover:bg-[var(--color-teak)] hover:text-white"
                      >
                        <RotateCcw size={11} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Xem Xoay 360°</span>
                        <span className="sm:hidden">360°</span>
                      </Link>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4.5 space-y-1 sm:space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-xs sm:text-base font-bold text-[var(--color-forest)] group-hover:text-[var(--color-teak)] transition-colors duration-300 line-clamp-2 sm:line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-1 text-[10px] sm:text-xs text-[var(--color-slate)] font-body line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[var(--color-teak)] hover:text-[var(--color-forest)] transition-colors font-accent pt-1 sm:pt-2 group/link"
                    >
                      Xem Chi Tiết
                      <ArrowRight size={11} className="sm:w-3 sm:h-3 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-[#D8D4CC] mb-3" />
              <p className="text-[var(--color-slate)] font-body text-sm">Chưa có sản phẩm mới nào.</p>
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-[var(--color-forest)] hover:bg-[var(--color-teak)] text-[#F5F1EB] rounded-full px-6 sm:px-8 py-4 sm:py-5 text-xs font-semibold tracking-wider font-accent uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Xem Tất Cả Sản Phẩm
                <ArrowRight size={15} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: TIN TỨC MỚI NHẤT (Thẻ bài viết nhỏ nhắn hơn)
          ═══════════════════════════════════════════════════ */}
      <section id="blog-insights" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E0DCD4]/40">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-6 mb-8 sm:mb-12">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] font-accent uppercase">
                <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-gold)]" />
                Góc Chia Sẻ
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[var(--color-forest)]">
                Tin Tức & Bài Viết
              </h2>
              <p className="text-[var(--color-slate)] font-body text-xs sm:text-sm max-w-lg">
                Cập nhật những câu chuyện thú vị về nghề gốm, hướng dẫn chọn sản phẩm và tin tức mới nhất.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--color-teak)] hover:text-[var(--color-forest)] transition-colors font-accent group flex-shrink-0"
            >
              Xem Tất Cả Bài Viết
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Posts Grid — 2 cards per row on Mobile, 3 cards on md+ */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full"
                >
                  <article className="flex flex-col h-full bg-[#F5F1EB]/40 rounded-xl sm:rounded-2xl overflow-hidden border border-[#E0DCD4]/40 hover:border-[var(--color-gold)]/40 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1">
                    {/* Post Cover Image — 16/9 aspect ratio */}
                    <div className="relative overflow-hidden aspect-[16/9] bg-[#EDE9E0]">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E8E4DC] to-[#D8D4CC]">
                          <Sparkles size={20} className="text-[var(--color-gold)]/60 sm:w-6 sm:h-6" />
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-3 sm:p-4.5 flex flex-col flex-grow justify-between space-y-2">
                      <div className="space-y-1.5">
                        {/* Date */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[var(--color-slate)] font-body">
                          <CalendarDays size={11} className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-xs sm:text-base font-bold text-[var(--color-forest)] group-hover:text-[var(--color-teak)] transition-colors duration-300 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                      </div>

                      {/* Read more */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[var(--color-teak)] font-accent pt-1 mt-auto">
                        Đọc tiếp
                        <ChevronRight size={11} className="sm:w-3 sm:h-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F5F1EB]/30 rounded-xl border border-[#E0DCD4]/30">
              <Sparkles size={40} className="mx-auto text-[#D8D4CC] mb-3" />
              <p className="text-[var(--color-slate)] font-body text-sm">Bài viết đang được cập nhật, hãy quay lại sớm nhé!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
