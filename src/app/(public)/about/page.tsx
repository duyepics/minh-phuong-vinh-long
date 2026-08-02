import Image from 'next/image'
import Link from 'next/link'
import {
  Home,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Box,
  Eye,
  Award,
  Users,
  Compass,
  HeartHandshake,
  FileCheck,
  Star,
  Medal,
  ChevronRight,
  Palette,
  Hammer,
  Cpu,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Giới Thiệu | Gốm Sứ Minh Phương Vĩnh Long',
  description:
    'Khám phá câu chuyện thương hiệu Gốm Sứ Minh Phương Vĩnh Long - Hành trình gìn giữ di sản làng nghề Mang Thít và tiên phong đổi mới công nghệ 3D/AR.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[#F5F1EB] text-[var(--color-forest)] font-sans selection:bg-[var(--color-gold)] selection:text-[var(--color-forest)] overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════
          BREADCRUMB
          ═══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <nav className="flex text-xs sm:text-sm font-medium" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-[var(--color-forest)]/70 hover:text-[var(--color-gold)] transition-colors">
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <span className="ml-1 md:ml-2 text-[var(--color-forest)] font-semibold">Giới thiệu</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 1: TIÊU ĐỀ VÀ TÓM TẮT NGẮN GỌN (HERO BANNER)
          ═══════════════════════════════════════════════════ */}
      <section className="relative pt-4 sm:pt-8 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#EAE3D2] text-[var(--color-teak)] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold tracking-widest font-accent uppercase border border-[var(--color-gold)]/30 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-75 fill-mode-both">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-gold)] animate-pulse shrink-0" />
              <span className="truncate">Gốm Sứ Mỹ Nghệ Minh Phương Vĩnh Long</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-7xl font-bold leading-[1.18] sm:leading-[1.15] tracking-tight text-[var(--color-forest)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
              Giữ Gìn Tinh Hoa Truyền Thống <br className="hidden xs:inline" />
              <span className="text-[var(--color-teak)]">Đột Phá Với Công Nghệ Tương Lai</span>
            </h1>

            <p className="text-base sm:text-xl text-[var(--color-slate)] leading-relaxed font-body max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              Cơ sở gốm sứ mỹ nghệ Minh Phương tự hào tọa lạc tại vương quốc lò gốm Mang Thít bên dòng sông Cổ Chiên hiền hòa. Chúng tôi không chỉ chế tác những dòng gốm đỏ độc bản mà còn tiên phong kết hợp di sản văn hóa đất nung với công nghệ trải nghiệm số hóa 3D/AR hiện đại.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[var(--color-forest)] hover:bg-[var(--color-teak)] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <span>Khám Phá Sản Phẩm 3D</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="#brand-story" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border-[#E0DCD4] hover:border-[var(--color-gold)] hover:bg-white text-[var(--color-forest)] rounded-full px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 hover:-translate-y-0.5"
                >
                  Tìm Hiểu Câu Chuyện
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
            <div className="relative w-full h-[280px] xs:h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 sm:border-4 border-white group">
              <Image
                src="/song_cochien.jpg"
                alt="Lò Gốm Mang Thít Vĩnh Long - Gốm Sứ Minh Phương"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-80 transition-opacity duration-500" />

              {/* Slogan Banner Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white/40 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--color-gold)]/20 text-[var(--color-teak)] flex items-center justify-center font-bold text-lg sm:text-2xl shrink-0">
                    <Flame className="w-4 h-4 sm:w-6 sm:h-6 text-[var(--color-gold)] animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[var(--color-forest)] text-xs sm:text-base">Hồn Đất Mang Thít</h4>
                    <p className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body leading-tight">Di sản gốm đỏ nung lửa bên dòng Cổ Chiên</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 2: CÂU CHUYỆN THƯƠNG HIỆU (BRAND STORY)
          ═══════════════════════════════════════════════════ */}
      <section id="brand-story" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E0DCD4]/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Story Images Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              <div className="relative h-48 xs:h-60 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src="/2binhgom.jpg"
                  alt="Xưởng chế tác gốm Minh Phương"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="relative h-48 xs:h-60 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-md translate-y-3 sm:translate-y-6 group">
                <Image
                  src="/nghenhan.jpg"
                  alt="Nghệ nhân vuốt gốm thủ công"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:pl-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <span className="inline-flex items-center gap-2 sm:gap-3 text-[var(--color-teak)] text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] font-accent uppercase">
                <span className="w-8 sm:w-12 h-[2px] bg-[var(--color-gold)]" />
                Câu Chuyện Thương Hiệu
              </span>

              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-forest)] leading-tight">
                Sinh Ra Từ Vương Quốc Gốm Đỏ Mang Thít
              </h2>

              <div className="space-y-3 sm:space-y-4 text-[var(--color-slate)] font-body text-sm sm:text-lg leading-relaxed">
                <p>
                  Được thành lập từ năm <strong className="text-[var(--color-forest)] font-semibold">2017</strong>, cơ sở gốm sứ mỹ nghệ Minh Phương bắt nguồn ngay tại trái tim của làng nghề gốm Mang Thít, Vĩnh Long — vùng đất huyền thoại được mệnh danh là <em>"Vương quốc lò gốm đỏ"</em> lớn nhất Miền Tây Nam Bộ.
                </p>
                <p>
                  Cảm hứng sáng lập của chúng tôi khởi nguồn từ tình yêu sâu sắc với dải đất sét đỏ phù sa mịn màng ven sông Cổ Chiên và niềm tự hào bảo tồn di sản trăm năm. Trăn trở trước nguy cơ mai một của các làng nghề truyền thống, những người sáng lập Minh Phương đã quyết tâm xây dựng một thương hiệu không chỉ giữ tròn bản sắc thủ công tinh xảo mà còn đủ sức vươn xa, tiệm cận xu hướng công nghệ hiện đại thế giới.
                </p>
              </div>

              {/* Key Milestones Pill Container */}
              <div className="pt-3 sm:pt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 border-t border-[#E0DCD4]/60">
                <div className="bg-[#FBF8F2] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E0DCD4]/40 hover:border-[var(--color-gold)] hover:-translate-y-1 transition-all duration-300">
                  <span className="block text-xl sm:text-2xl font-bold font-heading text-[var(--color-teak)]">2017</span>
                  <span className="text-[11px] sm:text-xs text-[var(--color-slate)] font-body">Khởi nguồn Mang Thít</span>
                </div>
                <div className="bg-[#FBF8F2] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E0DCD4]/40 hover:border-[var(--color-gold)] hover:-translate-y-1 transition-all duration-300">
                  <span className="block text-xl sm:text-2xl font-bold font-heading text-[var(--color-teak)]">100%</span>
                  <span className="text-[11px] sm:text-xs text-[var(--color-slate)] font-body">Thủ công tự nhiên</span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-[#FBF8F2] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E0DCD4]/40 hover:border-[var(--color-gold)] hover:-translate-y-1 transition-all duration-300">
                  <span className="block text-xl sm:text-2xl font-bold font-heading text-[var(--color-teak)]">3D & AR</span>
                  <span className="text-[11px] sm:text-xs text-[var(--color-slate)] font-body">Tiên phong số hóa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 3: TẦM NHÌN & SỨ MỆNH (VISION & MISSION)
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FBF8F2]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs sm:text-sm font-semibold tracking-widest font-accent uppercase">
              <Compass className="w-4 h-4 text-[var(--color-gold)]" />
              Định Hướng Chiến Lược
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[var(--color-forest)]">
              Tầm Nhìn & Sứ Mệnh
            </h2>
            <p className="text-[var(--color-slate)] font-body text-sm sm:text-lg">
              Kim chỉ nam cho mọi bước tiến trong hành trình khẳng định vị thế gốm sứ mỹ nghệ Việt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Tầm Nhìn Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E0DCD4]/70 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[var(--color-forest)] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-gold)]" />
              </div>
              <h3 className="font-heading text-xl sm:text-3xl font-bold text-[var(--color-forest)] mb-3 sm:mb-4">
                Tầm Nhìn (Vision)
              </h3>
              <p className="text-[var(--color-slate)] font-body leading-relaxed text-sm sm:text-lg">
                Trở thành thương hiệu gốm sứ mỹ nghệ hàng đầu Việt Nam, tiên phong kết hợp di sản văn hóa gốm nung Mang Thít với công nghệ số hóa 3D/AR, mang giá trị nghệ thuật truyền thống Nam Bộ vươn tầm thế giới.
              </p>
            </div>

            {/* Sứ Mệnh Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E0DCD4]/70 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-teak)]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[var(--color-teak)] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl sm:text-3xl font-bold text-[var(--color-forest)] mb-3 sm:mb-4">
                Sứ Mệnh (Mission)
              </h3>
              <ul className="space-y-2.5 sm:space-y-3 text-[var(--color-slate)] font-body text-xs sm:text-base">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
                  <span><strong>Sản phẩm tuyệt hảo:</strong> Cung cấp gốm sứ thủ công bền đẹp, men màu độc bản.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
                  <span><strong>Bảo tồn văn hóa:</strong> Giữ gìn ngọn lửa làng nghề Mang Thít & vinh danh nghệ nhân.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
                  <span><strong>Nâng tầm trải nghiệm:</strong> Giúp khách hàng xem chi tiết sản phẩm 3D mọi lúc, mọi nơi.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 4: GIÁ TRỊ CỐT LÕI (CORE VALUES)
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E0DCD4]/60">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs sm:text-sm font-semibold tracking-widest font-accent uppercase">
              <Star className="w-4 h-4 text-[var(--color-gold)]" />
              Nền Tảng Phát Triển
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[var(--color-forest)]">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-[var(--color-slate)] font-body text-sm sm:text-lg">
              Ba trụ cột tạo nên sức mạnh và uy tín vững chắc của thương hiệu Gốm Sứ Minh Phương.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* Value 1: Chất Lượng */}
            <div className="bg-[#F5F1EB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#E0DCD4]/60 hover:border-[var(--color-gold)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-[var(--color-teak)] group-hover:bg-[var(--color-teak)] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-forest)]">
                  Chất Lượng Thật
                </h3>
                <p className="text-[var(--color-slate)] font-body leading-relaxed text-xs sm:text-base">
                  Nguyên liệu đất sét đỏ tự nhiên trù phú được tuyển chọn kỹ lưỡng, quy trình nung đạt chuẩn nhiệt độ khắt khe cho sắc đỏ kiệt tác và độ bền thách thức thời gian.
                </p>
              </div>
              <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E0DCD4]/60 text-[10px] sm:text-xs font-accent uppercase tracking-wider text-[var(--color-teak)] font-bold">
                Đất sét chuẩn • Men độc bản
              </div>
            </div>

            {/* Value 2: Thủ Công (Craftsmanship) */}
            <div className="bg-[#F5F1EB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#E0DCD4]/60 hover:border-[var(--color-gold)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8 duration-700 delay-250 fill-mode-both">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-[var(--color-teak)] group-hover:bg-[var(--color-teak)] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <Hammer className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-forest)]">
                  Nghệ Thuật Thủ Công
                </h3>
                <p className="text-[var(--color-slate)] font-body leading-relaxed text-xs sm:text-base">
                  Mỗi tác phẩm là sự kết tinh từ đôi bàn tay tài hoa của các nghệ nhân làng nghề Mang Thít lâu năm. Mỗi sản phẩm sở hữu hoa văn và hồn cốt độc bản.
                </p>
              </div>
              <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E0DCD4]/60 text-[10px] sm:text-xs font-accent uppercase tracking-wider text-[var(--color-teak)] font-bold">
                Vuốt gốm tỉ mỉ • Thần thái riêng
              </div>
            </div>

            {/* Value 3: Đổi Mới (Innovation) - Highlight Đồ Án */}
            <div className="bg-[var(--color-forest)] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[var(--color-forest)] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400 fill-mode-both">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--color-gold)]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="space-y-3 sm:space-y-4 relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[var(--color-gold)] group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                </div>
                <div className="inline-block bg-[var(--color-gold)] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full font-accent uppercase shadow-sm">
                  Đột phá Đồ án 3D/AR
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Đổi Mới Công Nghệ
                </h3>
                <p className="text-white/80 font-body leading-relaxed text-xs sm:text-base">
                  Tiên phong ứng dụng mô hình 3D tương tác và thực tế ảo AR ngay trên trình duyệt. Cho phép khách hàng xoay 360°, soi từng góc cạnh và chi tiết hoa văn bình gốm trước khi đưa ra quyết định mua hàng.
                </p>
              </div>
              <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20 text-[10px] sm:text-xs font-accent uppercase tracking-wider text-[var(--color-gold)] font-bold relative z-10 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Trải nghiệm 3D thực tế
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 5: QUY TRÌNH CHẾ TÁC & TÔN VINH NGHỆ NHÂN
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-[#E0DCD4]/80 pb-6 sm:pb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-2 sm:space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs sm:text-sm font-semibold tracking-widest font-accent uppercase">
                <Palette className="w-4 h-4 text-[var(--color-gold)]" />
                Quy Trình Nghiêm Ngặt
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[var(--color-forest)]">
                Quy Trình Chế Tác & Tôn Vinh Nghệ Nhân
              </h2>
            </div>
            <p className="text-[var(--color-slate)] font-body text-xs sm:text-base max-w-md">
              Sự giao thoa hoàn hảo giữa nguyên liệu phù sa sông Cổ Chiên, kỹ thuật vuốt gốm tài hoa và ngọn lửa nung truyền thống.
            </p>
          </div>

          {/* 4 Process Steps - 2 columns on mobile for better scanning */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { step: '01', title: 'Tuyển Chọn Đất Sét', desc: 'Đất sét đỏ phù sa sông Cổ Chiên được lọc bùn, nhào kỹ để đạt độ dẻo mịn tuyệt đối.', delay: 'delay-100' },
              { step: '02', title: 'Tạo Hình Thủ Công', desc: 'Nghệ nhân dùng bàn xoay và bàn tay tài hoa để định hình phom dáng bình gốm.', delay: 'delay-200' },
              { step: '03', title: 'Tráng Men & Chạm Khắc', desc: 'Chạm khắc hoa văn tinh xảo và khoác lên lớp men truyền thống màu sắc tự nhiên.', delay: 'delay-300' },
              { step: '04', title: 'Nung Lò Khắt Khe', desc: 'Nung trong lò nung đạt chuẩn nhiệt độ nghìn độ C để cho ra sắc đỏ gạch bền bỉ.', delay: 'delay-400' },
            ].map((st) => (
              <div
                key={st.step}
                className={`bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#E0DCD4]/70 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[var(--color-gold)] transition-all duration-300 relative group animate-in fade-in slide-in-from-bottom-8 duration-700 ${st.delay} fill-mode-both`}
              >
                <span className="text-2xl sm:text-4xl font-bold font-heading text-[var(--color-gold)] opacity-40 group-hover:opacity-100 transition-opacity duration-300 block mb-1 sm:mb-2">{st.step}</span>
                <h4 className="font-heading font-bold text-sm sm:text-xl text-[var(--color-forest)] mb-1 sm:mb-2">{st.title}</h4>
                <p className="text-[11px] sm:text-sm text-[var(--color-slate)] font-body leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Artisan Honor Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E0DCD4]/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
            <div className="lg:col-span-5 relative h-60 xs:h-72 sm:h-80 lg:h-full min-h-[250px] sm:min-h-[350px] group">
              <Image
                src="/lonung.jpg"
                alt="Nghệ nhân vuốt gốm Minh Phương"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            </div>
            <div className="lg:col-span-7 p-6 sm:p-12 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#EAE3D2] text-[var(--color-teak)] px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Tôn Vinh Bàn Tay Vàng
              </div>
              <h3 className="font-heading text-xl sm:text-4xl font-bold text-[var(--color-forest)] leading-tight">
                "Mỗi Tác Phẩm Là Một Phần Tâm Hồn Nghệ Nhân"
              </h3>
              <p className="text-[var(--color-slate)] font-body text-xs sm:text-lg leading-relaxed">
                Tại cơ sở Minh Phương, chúng tôi tin rằng máy móc không bao giờ thay thế được nhịp thở và tâm huyết của người nghệ nhân. Những nét vuốt, đường viền hoa văn đều mang câu chuyện cuộc đời và tình yêu mãnh liệt với ngọn lửa di sản gốm đỏ Vĩnh Long.
              </p>
              <div className="pt-2 flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-gold)]/20 text-[var(--color-teak)] flex items-center justify-center font-bold text-xs sm:text-base shrink-0">
                  ★
                </div>
                <div>
                  <h5 className="font-heading font-bold text-[var(--color-forest)] text-xs sm:text-sm">Đội Nguồn Nghệ Nhân Mang Thít</h5>
                  <p className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body">Hơn 20+ năm kinh nghiệm chế tác thủ công</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 6: THÀNH TỰU HOẶC CHỨNG NHẬN (CERTIFICATES)
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E0DCD4]/60">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <span className="inline-flex items-center gap-2 text-[var(--color-teak)] text-xs sm:text-sm font-semibold tracking-widest font-accent uppercase">
              <Award className="w-4 h-4 text-[var(--color-gold)]" />
              Uy Tín & Tiêu Chuẩn
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[var(--color-forest)]">
              Thành Tựu & Chứng Nhận Chất Lượng
            </h2>
            <p className="text-[var(--color-slate)] font-body text-xs sm:text-lg">
              Sự ghi nhận uy tín và các tiêu chuẩn chất lượng nghiêm ngặt mà Gốm Sứ Minh Phương luôn cam kết.
            </p>
          </div>

          {/* 2x2 grid on mobile for compact layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Cert 1: OCOP 4 sao */}
            <div className="bg-[#FBF8F2] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E0DCD4]/70 text-center space-y-2.5 sm:space-y-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gold)]/15 text-[var(--color-gold)] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-[var(--color-gold)]" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-xl text-[var(--color-forest)]">OCOP 4 Sao</h4>
              <p className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body leading-relaxed">
                Chứng nhận sản phẩm tiêu biểu đặc trưng tỉnh Vĩnh Long.
              </p>
            </div>

            {/* Cert 2: ISO 9001 */}
            <div className="bg-[#FBF8F2] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E0DCD4]/70 text-center space-y-2.5 sm:space-y-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-forest)]/10 text-[var(--color-forest)] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <FileCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-xl text-[var(--color-forest)]">ISO 9001:2015</h4>
              <p className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body leading-relaxed">
                Hệ thống quản lý quy trình sản xuất & nung chuyên nghiệp.
              </p>
            </div>

            {/* Cert 3: Thương hiệu làng nghề */}
            <div className="bg-[#FBF8F2] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E0DCD4]/70 text-center space-y-2.5 sm:space-y-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-teak)]/15 text-[var(--color-teak)] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Medal className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-xl text-[var(--color-forest)]">Làng Nghề Tiêu Biểu</h4>
              <p className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body leading-relaxed">
                Vinh danh doanh nghiệp bảo tồn di sản Mang Thít.
              </p>
            </div>

            {/* Cert 4: Tiêu chuẩn xuất khẩu */}
            <div className="bg-[#FBF8F2] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E0DCD4]/70 text-center space-y-2.5 sm:space-y-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400 fill-mode-both">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gold)]/15 text-[var(--color-teak)] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-xl text-[var(--color-forest)]">Chuẩn Xuất Khẩu</h4>
              <p className="text-[10px] sm:text-xs text-[var(--color-slate)] font-body leading-relaxed">
                Đạt tiêu chuẩn an toàn vật liệu, độ bền chịu nhiệt cao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHÂN ĐOẠN 7: LỜI KÊU GỌI HÀNH ĐỘNG (CALL TO ACTION - CTA)
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F1EB]">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[var(--color-forest)] via-[#162424] to-[var(--color-teak)] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-16 text-center text-white border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-700 delay-200 fill-mode-both">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-gold)]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5 sm:space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] border border-white/20 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Trải Nghiệm Độc Bản Ngay Hôm Nay
            </div>

            <h2 className="font-heading text-2xl sm:text-5xl font-bold leading-tight">
              Sẵn Sàng Nâng Tầm Không Gian Sống Với Gốm Đỏ Vĩnh Long?
            </h2>

            <p className="text-white/80 font-body text-xs sm:text-lg leading-relaxed">
              Hãy khám phá ngay bộ sưu tập mô hình gốm sứ 3D sắc nét đa chiều của chúng tôi hoặc liên hệ với đội ngũ Minh Phương để nhận tư vấn và báo giá thiết kế riêng biệt.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[var(--color-gold)] hover:bg-[#d49931] text-[var(--color-forest)] font-bold rounded-full px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-sm tracking-wider font-accent uppercase transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <Box className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Khám Phá Bộ Sưu Tập Gốm Sứ 3D</span>
                </Button>
              </Link>
              <Link href="/bao-gia" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30 text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-sm font-semibold tracking-wider font-accent uppercase transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <span>Liên Hệ Hợp Tác & Báo Giá</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
