import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Giới Thiệu | Gốm Sứ Minh Phương Vĩnh Long',
  description: 'Khám phá câu chuyện đằng sau những tác phẩm gốm đỏ Vĩnh Long độc bản của cơ sở Minh Phương.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[#F5F1EB] text-[var(--color-forest)] font-sans">
      
      {/* ═══════════════════════════════════════════════════
          SECTION 1: MINIMALIST HERO & WIDE IMAGE
          ═══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-3 text-[var(--color-teak)] text-sm font-semibold tracking-[0.2em] font-accent uppercase">
              <span className="w-12 h-[2px] bg-[var(--color-gold)]" />
              Câu Chuyện Của Đất
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Hồn Đất Nam Bộ <br />
              <span className="text-[var(--color-teak)]">Thổi Vào Từng Tác Phẩm.</span>
            </h1>
          </div>
          <div className="lg:col-span-5 pb-2">
            <p className="text-lg text-[var(--color-slate)] leading-relaxed font-body">
              Gốm sứ Minh Phương không chỉ là một thương hiệu. Đó là hành trình gần 10 năm gìn giữ ngọn lửa đam mê, kế thừa di sản văn hóa gốm đỏ Vĩnh Long và nâng tầm nghệ thuật chế tác thủ công.
            </p>
          </div>
        </div>

        {/* Wide Landscape Image */}
        <div className="mt-16 relative w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] rounded-[2rem] overflow-hidden shadow-2xl">
          <Image
            src="/hero_pottery_bg.png"
            alt="Xưởng Gốm Minh Phương"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--color-forest)]/10" />
          
          {/* Badge Overlay */}
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-white font-bold text-xl">
               9+
             </div>
             <div>
               <p className="font-heading font-bold text-[var(--color-forest)]">Năm Cống Hiến</p>
               <p className="text-xs text-[var(--color-slate)] font-body">2017 - Nay</p>
             </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: LARGE QUOTE / PHILOSOPHY
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <svg className="w-16 h-16 mx-auto text-[var(--color-gold)]/30" fill="currentColor" viewBox="0 0 24 24">
             <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight text-[var(--color-forest)] font-medium">
            "Sự hoàn mỹ không nằm ở việc làm ra hàng ngàn sản phẩm giống hệt nhau. Nó nằm ở dấu ấn độc bản mà người nghệ nhân để lại trên từng đường nét chế tác."
          </h3>
          <p className="font-accent text-[var(--color-teak)] tracking-widest uppercase font-semibold text-sm">
            — Tôn Chỉ Của Chúng Tôi
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: VERTICAL TIMELINE (THE JOURNEY)
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#FBF8F2]">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-forest)]">Dấu Chân Thời Gian</h2>
             <p className="text-[var(--color-slate)] font-body">Những cột mốc quan trọng định hình thương hiệu Minh Phương ngày hôm nay.</p>
          </div>

          <div className="relative border-l-2 border-[var(--color-gold)]/30 pl-8 ml-4 sm:ml-0 sm:border-l-0 sm:border-t-0 sm:pl-0">
            {/* Desktop Center Line */}
            <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[var(--color-gold)]/10 via-[var(--color-gold)] to-[var(--color-gold)]/10" />

            <div className="space-y-16">
              {[
                { year: '2017', title: 'Viên Gạch Đầu Tiên', desc: 'Xưởng gốm nhỏ bên bờ sông Cổ Chiên ra đời với 2 lò nung thủ công và tâm huyết của 5 người thợ lành nghề.' },
                { year: '2019', title: 'Mở Rộng Quy Mô', desc: 'Cải tiến kỹ thuật nung lửa, Minh Phương bắt đầu cung cấp các tác phẩm gốm đỏ kích thước lớn cho các công trình, biệt thự.' },
                { year: '2021', title: 'Ghi Dấu Ấn Độc Bản', desc: 'Chuyển hướng tập trung mạnh vào các dòng sản phẩm gốm nghệ thuật cao cấp, mỗi tác phẩm là duy nhất không trùng lặp.' },
                { year: '2024', title: 'Số Hóa Trải Nghiệm', desc: 'Tiên phong ứng dụng công nghệ 3D vào quá trình giới thiệu sản phẩm, giúp khách hàng trải nghiệm chân thực từ xa.' },
              ].map((milestone, idx) => (
                <div key={milestone.year} className={`relative flex flex-col sm:flex-row items-center gap-8 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FBF8F2] border-4 border-[var(--color-gold)] items-center justify-center z-10">
                     <div className="w-2 h-2 rounded-full bg-[var(--color-forest)]" />
                  </div>
                  
                  {/* Content Box */}
                  <div className={`w-full sm:w-1/2 ${idx % 2 === 0 ? 'sm:pl-12' : 'sm:pr-12 sm:text-right'}`}>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E0DCD4]/50 hover:shadow-lg transition-shadow">
                      <span className="text-[var(--color-teak)] font-bold text-2xl font-heading mb-2 block">{milestone.year}</span>
                      <h4 className="text-xl font-bold text-[var(--color-forest)] mb-3">{milestone.title}</h4>
                      <p className="text-[var(--color-slate)] font-body leading-relaxed">{milestone.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4: BENTO GRID - THE PROCESS
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-8 mb-16">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-forest)]">Nghệ Thuật Chế Tác</h2>
              <p className="text-[var(--color-slate)] font-body text-lg">Quy trình nghiêm ngặt đòi hỏi sự giao thoa hoàn hảo giữa kinh nghiệm, đôi bàn tay khéo léo và ngọn lửa đỏ.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Item 1 - Large */}
            <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group">
              <Image src="/about_artisan.png" alt="Tạo Hình" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B2B]/90 via-[#1C2B2B]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                 <span className="bg-[var(--color-gold)] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">BƯỚC 1 & 2</span>
                 <h3 className="text-3xl font-heading font-bold text-white mb-2">Tuyển Chọn Đất & Tạo Hình</h3>
                 <p className="text-white/80 font-body max-w-md">Từ đất sét đỏ tự nhiên, nghệ nhân nhào nặn và vuốt tay thủ công để định hình nên linh hồn của tác phẩm.</p>
              </div>
            </div>

            {/* Item 2 - Small Top Right */}
            <div className="relative rounded-3xl overflow-hidden bg-[#F5F1EB] p-8 border border-[#E0DCD4]/60 flex flex-col justify-end group hover:bg-[#F0EBE1] transition-colors">
              <div className="mb-auto">
                 <span className="text-[var(--color-teak)] font-bold text-4xl font-heading opacity-20 group-hover:opacity-40 transition-opacity">03</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-[var(--color-forest)] mb-2">Canh Lửa Lò Nung</h3>
              <p className="text-[var(--color-slate)] font-body text-sm">Nhiệt độ nung được kiểm soát khắt khe bằng kinh nghiệm để đạt màu đỏ gạch tự nhiên.</p>
            </div>

            {/* Item 3 - Small Bottom Right */}
            <div className="relative rounded-3xl overflow-hidden bg-[var(--color-forest)] p-8 text-white flex flex-col justify-end group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2" />
              <div className="mb-auto">
                 <span className="text-[var(--color-gold)] font-bold text-4xl font-heading opacity-50">04</span>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Kiểm Định & Hoàn Thiện</h3>
              <p className="text-white/70 font-body text-sm">Chỉ những tác phẩm đạt chuẩn hoàn mỹ mới được khắc dấu mộc Minh Phương.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: SIMPLE ELEGANT CTA
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F1EB] border-t border-[#E0DCD4]/40">
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-12 sm:p-16 text-center border border-[#E0DCD4]/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-teak)]" />
          
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-forest)] mb-6">Trải Nghiệm Sự Độc Bản</h2>
          <p className="text-[var(--color-slate)] font-body mb-10 text-lg">
            Khám phá bộ sưu tập mô hình 3D thực tế của chúng tôi hoặc liên hệ trực tiếp để được tư vấn thiết kế riêng biệt.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[var(--color-forest)] hover:bg-[var(--color-teak)] text-white rounded-full px-8 py-6 text-sm font-semibold tracking-wider font-accent uppercase transition-all shadow-md hover:-translate-y-1"
              >
                Xem Bộ Sưu Tập
              </Button>
            </Link>
            <Link href="/bao-gia">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-[#E0DCD4] hover:border-[var(--color-gold)] text-[var(--color-forest)] rounded-full px-8 py-6 text-sm font-semibold tracking-wider font-accent uppercase transition-all"
              >
                Liên Hệ Báo Giá
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  )
}
