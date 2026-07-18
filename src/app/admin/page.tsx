import { Package, MessageSquare, Eye } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="dash-animate-in">
      <div className="mb-8">
        <h2 className="text-2xl font-heading text-[var(--color-forest)] font-semibold">Chào mừng trở lại!</h2>
        <p className="text-gray-500 mt-1">Đây là tổng quan tình hình kinh doanh ngày hôm nay.</p>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dash-stat-card dash-animate-in-delay-1">
          <div className="dash-icon-circle bg-[var(--color-sand)] text-[var(--color-teak)]">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-[var(--color-forest)]">0</p>
          </div>
        </div>

        <div className="dash-stat-card dash-animate-in-delay-2">
          <div className="dash-icon-circle bg-[var(--color-sand)] text-[var(--color-teak)]">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Yêu cầu báo giá</p>
            <p className="text-2xl font-bold text-[var(--color-forest)]">0</p>
          </div>
        </div>

        <div className="dash-stat-card dash-animate-in-delay-3">
          <div className="dash-icon-circle bg-[var(--color-sand)] text-[var(--color-teak)]">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Lượt xem mô hình 3D</p>
            <p className="text-2xl font-bold text-[var(--color-forest)]">0</p>
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="dash-card p-6 dash-animate-in-delay-4">
        <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
          <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">Hoạt động gần đây</h3>
        </div>
        <div className="dash-empty-state">
          <Package className="dash-empty-state-icon" size={48} />
          <p className="dash-empty-state-title">Hệ thống sẵn sàng</p>
          <p className="dash-empty-state-desc">Hãy bắt đầu thêm sản phẩm gốm sứ đầu tiên của bạn.</p>
        </div>
      </div>
    </div>
  )
}