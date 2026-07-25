'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  Eye,
  FileText,
  MessageSquare,
  TrendingUp,
  Package,
  Calendar,
  BarChart3,
  Flame,
  Award,
  ArrowUpRight,
} from 'lucide-react'
import { getAnalyticsData, TimeRange } from '@/actions/analytics'

export default function AdminAnalyticsTab() {
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const [data, setData] = useState<{
    totalProductViews: number
    totalPostViews: number
    totalQuotes: number
    totalQuotesWithProduct: number
    topViewedProducts: any[]
    topQuotedProducts: any[]
    topViewedPosts: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()

  const loadData = (range: TimeRange) => {
    setLoading(true)
    startTransition(async () => {
      const res = await getAnalyticsData(range)
      setData(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData(timeRange)
  }, [timeRange])

  const conversionRate =
    data && data.totalProductViews > 0
      ? ((data.totalQuotesWithProduct / data.totalProductViews) * 100).toFixed(1)
      : '0.0'

  const maxProductViews =
    data && data.topViewedProducts.length > 0 ? data.topViewedProducts[0].viewCount : 1

  return (
    <div className="space-y-8 dash-animate-in">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E0DCD4] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-[var(--color-teak)]" size={24} />
            <h2 className="font-heading text-xl font-bold text-[var(--color-forest)]">
              Thống kê & Phân tích Chi tiết
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Báo cáo hiệu suất lượt xem sản phẩm, lượt đọc bài viết và xu hướng khách hàng gửi báo giá.
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#E0DCD4]">
          <span className="text-xs text-gray-500 font-medium px-2 flex items-center gap-1">
            <Calendar size={13} /> Mốc:
          </span>
          {[
            { key: 'today', label: 'Hôm nay' },
            { key: '7days', label: '7 ngày' },
            { key: '30days', label: '30 ngày' },
            { key: 'all', label: 'Tất cả' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTimeRange(item.key as TimeRange)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === item.key
                  ? 'bg-[var(--color-forest)] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#E0DCD4] shadow-sm hover:border-[var(--color-teak)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Lượt xem Sản phẩm
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Eye size={18} />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[var(--color-forest)]">
            {loading ? '...' : (data?.totalProductViews || 0).toLocaleString('vi-VN')}
          </div>
          <p className="text-xs text-gray-400 mt-2">Tổng số lượt ghé xem sản phẩm gốm sứ</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E0DCD4] shadow-sm hover:border-[var(--color-teak)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Yêu cầu Báo giá
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[var(--color-forest)]">
            {loading ? '...' : (data?.totalQuotes || 0).toLocaleString('vi-VN')}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Khách gửi thông tin tư vấn / báo giá
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E0DCD4] shadow-sm hover:border-[var(--color-teak)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tỷ lệ Chuyển đổi Báo giá
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[var(--color-forest)]">
            {loading ? '...' : `${conversionRate}%`}
          </div>
          <p className="text-xs text-gray-400 mt-2">Lượt gửi báo giá trên số lượt xem</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E0DCD4] shadow-sm hover:border-[var(--color-teak)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Lượt đọc Bài viết
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[var(--color-forest)]">
            {loading ? '...' : (data?.totalPostViews || 0).toLocaleString('vi-VN')}
          </div>
          <p className="text-xs text-gray-400 mt-2">Lượt xem tin tức & kiến thức gốm</p>
        </div>
      </div>

      {/* Main Analytics Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Top 10 Viewed Products */}
        <div className="dash-card overflow-hidden">
          <div className="dash-section-header">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-amber-500" />
              <h3 className="font-heading text-base font-semibold text-[var(--color-forest)]">
                Top Sản phẩm Xem nhiều nhất
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Đang tính toán dữ liệu...</div>
          ) : !data || data.topViewedProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Chưa có dữ liệu lượt xem.</div>
          ) : (
            <div className="divide-y divide-[#EDEAE4]">
              {data.topViewedProducts.map((p, idx) => {
                const percent = Math.round((p.viewCount / maxProductViews) * 100)
                return (
                  <div key={p.id} className="p-4 hover:bg-[#FAF8F5] transition-colors space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            idx === 0
                              ? 'bg-amber-400 text-white'
                              : idx === 1
                              ? 'bg-gray-300 text-gray-800'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E0DCD4]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-[#E0DCD4] flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[var(--color-forest)] truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.price ? `${p.price.toLocaleString('vi-VN')} đ` : 'Liên hệ báo giá'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[var(--color-forest)] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E0DCD4]">
                          {p.viewCount} lượt xem
                        </span>
                      </div>
                    </div>

                    {/* View Progress bar */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--color-forest)] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Top Products Quoted */}
        <div className="dash-card overflow-hidden">
          <div className="dash-section-header">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-emerald-600" />
              <h3 className="font-heading text-base font-semibold text-[var(--color-forest)]">
                Sản phẩm được Đăng ký Báo giá nhiều nhất
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Đang tính toán dữ liệu...</div>
          ) : !data || data.topQuotedProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Chưa có dữ liệu sản phẩm được gửi báo giá.
            </div>
          ) : (
            <div className="divide-y divide-[#EDEAE4]">
              {data.topQuotedProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 hover:bg-[#FAF8F5] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E0DCD4]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-[#E0DCD4] flex items-center justify-center text-gray-400">
                        <Package size={16} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[var(--color-forest)] truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>Lượt xem: {p.viewCount}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">
                          Tỷ lệ: {p.viewCount > 0 ? ((p.quoteCount / p.viewCount) * 100).toFixed(1) : 0}%
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="dash-badge dash-badge-yellow font-bold text-xs">
                      {p.quoteCount} yêu cầu
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Top Read Articles */}
      <div className="dash-card overflow-hidden">
        <div className="dash-section-header">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-purple-600" />
            <h3 className="font-heading text-base font-semibold text-[var(--color-forest)]">
              Bài viết Tin tức & Kiến thức Gốm sứ được Đọc nhiều nhất
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Đang tải dữ liệu...</div>
        ) : !data || data.topViewedPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Chưa có lượt đọc bài viết nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#EDEAE4]">
            {data.topViewedPosts.map((post, idx) => (
              <div key={post.id} className="p-4 hover:bg-[#FAF8F5] transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-4 text-center">{idx + 1}</span>
                  <div className="min-w-0">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sm text-[var(--color-forest)] hover:text-[var(--color-teak)] hover:underline truncate flex items-center gap-1"
                    >
                      <span>{post.title}</span>
                      <ArrowUpRight size={13} className="shrink-0 text-gray-400" />
                    </a>
                  </div>
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                  {post.viewCount} lượt đọc
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
