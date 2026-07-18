'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/blog', label: 'Bài viết' },
  { href: '/about', label: 'Giới thiệu' },
  { href: '/bao-gia', label: 'Báo giá' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Xử lý sự kiện scroll để đổi nền navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-[var(--color-forest)]/95 backdrop-blur-md shadow-md py-3 border-b border-[#E0DCD4]/20'
          : 'bg-[var(--color-forest)] py-5 border-b border-[#E0DCD4]/10'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo / Thương hiệu */}
          <Link href="/" className="flex flex-col group">
            <span className="font-heading text-2xl font-bold tracking-tight text-[#F5F1EB] transition-colors group-hover:text-[var(--color-gold)]">
              GỐM SỨ MINH PHƯƠNG
            </span>
            <span className="text-[10px] font-accent tracking-[0.25em] text-[#F5F1EB]/70 uppercase -mt-1 group-hover:text-[var(--color-teak)] transition-colors">
              Vĩnh Long • Tinh Hoa Đất Việt
            </span>
          </Link>

          {/* Menu chính cho Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-2 text-sm font-medium tracking-wide font-accent transition-colors duration-300 ${isActive
                      ? 'text-[var(--color-gold)]'
                      : 'text-[#F5F1EB]/80 hover:text-[#F5F1EB]'
                    }`}
                >
                  {label}
                  {/* Hiệu ứng gạch dưới khi hover/active */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-gold)] origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                      } group-hover:scale-x-100`}
                  />
                  {/* CSS thay thế để hover trên thẻ a: dùng class group cho thẻ cha nếu cần, ở đây hover trực tiếp bằng CSS */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-gold)] scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* CTA Button cho Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-[var(--color-gold)] hover:bg-[var(--color-teak)] text-[var(--color-forest)] hover:text-[#F5F1EB] rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider font-accent uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="/bao-gia">
                <Phone size={14} className="mr-2" />
                Nhận Báo Giá
              </Link>
            </Button>
          </div>

          {/* Nút Toggle Mobile Menu */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F5F1EB] hover:bg-[#F5F1EB]/10 transition-colors focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Drawer Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[64px] bg-[var(--color-forest)] border-b border-[#E0DCD4]/20 transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="px-4 pt-6 pb-8 space-y-4 flex flex-col h-full justify-between">
          <div className="space-y-2">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold font-accent transition-all duration-200 ${isActive
                      ? 'bg-[var(--color-gold)] text-[var(--color-forest)]'
                      : 'text-[#F5F1EB]/80 hover:bg-[#F5F1EB]/10 hover:text-[#F5F1EB]'
                    }`}
                >
                  <span>{label}</span>
                  <span
                    className={`h-2 w-2 rounded-full bg-[var(--color-gold)] transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0'
                      }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* CTA Button ở cuối Menu di động */}
          <div className="px-4 pb-12">
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-full bg-[var(--color-gold)] hover:bg-[var(--color-teak)] text-[var(--color-forest)] hover:text-[#F5F1EB] rounded-full py-4 text-sm font-semibold tracking-wider font-accent uppercase transition-colors"
            >
              <Link href="/bao-gia" className="flex items-center justify-center w-full">
                <Phone size={16} className="mr-2 inline" />
                Nhận Báo Giá Ngay
              </Link>
            </Button>
            <div className="text-center mt-6 text-xs text-[#F5F1EB]/70 font-body">
              Hotline: 090x xxx xxx • Vĩnh Long
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
