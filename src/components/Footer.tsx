import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-forest)] text-[#F5F1EB] border-t border-[#E0DCD4]/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-[var(--color-gold)]">
                GỐM SỨ MINH PHƯƠNG
              </span>
              <span className="text-[10px] font-accent tracking-[0.25em] text-[#EDEAE4]/60 uppercase">
                Vĩnh Long • Tinh Hoa Đất Việt
              </span>
            </Link>
            <p className="text-sm text-[#EDEAE4]/70 leading-relaxed max-w-sm">
              Cơ sở chế tác và kinh doanh các sản phẩm gốm sứ thủ công mỹ nghệ cao cấp tại Vĩnh Long. Tự hào lưu giữ và kiến tạo những giá trị văn hóa nghệ thuật độc đáo thông qua từng tác phẩm đất nung.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-[#EDEAE4]/70 hover:text-[var(--color-gold)] transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href="#" className="text-[#EDEAE4]/70 hover:text-[var(--color-gold)] transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider font-accent mb-4">
              Đường dẫn chính
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Trang chủ' },
                { href: '/products', label: 'Sản phẩm 3D' },
                { href: '/blog', label: 'Bài viết' },
                { href: '/about', label: 'Giới thiệu' }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-[#EDEAE4]/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider font-accent mb-4">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-[#EDEAE4]/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-[var(--color-gold)] shrink-0" />
                <span>Số 62 tỉnh lộ 902, ấp Thuận Thới, Xã Cái Nhum, Tỉnh Vĩnh Long</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[var(--color-gold)] shrink-0" />
                <span>0908458569</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--color-gold)] shrink-0" />
                <span>contact@gomsuminhphuong.vn</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#EDEAE4]/10 text-center md:flex md:items-center md:justify-between text-xs text-[#EDEAE4]/50">
          <p>© {currentYear} Gốm Sứ Minh Phương Vĩnh Long. Bảo lưu mọi quyền.</p>
          <p className="mt-2 md:mt-0">Thiết kế bởi Đội ngũ kỹ thuật</p>
        </div>
      </div>
    </footer>
  )
}
