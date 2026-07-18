'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface AdminHeaderProps {
  title?: string
}

export default function AdminHeader({ title = 'Bảng điều khiển' }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-8 shadow-sm">
      <h1 className="font-heading text-xl text-[var(--color-forest)] font-medium">{title}</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        <LogOut size={16} />
        Đăng xuất
      </button>
    </header>
  )
}
