'use client'

import { useState, useEffect } from 'react'
import { Save, CheckCircle2, AlertCircle, X, LayoutTemplate } from 'lucide-react'
import { getSiteSettings, updateSiteSettings } from './actions'
import UploadProductImage from '@/components/admin/UploadProductImage'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getProductsWith3DModel } from './actions'

interface Product3D {
  id: string
  name: string
  model3dUrl: string | null
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [products3D, setProducts3D] = useState<Product3D[]>([])

  // Default values
  const [formData, setFormData] = useState({
    // Hero Banner
    hero_tagline: 'Gốm Sứ Mỹ Nghệ Cao Cấp',
    hero_title_line1: 'Tinh Hoa Đất Việt',
    hero_title_highlight: 'Nâng Tầm',
    hero_title_line2: 'Không Gian',
    hero_subtitle: 'Chào mừng đến với cơ sở gốm sứ mỹ nghệ Minh Phương – Vĩnh Long. Những tác phẩm gốm sứ độc bản, tinh xảo được chế tác từ bàn tay các nghệ nhân lành nghề, kết hợp công nghệ tương tác 3D đột phá.',
    hero_bg_image: '/hero_pottery_bg.png',

    // About Us
    about_tagline: 'Về Chúng Tôi',
    about_title_line1: 'Nơi Đất Đỏ',
    about_title_highlight: 'Hóa Thành Nghệ Thuật',
    about_paragraph1: 'Tọa lạc bên dòng sông Cổ Chiên hiền hòa, cơ sở gốm sứ mỹ nghệ Minh Phương đã gắn bó hơn 20 năm với nghề gốm truyền thống Vĩnh Long. Mỗi sản phẩm là kết tinh từ chất đất trù phú, bàn tay khéo léo của nghệ nhân và tâm huyết lưu giữ tinh hoa văn hóa đất Việt.',
    about_paragraph2: 'Chúng tôi không chỉ tạo ra sản phẩm – chúng tôi gìn giữ câu chuyện của đất, của lửa, của con người Vĩnh Long qua từng đường nét hoa văn tinh xảo.',
    about_years: '20+',
    about_image: '/about_artisan.png',

    // Featured 3D Product
    featured_3d_product_id: '',
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings()
        // Override default values with db values if they exist
        setFormData(prev => ({
          ...prev,
          ...settings
        }))
      } catch (error) {
        console.error('Lỗi khi tải cấu hình', error)
      }

      try {
        const products = await getProductsWith3DModel()
        setProducts3D(products)
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm 3D', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const confirmSave = async () => {
    setShowConfirm(false)
    setSubmitting(true)
    setMessage(null)

    const result = await updateSiteSettings(formData)
    
    setSubmitting(false)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Đã lưu cấu hình trang chủ thành công!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const renderMessageToast = () => {
    if (!message) return null
    return (
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium
          ${
            message.type === 'success'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
          }`}
        style={{ animation: 'dash-fade-in 0.3s ease-out' }}
      >
        {message.type === 'success' ? (
          <CheckCircle2 size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
        {message.text}
        <button
          onClick={() => setMessage(null)}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dash-animate-in">
        <div className="dash-empty-state">
          <div className="dash-upload-spinner" />
          <p className="dash-empty-state-desc mt-4">Đang tải cấu hình...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-animate-in pb-12">
      {renderMessageToast()}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="dash-page-title">Cài đặt trang chủ</h2>
          <span className="dash-page-title-underline" />
          <p className="dash-page-desc">
            Tùy chỉnh nội dung hiển thị trên trang chủ
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: HERO BANNER */}
        <div className="dash-card p-6">
          <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
            <h3 className="font-heading text-lg font-medium text-[var(--color-forest)] flex items-center gap-2">
              <LayoutTemplate size={18} />
              Section 1: Hero Banner
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="dash-label">Tagline</label>
                <input
                  type="text"
                  className="dash-input"
                  value={formData.hero_tagline}
                  onChange={(e) => handleChange('hero_tagline', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="dash-label">Tiêu đề - Dòng 1</label>
                  <input
                    type="text"
                     className="dash-input"
                    value={formData.hero_title_line1}
                    onChange={(e) => handleChange('hero_title_line1', e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Từ khóa nổi bật (Màu vàng)</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={formData.hero_title_highlight}
                    onChange={(e) => handleChange('hero_title_highlight', e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Tiêu đề - Dòng 2</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={formData.hero_title_line2}
                    onChange={(e) => handleChange('hero_title_line2', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="dash-label">Mô tả ngắn (Subtitle)</label>
                <textarea
                  className="dash-textarea"
                  rows={4}
                  value={formData.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="dash-label">Ảnh nền (Background)</label>
              <UploadProductImage
                currentUrl={formData.hero_bg_image}
                onUploadSuccess={(url) => handleChange('hero_bg_image', url)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ABOUT US */}
        <div className="dash-card p-6">
          <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
            <h3 className="font-heading text-lg font-medium text-[var(--color-forest)] flex items-center gap-2">
              <LayoutTemplate size={18} />
              Section 2: Về Chúng Tôi
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="dash-label">Tagline</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={formData.about_tagline}
                    onChange={(e) => handleChange('about_tagline', e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Số năm kinh nghiệm</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={formData.about_years}
                    onChange={(e) => handleChange('about_years', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="dash-label">Tiêu đề chính</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={formData.about_title_line1}
                    onChange={(e) => handleChange('about_title_line1', e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Từ khóa nổi bật (Màu đồng)</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={formData.about_title_highlight}
                    onChange={(e) => handleChange('about_title_highlight', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="dash-label">Đoạn văn 1</label>
                <textarea
                  className="dash-textarea"
                  rows={4}
                  value={formData.about_paragraph1}
                  onChange={(e) => handleChange('about_paragraph1', e.target.value)}
                />
              </div>

              <div>
                <label className="dash-label">Đoạn văn 2</label>
                <textarea
                  className="dash-textarea"
                  rows={3}
                  value={formData.about_paragraph2}
                  onChange={(e) => handleChange('about_paragraph2', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="dash-label">Ảnh minh họa</label>
              <UploadProductImage
                currentUrl={formData.about_image}
                onUploadSuccess={(url) => handleChange('about_image', url)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SẢN PHẨM 3D NỔI BẬT */}
        <div className="dash-card p-6">
          <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
            <h3 className="font-heading text-lg font-medium text-[var(--color-forest)] flex items-center gap-2">
              <LayoutTemplate size={18} />
              Section 3: Sản Phẩm 3D Nổi Bật (Trang chủ)
            </h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="dash-label">Chọn sản phẩm hiển thị 3D</label>
              <select
                className="dash-input"
                value={formData.featured_3d_product_id}
                onChange={(e) => handleChange('featured_3d_product_id', e.target.value)}
              >
                <option value="">-- Không hiển thị phần 3D --</option>
                {products3D.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-[var(--color-slate)] mt-2">
                Phần này sẽ hiển thị mô hình 3D của sản phẩm ngay tại trang chủ để người dùng tương tác trực tiếp. (Chỉ những sản phẩm có mô hình 3D mới xuất hiện ở đây).
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end sticky bottom-8">
          <button
            type="submit"
            className="dash-btn-primary px-8 py-3 shadow-xl"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu cấu hình
              </>
            )}
          </button>
        </div>

      </form>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn lưu các thay đổi này? Thay đổi sẽ hiển thị ngay lập tức trên trang chủ.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="dash-btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="dash-btn-primary"
              onClick={confirmSave}
            >
              Xác nhận lưu
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
