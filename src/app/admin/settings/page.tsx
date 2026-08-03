'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, CheckCircle2, AlertCircle, X, LayoutTemplate, Star, ArrowUp, ArrowDown, Trash2, Package } from 'lucide-react'
import { getSiteSettings, updateSiteSettings, getProductsWith3DModel, getAllProductsForSelection } from './actions'
import UploadProductImage from '@/components/admin/UploadProductImage'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext'

interface Product3D {
  id: string
  name: string
  model3dUrl: string | null
}

interface SimpleProduct {
  id: string
  name: string
  imageUrl: string | null
  category?: { name: string } | null
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [products3D, setProducts3D] = useState<Product3D[]>([])
  const [allProducts, setAllProducts] = useState<SimpleProduct[]>([])

  // Default values
  const [formData, setFormData] = useState({
    // Hero Banner
    hero_tagline: 'Gốm Sứ Mỹ Nghệ Cao Cấp',
    hero_title_line1: 'Tinh Hoa Đất Việt',
    hero_title_highlight: 'Nâng Tầm',
    hero_title_line2: 'Không Gian',
    hero_subtitle: 'Chào mừng đến với cơ sở gốm sứ mỹ nghệ Minh Phương – Vĩnh Long. Những tác phẩm gốm sứ độc bản, tinh xảo được chế tác từ bàn tay các nghệ nhân lành nghề, kết hợp công nghệ tương tác 3D đột phá.',
    hero_bg_image: '/hero_pottery_bg.png',

    // Featured 3D Product
    featured_3d_product_id: '',

    // Featured Products Selection
    featured_product_ids: '[]',
  })

  const initialSettingsRef = useRef<typeof formData | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings()
        // Override default values with db values if they exist
        setFormData(prev => {
          const updated = {
            ...prev,
            ...settings
          }
          initialSettingsRef.current = updated
          return updated
        })
      } catch (error) {
        console.error('Lỗi khi tải cấu hình', error)
      }

      try {
        const [products, allProds] = await Promise.all([
          getProductsWith3DModel(),
          getAllProductsForSelection(),
        ])
        setProducts3D(products)
        setAllProducts(allProds)
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])


  const isDirty = initialSettingsRef.current !== null && JSON.stringify(formData) !== JSON.stringify(initialSettingsRef.current)
  const { setIsDirty: setGlobalIsDirty } = useUnsavedChanges()

  useEffect(() => {
    setGlobalIsDirty(isDirty)
    return () => setGlobalIsDirty(false)
  }, [isDirty, setGlobalIsDirty])

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  let selectedFeaturedIds: string[] = []
  try {
    selectedFeaturedIds = JSON.parse(formData.featured_product_ids || '[]')
  } catch {
    selectedFeaturedIds = []
  }

  const handleAddFeaturedProduct = (productId: string) => {
    if (!productId) return
    if (selectedFeaturedIds.includes(productId)) return
    const nextIds = [...selectedFeaturedIds, productId]
    setFormData(prev => ({ ...prev, featured_product_ids: JSON.stringify(nextIds) }))
  }

  const handleRemoveFeaturedProduct = (productId: string) => {
    const nextIds = selectedFeaturedIds.filter(id => id !== productId)
    setFormData(prev => ({ ...prev, featured_product_ids: JSON.stringify(nextIds) }))
  }

  const handleMoveFeaturedProduct = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= selectedFeaturedIds.length) return
    const nextIds = [...selectedFeaturedIds]
    const temp = nextIds[index]
    nextIds[index] = nextIds[targetIndex]
    nextIds[targetIndex] = temp
    setFormData(prev => ({ ...prev, featured_product_ids: JSON.stringify(nextIds) }))
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
      initialSettingsRef.current = formData
      setGlobalIsDirty(false)
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="dash-page-title">Cài đặt trang chủ</h2>
          <span className="dash-page-title-underline" />
          <p className="dash-page-desc">
            Tùy chỉnh nội dung, hình ảnh và thông tin hiển thị tại trang chủ
          </p>
        </div>

        {/* Action Button (Top Right Header) */}
        <div>
          <button
            type="submit"
            form="settings-form"
            className="dash-btn-primary px-6 py-3 shadow-md"
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
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        
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

        {/* SECTION 2: SẢN PHẨM 3D NỔI BẬT */}
        <div className="dash-card p-6">
          <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
            <h3 className="font-heading text-lg font-medium text-[var(--color-forest)] flex items-center gap-2">
              <LayoutTemplate size={18} />
              Section 2: Sản Phẩm 3D Nổi Bật (Trang chủ)
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

        {/* SECTION 3: SẢN PHẨM NỔI BẬT */}
        <div className="dash-card p-6">
          <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
            <h3 className="font-heading text-lg font-medium text-[var(--color-forest)] flex items-center gap-2">
              <Star size={18} className="text-amber-500 fill-amber-500" />
              Section 3: Sản Phẩm Nổi Bật (Trang chủ)
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="dash-label">Thêm sản phẩm vào danh sách Nổi Bật</label>
              <div className="flex gap-3">
                <select
                  className="dash-input flex-1"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddFeaturedProduct(e.target.value)
                    }
                  }}
                >
                  <option value="">-- Chọn sản phẩm để thêm vào Nổi Bật --</option>
                  {allProducts
                    .filter(p => !selectedFeaturedIds.includes(p.id))
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} {product.category ? `(${product.category.name})` : ''}
                      </option>
                    ))}
                </select>
              </div>
              <p className="text-sm text-[var(--color-slate)] mt-2">
                Chọn sản phẩm từ danh mục để đưa lên mục Sản Phẩm Nổi Bật tại trang chủ.
              </p>
            </div>

            {/* Selected products list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[var(--color-forest)]">
                  Danh sách sản phẩm nổi bật ({selectedFeaturedIds.length})
                </span>
                {selectedFeaturedIds.length > 0 && (
                  <span className="text-xs text-[var(--color-slate)]">
                    Dùng nút mũi tên để thay đổi vị trí sắp xếp
                  </span>
                )}
              </div>

              {selectedFeaturedIds.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Chưa chọn sản phẩm nổi bật nào</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Vui lòng chọn sản phẩm ở ô phía trên để hiển thị tại mục Sản Phẩm Nổi Bật trên trang chủ.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFeaturedIds.map((id, index) => {
                    const product = allProducts.find(p => p.id === id)
                    if (!product) return null
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-[var(--color-gold)] transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border">
                              <Package size={18} className="text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            {product.category && (
                              <span className="text-xs text-gray-500">
                                {product.category.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveFeaturedProduct(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Di chuyển lên"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveFeaturedProduct(index, 'down')}
                            disabled={index === selectedFeaturedIds.length - 1}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeaturedProduct(id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            title="Xóa khỏi danh sách"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
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
