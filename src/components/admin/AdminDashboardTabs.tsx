'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Package,
  MessageSquare,
  Eye,
  Plus,
  FileText,
  FolderKanban,
  Settings,
  PhoneCall,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  LayoutDashboard,
  Box,
  Sparkles,
  RefreshCw,
  Building,
  Calendar
} from 'lucide-react'
import { updateContactStatus } from '@/app/admin/contacts/actions'

export interface SerializedContact {
  id: string
  name: string
  email: string | null
  phone: string
  company: string | null
  message: string | null
  status: string
  createdAt: string
}

export interface SerializedProduct {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  model3dUrl: string | null
  price: number | null
  categoryName?: string
  createdAt: string
}

export interface SerializedPost {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  published: boolean
  createdAt: string
}

export interface DashboardStats {
  productsCount: number
  productsWith3dCount: number
  pendingContactsCount: number
  totalContactsCount: number
  postsCount: number
  publishedPostsCount: number
  categoriesCount: number
}

interface AdminDashboardTabsProps {
  stats: DashboardStats
  recentContacts: SerializedContact[]
  recentProducts: SerializedProduct[]
  recentPosts: SerializedPost[]
}

type TabKey = 'overview' | 'inquiries' | 'products' | 'posts'

export default function AdminDashboardTabs({
  stats,
  recentContacts: initialContacts,
  recentProducts,
  recentPosts,
}: AdminDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [contacts, setContacts] = useState<SerializedContact[]>(initialContacts)
  const [isPending, startTransition] = useTransition()

  const pendingCount = contacts.filter((c) => c.status === 'PENDING').length

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING'
    
    // Optimistic UI update
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )

    startTransition(async () => {
      const res = await updateContactStatus(id, newStatus)
      if (res.error) {
        // Revert on error
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: currentStatus } : c))
        )
        alert(res.error)
      }
    })
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: <LayoutDashboard size={18} />,
    },
    {
      key: 'inquiries',
      label: 'Yêu cầu báo giá',
      icon: <MessageSquare size={18} />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: 'products',
      label: 'Sản phẩm & 3D',
      icon: <Package size={18} />,
    },
    {
      key: 'posts',
      label: 'Bài viết & Tiện ích',
      icon: <FileText size={18} />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* ─── THANH ĐIỀU HƯỚNG TAB ─────────────────────────────── */}
      <div className="flex items-center border-b border-[#E0DCD4] gap-2 overflow-x-auto custom-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[var(--color-gold)] text-[var(--color-forest)] bg-[#F5F1EB] rounded-t-xl font-semibold'
                  : 'border-transparent text-gray-500 hover:text-[var(--color-forest)] hover:bg-white/50 rounded-t-xl'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ─── TAB 1: TỔNG QUAN (OVERVIEW) ────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8 dash-animate-in">
          {/* Thẻ KPI Thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="dash-stat-card">
              <div className="dash-icon-circle bg-[var(--color-sand)] text-[var(--color-teak)]">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-[var(--color-forest)] mt-0.5">{stats.productsCount}</p>
                <p className="text-xs text-gray-400 mt-1">Gốm sứ Vĩnh Long</p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-icon-circle bg-amber-100 text-amber-800">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Báo giá chưa xử lý</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                  <span className="text-xs text-gray-400">/ {stats.totalContactsCount} tổng số</span>
                </div>
                <p className="text-xs text-amber-600 mt-1 font-medium">Cần phản hồi ngay</p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-icon-circle bg-emerald-100 text-emerald-800">
                <Eye size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tích hợp 3D / AR</p>
                <p className="text-2xl font-bold text-emerald-800 mt-0.5">{stats.productsWith3dCount}</p>
                <p className="text-xs text-gray-400 mt-1">Mô hình WebGL sẵn sàng</p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-icon-circle bg-blue-100 text-blue-800">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Bài viết xuất bản</p>
                <p className="text-2xl font-bold text-blue-900 mt-0.5">{stats.publishedPostsCount}</p>
                <p className="text-xs text-gray-400 mt-1">{stats.categoriesCount} Danh mục gốm</p>
              </div>
            </div>
          </div>

          {/* Khối Thao tác Nhanh (Quick Actions) */}
          <div className="dash-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-[var(--color-forest)] flex items-center gap-2">
                <Sparkles size={20} className="text-[var(--color-gold)]" /> Thao tác nhanh
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#E0DCD4] bg-[#FAFAF8] hover:bg-[#FBF8F2] hover:border-[var(--color-gold)] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-forest)] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--color-forest)] group-hover:text-[var(--color-teak)]">Thêm Sản Phẩm</p>
                  <p className="text-xs text-gray-500">Đăng mẫu gốm sứ mới</p>
                </div>
              </Link>

              <Link
                href="/admin/posts/new"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#E0DCD4] bg-[#FAFAF8] hover:bg-[#FBF8F2] hover:border-[var(--color-gold)] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--color-forest)] group-hover:text-[var(--color-teak)]">Viết Bài Mới</p>
                  <p className="text-xs text-gray-500">Tin tức & Di sản gốm</p>
                </div>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#E0DCD4] bg-[#FAFAF8] hover:bg-[#FBF8F2] hover:border-[var(--color-gold)] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FolderKanban size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--color-forest)] group-hover:text-[var(--color-teak)]">Danh Mục</p>
                  <p className="text-xs text-gray-500">Quản lý dòng sản phẩm</p>
                </div>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#E0DCD4] bg-[#FAFAF8] hover:bg-[#FBF8F2] hover:border-[var(--color-gold)] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Settings size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--color-forest)] group-hover:text-[var(--color-teak)]">Cấu Hình Site</p>
                  <p className="text-xs text-gray-500">Hotline, Zalo & Footer</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Grid 2 Cột: Báo giá gần nhất & Sản phẩm vừa thêm */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cột trái: Yêu cầu báo giá mới */}
            <div className="dash-card overflow-hidden">
              <div className="dash-section-header">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-[var(--color-teak)]" />
                  <h3 className="font-heading text-base font-semibold text-[var(--color-forest)]">Yêu cầu báo giá mới gửi</h3>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-medium text-[var(--color-teak)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Xem tất cả ({contacts.length}) <ArrowRight size={14} />
                </button>
              </div>

              {contacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">Chưa có yêu cầu báo giá nào.</div>
              ) : (
                <div className="divide-y divide-[#EDEAE4]">
                  {contacts.slice(0, 4).map((c) => (
                    <div key={c.id} className="p-4 hover:bg-[#FAF8F5] transition-colors flex items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[var(--color-forest)] truncate">{c.name}</p>
                          {c.company && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 truncate max-w-[140px]">
                              {c.company}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-3">
                          <span className="flex items-center gap-1"><PhoneCall size={12} /> {c.phone}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString('vi-VN')}</span>
                        </p>
                        {c.message && (
                          <p className="text-xs text-gray-600 line-clamp-1 italic bg-white p-2 rounded border border-[#E0DCD4] mt-1">
                            &quot;{c.message}&quot;
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span
                          className={`dash-badge ${
                            c.status === 'PENDING' ? 'dash-badge-yellow' : 'dash-badge-green'
                          }`}
                        >
                          {c.status === 'PENDING' ? 'Chưa xử lý' : 'Đã xử lý'}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(c.id, c.status)}
                          disabled={isPending}
                          className="text-xs text-[var(--color-teak)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={12} className={isPending ? 'animate-spin' : ''} />
                          Đổi trạng thái
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cột phải: Sản phẩm mới thêm */}
            <div className="dash-card overflow-hidden">
              <div className="dash-section-header">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-[var(--color-teak)]" />
                  <h3 className="font-heading text-base font-semibold text-[var(--color-forest)]">Sản phẩm mới đăng</h3>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-medium text-[var(--color-teak)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Xem tất cả ({stats.productsCount}) <ArrowRight size={14} />
                </button>
              </div>

              {recentProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">Chưa có sản phẩm nào trong hệ thống.</div>
              ) : (
                <div className="divide-y divide-[#EDEAE4]">
                  {recentProducts.slice(0, 4).map((prod) => (
                    <div key={prod.id} className="p-4 hover:bg-[#FAF8F5] transition-colors flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-[#E0DCD4] flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                        {prod.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <Box size={20} className="text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-[var(--color-forest)] truncate">{prod.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {prod.categoryName && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-sand)] text-[var(--color-teak)] font-medium">
                              {prod.categoryName}
                            </span>
                          )}
                          {prod.model3dUrl ? (
                            <span className="dash-badge dash-badge-green text-[10px]">
                              <Box size={10} /> 3D AR
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">Chưa có 3D</span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/admin/products`}
                        className="dash-btn-ghost text-xs py-1 px-2.5"
                      >
                        Xem
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: YÊU CẦU BÁO GIÁ (INQUIRIES) ──────────────── */}
      {activeTab === 'inquiries' && (
        <div className="dash-card overflow-hidden dash-animate-in">
          <div className="p-6 border-b border-[#E0DCD4] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAFAF8]">
            <div>
              <h3 className="font-heading text-lg font-semibold text-[var(--color-forest)]">Quản lý Yêu cầu Báo giá & Liên hệ</h3>
              <p className="text-xs text-gray-500 mt-1">Danh sách khách hàng đăng ký tư vấn gốm sứ B2B hoặc báo giá dự án.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="dash-badge dash-badge-yellow">{pendingCount} Chưa xử lý</span>
              <span className="dash-badge dash-badge-green">{contacts.length - pendingCount} Đã xong</span>
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="dash-empty-state">
              <MessageSquare className="dash-empty-state-icon" size={48} />
              <p className="dash-empty-state-title">Chưa có yêu cầu nào</p>
              <p className="dash-empty-state-desc">Khi khách hàng gửi form trên website, thông tin sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Khách hàng / Công ty</th>
                    <th>Thông tin liên hệ</th>
                    <th>Nội dung yêu cầu</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="font-semibold text-sm text-[var(--color-forest)]">{item.name}</div>
                        {item.company ? (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building size={12} /> {item.company}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Khách cá nhân</span>
                        )}
                      </td>
                      <td>
                        <div className="text-xs font-mono text-gray-800 flex items-center gap-1">
                          <PhoneCall size={12} className="text-emerald-600" /> {item.phone}
                        </div>
                        {item.email && (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} className="text-blue-600" /> {item.email}
                          </div>
                        )}
                      </td>
                      <td className="max-w-xs">
                        <p className="text-xs text-gray-700 line-clamp-2 bg-[#FAFAF8] p-2 rounded border border-[#E0DCD4]">
                          {item.message || 'Không có ghi chú thêm.'}
                        </p>
                      </td>
                      <td className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td>
                        <span
                          className={`dash-badge ${
                            item.status === 'PENDING' ? 'dash-badge-yellow' : 'dash-badge-green'
                          }`}
                        >
                          {item.status === 'PENDING' ? (
                            <>
                              <Clock size={12} /> Chưa xử lý
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={12} /> Đã xử lý
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          disabled={isPending}
                          className="dash-btn-secondary text-xs py-1.5 px-3"
                        >
                          {item.status === 'PENDING' ? 'Đánh dấu Đã xử lý' : 'Đổi về Chưa xử lý'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: SẢN PHẨM & MÔ HÌNH 3D (PRODUCTS) ───────────── */}
      {activeTab === 'products' && (
        <div className="dash-card overflow-hidden dash-animate-in">
          <div className="p-6 border-b border-[#E0DCD4] flex items-center justify-between bg-[#FAFAF8]">
            <div>
              <h3 className="font-heading text-lg font-semibold text-[var(--color-forest)]">Sản phẩm Gốm sứ & Mô hình 3D</h3>
              <p className="text-xs text-gray-500 mt-1">Danh sách sản phẩm được tải lên trong hệ thống catalog gốm sứ.</p>
            </div>
            <Link href="/admin/products/new" className="dash-btn-primary text-xs py-2 px-4">
              <Plus size={16} /> Thêm sản phẩm mới
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="dash-empty-state">
              <Package className="dash-empty-state-icon" size={48} />
              <p className="dash-empty-state-title">Chưa có sản phẩm nào</p>
              <p className="dash-empty-state-desc">Hãy nhấn "Thêm sản phẩm mới" để đưa gốm sứ lên hệ thống.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Trạng thái 3D AR</th>
                    <th>Giá tham khảo</th>
                    <th>Ngày tạo</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 border border-[#E0DCD4] overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {prod.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Box size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[var(--color-forest)]">{prod.name}</div>
                            <div className="text-xs text-gray-400 font-mono">/{prod.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-sand)] text-[var(--color-teak)] font-medium">
                          {prod.categoryName || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td>
                        {prod.model3dUrl ? (
                          <span className="dash-badge dash-badge-green">
                            <Box size={12} /> Đã có 3D (.glb)
                          </span>
                        ) : (
                          <span className="dash-badge dash-badge-gray">Chưa tích hợp 3D</span>
                        )}
                      </td>
                      <td className="text-xs font-semibold text-[var(--color-forest)]">
                        {prod.price ? `${prod.price.toLocaleString('vi-VN')} đ` : 'Liên hệ báo giá'}
                      </td>
                      <td className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(prod.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <Link href={`/admin/products`} className="dash-btn-ghost text-xs py-1 px-3">
                          Quản lý sản phẩm <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: BÀI VIẾT & TIỆN ÍCH (POSTS & UTILS) ─────────── */}
      {activeTab === 'posts' && (
        <div className="space-y-8 dash-animate-in">
          <div className="dash-card overflow-hidden">
            <div className="p-6 border-b border-[#E0DCD4] flex items-center justify-between bg-[#FAFAF8]">
              <div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-forest)]">Bài viết & Tin tức Gốm sứ</h3>
                <p className="text-xs text-gray-500 mt-1">Nội dung bài viết giới thiệu di sản làng nghề, quy trình chế tác gốm.</p>
              </div>
              <Link href="/admin/posts/new" className="dash-btn-primary text-xs py-2 px-4">
                <Plus size={16} /> Viết bài mới
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <div className="dash-empty-state">
                <FileText className="dash-empty-state-icon" size={48} />
                <p className="dash-empty-state-title">Chưa có bài viết nào</p>
                <p className="dash-empty-state-desc">Hãy đăng bài viết đầu tiên để tăng khả năng hiển thị SEO.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EDEAE4]">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-[#FAF8F5] transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded bg-gray-100 border border-[#E0DCD4] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {post.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-[var(--color-forest)] truncate">{post.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Đăng ngày: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`dash-badge ${post.published ? 'dash-badge-green' : 'dash-badge-yellow'}`}>
                        {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                      <Link href="/admin/posts" className="dash-btn-ghost text-xs py-1 px-3">
                        Sửa bài
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
