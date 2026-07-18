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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { getSiteSettings } from '@/app/admin/settings/actions'
import ModelViewer from '@/components/ModelViewer'

async function getFeaturedProducts() {
  try {
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
  const [products, posts, settings] = await Promise.all([
    getFeaturedProducts(),
    getLatestPosts(),
    getSiteSettings(),
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
  const about_paragraph1 = settings.about_paragraph1 || 'Tọa lạc bên dòng sông Cổ Chiên hiền hòa, cơ sở gốm sứ mỹ nghệ Minh Phương đã gắn bó gần 10 năm với nghề gốm truyền thống Vĩnh Long. Mỗi sản phẩm là kết tinh từ chất đất trù phú, bàn tay khéo léo của nghệ nhân và tâm huyết lưu giữ tinh hoa văn hóa đất Việt.'
  const about_paragraph2 = settings.about_paragraph2 || 'Chúng tôi không chỉ tạo ra sản phẩm – chúng tôi gìn giữ câu chuyện của đất, của lửa, của con người Vĩnh Long qua từng đường nét hoa văn tinh xảo.'
  const about_years = settings.about_years || '9+'
  const about_image = settings.about_image || '/about_artisan.png'

  return (
    <div className="flex flex-col bg-[#F5F1EB] text-[var(--color-forest)] font-sans selection:bg-[var(--color-gold)] selection:text-[var(--color-forest)]">

      {/* ═══════════════════════════════════════════════════
          SECTION 1: HERO BANNER — Full-screen (100vh)
          ═══════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2B2B]/70 via-[#1C2B2B]/50 to-[#1C2B2B]/80" />

        {/* Decorative blurred shapes */}
        <div className="absolute top-1/3 left-[5%] w-80 h-80 bg-[var(--color-gold)]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-[10%] w-64 h-64 bg-[#F5F1EB]/10 rounded-full blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-[var(--color-gold)] px-5 py-2 rounded-full text-xs font-semibold tracking-[0.2em] font-accent uppercase border border-white/10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Sparkles size={14} />
            {hero_tagline}
          </div>

          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            {hero_title_line1} <br />
            <span className="text-[var(--color-gold)] font-light italic">{hero_title_highlight}</span>{' '}
            {hero_title_line2}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed font-body whitespace-pre-line animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
            {hero_subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[var(--color-gold)] hover:bg-[var(--color-teak)] text-[var(--color-forest)] rounded-full px-10 py-7 text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                Trải Nghiệm Sản Phẩm 3D
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>

            <Link href="/bao-gia">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-white/30 hover:border-white/60 hover:bg-white/10 text-white rounded-full px-10 py-7 text-sm font-semibold tracking-wider font-accent uppercase transition-all backdrop-blur-sm"
              >
                Liên Hệ Nhận Báo Giá
              </Button>
            </Link>
          </div>

          {/* Quick Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 pt-8 border-t border-white/10 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-700 fill-mode-both">
            {[
              { number: '9+', label: 'Năm Kinh Nghiệm' },
              { number: '100%', label: 'Chế Tác Thủ Công' },
              { number: '1000+', label: 'Khách Hàng Tin Dùng' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block text-3xl sm:text-4xl font-bold font-heading text-[var(--color-gold)]">
                  {stat.number}
                </span>
                <span className="text-xs text-white/50 font-body tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] text-white/40 font-accent tracking-widest uppercase">Cuộn xuống</span>
          <ChevronRight size={18} className="text-white/40 rotate-90" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: VỀ CHÚNG TÔI (About Us)
          ═══════════════════════════════════════════════════ */}
      <section id="about" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E0DCD4]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-gold)]/20 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-[#E0DCD4]/50">
              <Image
                src={about_image}
                alt={about_title_line1}
                width={640}
                height={640}
                className="object-cover w-full h-[400px] lg:h-[520px] transition-transform duration-700 group-hover:scale-105"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-xl px-5 py-3 shadow-lg border border-[#E0DCD4]/60">
                <span className="block text-2xl font-bold font-heading text-[var(--color-teak)]">{about_years}</span>
                <span className="text-xs text-[var(--color-slate)] font-body">Năm Chế Tác</span>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs font-semibold tracking-[0.2em] font-accent uppercase">
                <span className="w-8 h-[2px] bg-[var(--color-gold)]" />
                {about_tagline}
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-forest)] leading-tight">
                {about_title_line1} <br />
                <span className="text-[var(--color-teak)]">{about_title_highlight}</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[var(--color-slate)] leading-relaxed font-body whitespace-pre-line">
              {about_paragraph1}
            </p>
            <p className="text-base text-[var(--color-slate)] leading-relaxed font-body whitespace-pre-line">
              {about_paragraph2}
            </p>

            {/* Value pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { icon: ShieldCheck, title: 'Chất Lượng Thượng Hạng', desc: 'Đất sét chọn lọc, quy trình nung chuẩn cao.' },
                { icon: Compass, title: 'Bản Sắc Truyền Thống', desc: 'Gìn giữ văn hóa gốm đỏ Vĩnh Long.' },
                { icon: Sparkles, title: 'Tương Tác 3D Trực Quan', desc: 'Xem mô hình 3D thực tế trước khi đặt mua.' },
                { icon: HeartHandshake, title: 'Độc Bản & Cá Nhân Hóa', desc: 'Chế tác theo yêu cầu riêng của bạn.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-[#F5F1EB]/50 border border-[#E0DCD4]/30 hover:border-[var(--color-gold)]/40 hover:bg-[#FBF8F2] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-forest)]/10 flex items-center justify-center text-[var(--color-teak)] flex-shrink-0 mt-0.5">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[var(--color-forest)]">{item.title}</h4>
                    <p className="text-xs text-[var(--color-slate)] mt-0.5 font-body leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: TRẢI NGHIỆM 3D (Interactive 3D)
          ═══════════════════════════════════════════════════ */}
      {featured3DProduct && featured3DProduct.model3dUrl && (
        <section id="interactive-3d" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#1C2B2B] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 text-[var(--color-gold)] text-xs font-semibold tracking-[0.2em] font-accent uppercase">
                  <span className="w-8 h-[2px] bg-[var(--color-gold)]" />
                  Trải Nghiệm Trực Quan
                </span>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight">
                  Khám Phá Chi Tiết <br />
                  <span className="text-[var(--color-gold)]">360 Độ</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed font-body whitespace-pre-line">
                Tương tác trực tiếp với sản phẩm <strong className="text-white font-medium">{featured3DProduct.name}</strong>. Xoay, thu phóng và khám phá từng đường nét hoa văn tinh xảo được chế tác thủ công bởi các nghệ nhân.
              </p>
              
              <div className="pt-4">
                <Link href={`/products/${featured3DProduct.slug}`}>
                  <Button
                    size="lg"
                    className="bg-[var(--color-gold)] hover:bg-[var(--color-teak)] text-[var(--color-forest)] rounded-full px-8 py-6 text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    Xem Chi Tiết Sản Phẩm
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - 3D Viewer */}
            <div className="relative order-1 lg:order-2 h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 p-2">
              <ModelViewer
                src={featured3DProduct.model3dUrl}
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
      <section id="featured-products" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F5F1EB] to-[#EDE9E0]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs font-semibold tracking-[0.2em] font-accent uppercase">
              <span className="w-8 h-[2px] bg-[var(--color-gold)]" />
              Bộ Sưu Tập
              <span className="w-8 h-[2px] bg-[var(--color-gold)]" />
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-forest)]">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-[var(--color-slate)] font-body text-base max-w-xl mx-auto">
              Khám phá những tác phẩm gốm sứ được chọn lọc kỹ lưỡng, mỗi sản phẩm là một câu chuyện về nghệ thuật và tâm huyết.
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E0DCD4]/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#F5F1EB]">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={48} className="text-[#D8D4CC]" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B2B]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category badge */}
                    {product.category && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md text-[var(--color-teak)] text-[9px] sm:text-[10px] font-semibold tracking-wider font-accent uppercase px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#E0DCD4]/60">
                        {product.category.name}
                      </div>
                    )}

                    {/* 360° Button — appears on hover */}
                    {product.model3dUrl && (
                      <Link
                        href={`/products/${product.slug}`}
                        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex items-center gap-1.5 bg-[var(--color-gold)] text-[var(--color-forest)] text-[9px] sm:text-xs font-semibold font-accent tracking-wider px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg hover:bg-[var(--color-teak)] hover:text-white"
                      >
                        <RotateCcw size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Xem Xoay 360°</span>
                        <span className="sm:hidden">360°</span>
                      </Link>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-6 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-sm sm:text-xl font-bold text-[var(--color-forest)] group-hover:text-[var(--color-teak)] transition-colors duration-300 line-clamp-2 sm:line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm text-[var(--color-slate)] font-body line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-[11px] sm:text-sm font-semibold text-[var(--color-teak)] hover:text-[var(--color-forest)] transition-colors font-accent pt-1 sm:pt-2 group/link"
                    >
                      Xem Chi Tiết
                      <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package size={56} className="mx-auto text-[#D8D4CC] mb-4" />
              <p className="text-[var(--color-slate)] font-body">Sản phẩm đang được cập nhật, vui lòng quay lại sau.</p>
            </div>
          )}

          {/* View All CTA */}
          {products.length > 0 && (
            <div className="text-center mt-14">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-[var(--color-forest)] hover:bg-[var(--color-teak)] text-[#F5F1EB] rounded-full px-10 py-6 text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  Xem Tất Cả Sản Phẩm
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: TIN TỨC MỚI NHẤT (Blog Insights)
          ═══════════════════════════════════════════════════ */}
      <section id="blog-insights" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E0DCD4]/40">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs font-semibold tracking-[0.2em] font-accent uppercase">
                <span className="w-8 h-[2px] bg-[var(--color-gold)]" />
                Góc Chia Sẻ
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-forest)]">
                Tin Tức & Bài Viết
              </h2>
              <p className="text-[var(--color-slate)] font-body text-base max-w-lg">
                Cập nhật những câu chuyện thú vị về nghề gốm, hướng dẫn chọn sản phẩm và tin tức mới nhất.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-teak)] hover:text-[var(--color-forest)] transition-colors font-accent group flex-shrink-0"
            >
              Xem Tất Cả Bài Viết
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-[#F5F1EB]/40 rounded-2xl overflow-hidden border border-[#E0DCD4]/40 hover:border-[var(--color-gold)]/40 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                    {/* Post Cover Image */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-[#EDE9E0]">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E8E4DC] to-[#D8D4CC]">
                          <Sparkles size={32} className="text-[var(--color-gold)]/60" />
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-6 space-y-3">
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-slate)] font-body">
                        <CalendarDays size={12} />
                        {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg font-bold text-[var(--color-forest)] group-hover:text-[var(--color-teak)] transition-colors duration-300 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Read more */}
                      <div className="flex items-center gap-1 text-sm font-semibold text-[var(--color-teak)] font-accent pt-1">
                        Đọc tiếp
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F5F1EB]/30 rounded-2xl border border-[#E0DCD4]/30">
              <Sparkles size={48} className="mx-auto text-[#D8D4CC] mb-4" />
              <p className="text-[var(--color-slate)] font-body">Bài viết đang được cập nhật, hãy quay lại sớm nhé!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
