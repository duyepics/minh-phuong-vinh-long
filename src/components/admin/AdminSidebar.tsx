'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FileText, MessageSquare, FolderTree, Settings } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Cài đặt trang chủ', icon: Settings },
  { href: '/admin/categories', label: 'Danh mục', icon: FolderTree },
  { href: '/admin/products', label: 'Sản phẩm 3D', icon: Package },
  { href: '/admin/posts', label: 'Bài viết', icon: FileText },
  { href: '/admin/contacts', label: 'Yêu cầu báo giá', icon: MessageSquare },
]

interface AdminSidebarProps {
  userEmail: string | undefined
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 sidebar-bg text-white flex flex-col shadow-xl z-10">
      <div className="p-6">
        <h2 className="text-2xl font-heading font-bold text-[var(--color-gold)]">Minh Phương</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Hệ thống quản trị</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/15 text-[var(--color-gold)]' : 'hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Thông tin User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300">
          <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-forest)] font-bold">
            {userEmail?.charAt(0).toUpperCase()}
          </div>
          <div className="truncate flex-1">{userEmail}</div>
        </div>
      </div>
    </aside>
  )
}
