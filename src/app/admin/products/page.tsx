'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Package,
  Plus,
  ArrowLeft,
  Box,
  Trash2,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Pencil,
  Search,
  Filter,
} from 'lucide-react'
import Upload3DModel from '@/components/admin/Upload3DModel'
import UploadProductImage from '@/components/admin/UploadProductImage'
import { getProducts, createProduct, deleteProduct, updateProduct } from './actions'
import { getCategoriesFlat } from '../categories/actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | null
  imageUrl: string | null
  model3dUrl: string | null
  categoryId: string | null
  category: { id: string; name: string; slug: string } | null
  height: string | null
  width: string | null
  baseDiameter: string | null
  capacity: string | null
  weight: string | null
  glazeType: string | null
  material: string | null
  pattern: string | null
  artisan: string | null
  packing: string | null
  usageNotes: string | null
  origin: string | null
  hotspots?: { position: string; normal: string; label: string }[]
  images?: { id: string; url: string; label: string | null }[]
  createdAt: Date
  updatedAt: Date
}

type Category = {
  id: string
  name: string
  slug: string
  parentId: string | null
}

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminProducts() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | '3d'>('general')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    imageUrl: '',
    model3dUrl: '',
    categoryId: '',
    height: '',
    width: '',
    baseDiameter: '',
    capacity: '',
    weight: '',
    glazeType: '',
    material: '',
    pattern: '',
    artisan: '',
    packing: '',
    usageNotes: '',
    origin: '',
    hotspots: [] as { position: string; normal: string; label: string }[],
    images: [] as { url: string; label: string }[],
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategoriesFlat(),
    ])
    setProducts(productsData as Product[])
    setCategories(categoriesData as Category[])
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([getProducts(), getCategoriesFlat()]).then(([productsData, categoriesData]) => {
      if (active) {
        setProducts(productsData as Product[])
        setCategories(categoriesData as Category[])
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const handleUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, model3dUrl: url }))
  }

  const handleImageUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      imageUrl: '',
      model3dUrl: '',
      categoryId: '',
      height: '',
      width: '',
      baseDiameter: '',
      capacity: '',
      weight: '',
      glazeType: '',
      material: '',
      pattern: '',
      artisan: '',
      packing: '',
      usageNotes: '',
      origin: '',
      hotspots: [],
      images: [],
    })
    setEditingId(null)
    setMessage(null)
    setActiveTab('general')
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      imageUrl: product.imageUrl || '',
      model3dUrl: product.model3dUrl || '',
      categoryId: product.categoryId || '',
      height: product.height || '',
      width: product.width || '',
      baseDiameter: product.baseDiameter || '',
      capacity: product.capacity || '',
      weight: product.weight || '',
      glazeType: product.glazeType || '',
      material: product.material || '',
      pattern: product.pattern || '',
      artisan: product.artisan || '',
      packing: product.packing || '',
      usageNotes: product.usageNotes || '',
      origin: product.origin || '',
      hotspots: product.hotspots || [],
      images: product.images ? product.images.map(img => ({ url: img.url, label: img.label || '' })) : [],
    })
    setEditingId(product.id)
    setViewMode('edit')
    setActiveTab('general')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSaveConfirm(true)
  }

  const confirmSave = async () => {
    setShowSaveConfirm(false)
    setSubmitting(true)
    setMessage(null)

    const fd = new FormData()
    fd.set('name', formData.name)
    fd.set('slug', formData.slug)
    fd.set('description', formData.description)
    fd.set('price', formData.price)
    fd.set('imageUrl', formData.imageUrl)
    fd.set('model3dUrl', formData.model3dUrl)
    fd.set('categoryId', formData.categoryId)
    fd.set('height', formData.height)
    fd.set('width', formData.width)
    fd.set('baseDiameter', formData.baseDiameter)
    fd.set('capacity', formData.capacity)
    fd.set('weight', formData.weight)
    fd.set('glazeType', formData.glazeType)
    fd.set('material', formData.material)
    fd.set('pattern', formData.pattern)
    fd.set('artisan', formData.artisan)
    fd.set('packing', formData.packing)
    fd.set('usageNotes', formData.usageNotes)
    fd.set('origin', formData.origin)
    fd.set('hotspots', JSON.stringify(formData.hotspots))
    fd.set('images', JSON.stringify(formData.images))

    let result
    if (viewMode === 'edit' && editingId) {
      result = await updateProduct(editingId, fd)
    } else {
      result = await createProduct(fd)
    }
    setSubmitting(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({
        type: 'success',
        text: viewMode === 'edit'
          ? 'Cập nhật sản phẩm thành công!'
          : 'Tạo sản phẩm thành công!',
      })
      await fetchData()
      setTimeout(() => {
        setViewMode('list')
        resetForm()
      }, 1200)
    }
  }

  const handleParseHtml = (html: string) => {
    if (!html.trim()) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const hotspotButtons = doc.querySelectorAll('button.Hotspot');
      
      const newHotspots: { position: string; normal: string; label: string }[] = [];
      
      hotspotButtons.forEach(btn => {
        const position = btn.getAttribute('data-position') || '';
        const normal = btn.getAttribute('data-normal') || '';
        const labelEl = btn.querySelector('.HotspotAnnotation');
        const label = labelEl ? labelEl.textContent?.trim().replace(/\s+/g, ' ') || '' : '';
        
        if (position && normal) {
          newHotspots.push({ position, normal, label });
        }
      });
      
      if (newHotspots.length > 0) {
        setFormData(prev => ({
          ...prev,
          hotspots: [...prev.hotspots, ...newHotspots]
        }));
        setMessage({ type: 'success', text: `Đã trích xuất ${newHotspots.length} điểm chú thích thành công!` });
      } else {
        setMessage({ type: 'error', text: 'Không tìm thấy điểm chú thích nào trong đoạn mã.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Mã HTML không hợp lệ.' });
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Đã xóa sản phẩm thành công!' })
      await fetchData()
      setTimeout(() => setMessage(null), 3000)
    }
    setDeleteConfirm(null)
  }

  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingGallery(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Tải ảnh lên thất bại')
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: result.url, label: '' }]
      }))
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Lỗi tải ảnh lên' })
    } finally {
      setIsUploadingGallery(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // ─── TOAST ────────────────────────────────────────────
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

  // ─── LIST VIEW ─────────────────────────────────────────
  if (viewMode === 'list') {
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.slug.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = 
        filterCategory === 'all' || 
        product.categoryId === filterCategory || 
        categories.find(c => c.id === product.categoryId)?.parentId === filterCategory
      return matchesSearch && matchesCategory
    })

    return (
      <div className="dash-animate-in">
        {renderMessageToast()}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="dash-page-title">Sản phẩm 3D</h2>
            <span className="dash-page-title-underline" />
            <p className="dash-page-desc">
              Quản lý mô hình 3D của các sản phẩm gốm sứ
            </p>
          </div>
          <button
            className="dash-btn-primary"
            onClick={() => {
              resetForm()
              setViewMode('create')
            }}
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc đường dẫn..."
              className="dash-input !pl-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="dash-select !pl-11"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories
                .filter((cat) => !cat.parentId)
                .flatMap((parentCat) => {
                  const children = categories.filter((c) => c.parentId === parentCat.id)
                  
                  return [
                    <option 
                      key={parentCat.id} 
                      value={parentCat.id}
                      className="font-bold text-[#1C2B2B]"
                    >
                      {parentCat.name}
                    </option>,
                    ...children.map((childCat) => (
                      <option key={childCat.id} value={childCat.id}>
                        &nbsp;&nbsp;&nbsp;— {childCat.name}
                      </option>
                    ))
                  ]
                })}
            </select>
          </div>
        </div>

        {/* Products Table or Empty State */}
        <div className="dash-card dash-animate-in-delay-1 overflow-hidden">
          {loading ? (
            <div className="dash-empty-state">
              <div className="dash-upload-spinner" />
              <p className="dash-empty-state-desc mt-4">
                Đang tải sản phẩm...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="dash-empty-state">
              <Package className="dash-empty-state-icon" size={56} />
              <p className="dash-empty-state-title">
                Chưa có sản phẩm nào
              </p>
              <p className="dash-empty-state-desc">
                Hãy nhấn &quot;Thêm sản phẩm&quot; để bắt đầu tải lên mô hình
                3D đầu tiên.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="dash-empty-state">
              <Search className="dash-empty-state-icon" size={56} />
              <p className="dash-empty-state-title">
                Không tìm thấy sản phẩm
              </p>
              <p className="dash-empty-state-desc">
                Không có sản phẩm nào phù hợp với bộ lọc và tìm kiếm của bạn.
              </p>
            </div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Mô hình 3D</th>
                  <th style={{ textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E0DCD4]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#F5F1EB] border border-[#E0DCD4] flex items-center justify-center">
                            <Package
                              size={16}
                              className="text-gray-400"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {product.name}
                          </p>
                          <code className="text-xs text-gray-400">
                            /{product.slug}
                          </code>
                        </div>
                      </div>
                    </td>
                    <td>
                      {product.category ? (
                        <span className="dash-badge dash-badge-gold">
                          <FolderTree size={12} />
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Chưa phân loại
                        </span>
                      )}
                    </td>
                    <td>
                      {product.model3dUrl ? (
                        <a
                          href={product.model3dUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dash-badge dash-badge-green"
                        >
                          <Box size={12} />
                          Đã có
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="dash-badge dash-badge-gray">
                          Chưa có
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="dash-btn-ghost !p-2 !rounded-lg"
                          onClick={() => handleEdit(product)}
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="dash-btn-danger"
                          onClick={() => setDeleteConfirm(product.id)}
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-sm text-gray-500">
                    Tổng cộng: {filteredProducts.length} sản phẩm
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                className="dash-btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="dash-btn-primary !bg-red-600 hover:!bg-red-700 !text-white"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              >
                Xác nhận xóa
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ─── CREATE VIEW ───────────────────────────────────────
  return (
    <div className="dash-animate-in">
      {renderMessageToast()}

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="dash-btn-ghost"
          onClick={() => {
            setViewMode('list')
            resetForm()
          }}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <div>
          <h2 className="dash-page-title">
            {viewMode === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <span className="dash-page-title-underline" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex border-b border-[#E0DCD4] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'general'
                ? 'border-[var(--color-teak)] text-[var(--color-forest)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thông tin chung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'specs'
                ? 'border-[var(--color-teak)] text-[var(--color-forest)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thông số kỹ thuật
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === '3d'
                ? 'border-[var(--color-teak)] text-[var(--color-forest)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mô hình 3D
          </button>
        </div>

        {/* ─── TAB: THÔNG TIN CHUNG ──────── */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 dash-animate-in">
            <div className="space-y-6">
              <div className="dash-card p-6">
                <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
                  <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                    Thông tin cơ bản
                  </h3>
                </div>
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="dash-label" htmlFor="product-name">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      className="dash-input"
                      placeholder="Ví dụ: Bình hoa Sen Vàng"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="dash-label" htmlFor="product-category">
                      <FolderTree
                        size={14}
                        className="inline-block mr-1.5 -mt-0.5"
                      />
                      Danh mục
                    </label>
                    <select
                      id="product-category"
                      className="dash-select"
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                    >
                      <option value="">— Chưa phân loại —</option>
                      {categories
                        .filter((cat) => cat.parentId !== null)
                        .map((cat) => {
                          const parent = categories.find((c) => c.id === cat.parentId)
                          const displayName = parent ? `${parent.name} ➔ ${cat.name}` : cat.name
                          return (
                            <option key={cat.id} value={cat.id}>
                              {displayName}
                            </option>
                          )
                        })}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Chọn danh mục con cho sản phẩm. Chỉ các danh mục con (danh mục có cấp cha) mới được hiển thị ở đây.
                    </p>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="dash-label" htmlFor="product-slug">
                      Đường dẫn (slug)
                    </label>
                    <input
                      id="product-slug"
                      type="text"
                      className="dash-input"
                      placeholder="tu-dong-tao-tu-ten"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Tự động tạo từ tên sản phẩm. Có thể chỉnh sửa.
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="dash-label" htmlFor="product-price">
                      Giá sản phẩm (VNĐ)
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      className="dash-input"
                      placeholder="Ví dụ: 150000 (để trống nếu Liên hệ)"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="dash-label"
                      htmlFor="product-description"
                    >
                      Mô tả
                    </label>
                    <textarea
                      id="product-description"
                      className="dash-textarea"
                      rows={6}
                      placeholder="Mô tả chi tiết về sản phẩm gốm sứ..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="dash-card p-6">
                <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
                  <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                    Hình ảnh sản phẩm
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="dash-label">
                      Ảnh đại diện sản phẩm chính
                    </label>
                    <UploadProductImage
                      onUploadSuccess={handleImageUploadSuccess}
                      currentUrl={formData.imageUrl}
                    />
                  </div>

                  {/* Thư viện ảnh (Gallery) */}
                  <div className="pt-6 border-t border-[#E0DCD4]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="dash-label mb-0 block">
                          Thư viện ảnh chi tiết
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Tải lên các ảnh góc chụp khác (Mặt trước, sau, trái, phải...)
                        </p>
                      </div>
                      
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleGalleryFileSelect}
                      />
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingGallery}
                        className="dash-btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1 shrink-0"
                      >
                        {isUploadingGallery ? (
                          <div className="w-3.5 h-3.5 border-2 border-[var(--color-teak)] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                        Thêm ảnh
                      </button>
                    </div>

                    {formData.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative p-2 border border-[#E0DCD4] rounded-lg bg-[#F5F1EB]/50 group">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx)
                                }))
                              }}
                              className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 z-10"
                              title="Xóa ảnh"
                            >
                              <X size={14} />
                            </button>
                            <img src={img.url} alt="Gallery image" className="w-full aspect-square object-cover rounded mb-2 border border-[#E0DCD4]" />
                            <input
                              type="text"
                              placeholder="Nhãn (VD: Mặt trước)"
                              value={img.label}
                              onChange={(e) => {
                                const newImages = [...formData.images];
                                newImages[idx].label = e.target.value;
                                setFormData(prev => ({ ...prev, images: newImages }));
                              }}
                              className="dash-input !py-1.5 !text-xs w-full"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-[#F5F1EB]/50 rounded-xl border border-dashed border-[#E0DCD4]">
                        <p className="text-sm text-gray-500">Chưa có ảnh chi tiết nào.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: THÔNG SỐ KỸ THUẬT ──────── */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 dash-animate-in">
            <div className="space-y-6">
              {/* ─── Thông số vật lý & Kỹ thuật ─── */}
              <div className="dash-card p-6">
                <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
                  <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                    Thông số Vật lý & Kỹ thuật
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="dash-label">Chiều cao</label>
                    <input type="text" className="dash-input" placeholder="VD: 20 cm" value={formData.height} onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Đường kính miệng/rộng</label>
                    <input type="text" className="dash-input" placeholder="VD: 15 cm" value={formData.width} onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Đường kính đáy</label>
                    <input type="text" className="dash-input" placeholder="VD: 10 cm" value={formData.baseDiameter} onChange={(e) => setFormData(prev => ({ ...prev, baseDiameter: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Dung tích</label>
                    <input type="text" className="dash-input" placeholder="VD: 500 ml" value={formData.capacity} onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="dash-label">Trọng lượng (tịnh)</label>
                    <input type="text" className="dash-input" placeholder="VD: 1.2 kg" value={formData.weight} onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* ─── Thuộc tính mỹ thuật ─── */}
              <div className="dash-card p-6">
                <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
                  <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                    Thuộc tính Mỹ thuật
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="dash-label">Loại men</label>
                    <input type="text" className="dash-input" placeholder="VD: Men hỏa biến" value={formData.glazeType} onChange={(e) => setFormData(prev => ({ ...prev, glazeType: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Chất liệu cốt gốm</label>
                    <input type="text" className="dash-input" placeholder="VD: Sứ xương" value={formData.material} onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="dash-label">Họa tiết</label>
                    <input type="text" className="dash-input" placeholder="VD: Vẽ tay sơn thủy" value={formData.pattern} onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="dash-label">Nghệ nhân / Xưởng</label>
                    <input type="text" className="dash-input" placeholder="VD: Xưởng gốm cổ" value={formData.artisan} onChange={(e) => setFormData(prev => ({ ...prev, artisan: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* ─── Quản lý vận hành ─── */}
              <div className="dash-card p-6">
                <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
                  <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                    Vận hành & Xuất xứ
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="dash-label">Quy cách đóng gói</label>
                    <input type="text" className="dash-input" placeholder="VD: Thùng xốp, 20 pcs/ctn" value={formData.packing} onChange={(e) => setFormData(prev => ({ ...prev, packing: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Lưu ý sử dụng</label>
                    <input type="text" className="dash-input" placeholder="VD: Dùng được lò vi sóng" value={formData.usageNotes} onChange={(e) => setFormData(prev => ({ ...prev, usageNotes: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Xuất xứ</label>
                    <input type="text" className="dash-input" placeholder="VD: Bát Tràng, Việt Nam" value={formData.origin} onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: MÔ HÌNH 3D ──────── */}
        {activeTab === '3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 dash-animate-in">
            <div className="dash-card p-6">
              <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
                <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                  <Box size={18} className="inline-block mr-2 -mt-0.5" />
                  Mô hình 3D
                </h3>
                {formData.model3dUrl && (
                  <span className="dash-badge dash-badge-green">
                    Đã tải lên
                  </span>
                )}
              </div>

              <Upload3DModel
                onUploadSuccess={handleUploadSuccess}
                currentUrl={formData.model3dUrl}
              />

              {formData.model3dUrl && (
                <div className="mt-4 p-3 rounded-lg bg-[#F5F1EB] border border-[#E0DCD4]">
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    Public URL:
                  </p>
                  <p className="text-xs text-[var(--color-teak)] break-all font-mono">
                    {formData.model3dUrl}
                  </p>
                </div>
              )}
            </div>

            {/* Hotspots Section */}
            {formData.model3dUrl ? (
              <div className="dash-card p-6">
                <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                    Điểm chú thích (Hotspots)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      hotspots: [...prev.hotspots, { position: '', normal: '', label: '' }]
                    }))}
                    className="dash-btn-ghost text-xs py-1.5"
                  >
                    <Plus size={14} className="mr-1" />
                    Thêm điểm
                  </button>
                </div>
                
                {/* Auto Import from HTML */}
                <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <label className="text-xs font-medium text-blue-800 mb-2 block">
                    Nhập tự động từ mã HTML (Model Viewer Editor)
                  </label>
                  <textarea
                    className="dash-textarea !py-2 !text-xs !min-h-[60px] !bg-white/80"
                    placeholder="Dán đoạn code <model-viewer> chứa các <button class='Hotspot'> vào đây..."
                    onChange={(e) => {
                      if (e.target.value) {
                        handleParseHtml(e.target.value);
                        e.target.value = ''; // Reset sau khi parse
                      }
                    }}
                  />
                  <p className="text-[10px] text-blue-600 mt-1.5">
                    Dán toàn bộ thẻ &lt;model-viewer&gt; hoặc chỉ các thẻ &lt;button class=&quot;Hotspot&quot;&gt; để hệ thống tự động trích xuất tọa độ.
                  </p>
                </div>

                {formData.hotspots.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-500 bg-[#F5F1EB]/50 rounded-xl border border-dashed border-[#E0DCD4]">
                    Chưa có điểm chú thích nào.<br />
                    Mở <a href="https://modelviewer.dev/editor/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold)] hover:underline">Model Viewer Editor</a>, nhấp đúp vào mô hình và copy tọa độ vào đây.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.hotspots.map((hotspot, index) => (
                      <div key={index} className="p-4 bg-[#F5F1EB]/50 border border-[#E0DCD4] rounded-xl relative group">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            hotspots: prev.hotspots.filter((_, i) => i !== index)
                          }))}
                          className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Position (Tọa độ)</label>
                              <input
                                type="text"
                                className="dash-input !py-1.5 !text-sm"
                                placeholder="0m 0m 0m"
                                value={hotspot.position}
                                onChange={(e) => {
                                  const newHotspots = [...formData.hotspots];
                                  newHotspots[index].position = e.target.value;
                                  setFormData(prev => ({ ...prev, hotspots: newHotspots }));
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Normal (Pháp tuyến)</label>
                              <input
                                type="text"
                                className="dash-input !py-1.5 !text-sm"
                                placeholder="0m 1m 0m"
                                value={hotspot.normal}
                                onChange={(e) => {
                                  const newHotspots = [...formData.hotspots];
                                  newHotspots[index].normal = e.target.value;
                                  setFormData(prev => ({ ...prev, hotspots: newHotspots }));
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Label (Nội dung chú thích)</label>
                            <input
                              type="text"
                              className="dash-input !py-1.5 !text-sm"
                              placeholder="Ví dụ: Chất liệu gốm sứ Bát Tràng"
                              value={hotspot.label}
                              onChange={(e) => {
                                const newHotspots = [...formData.hotspots];
                                newHotspots[index].label = e.target.value;
                                setFormData(prev => ({ ...prev, hotspots: newHotspots }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center dash-card p-6 bg-[#F5F1EB]/30 border-dashed border-[#E0DCD4]">
                <p className="text-sm text-gray-500">Vui lòng tải lên mô hình 3D để thêm điểm chú thích.</p>
              </div>
            )}
          </div>
        )}

        {/* Submit Container - Always Visible */}
        <div className="mt-8 pt-6 border-t border-[#E0DCD4] flex justify-end">
          <div className="w-full lg:w-1/3">
            <button
              type="submit"
              className="dash-btn-primary w-full justify-center py-3 text-base shadow-lg"
              disabled={!formData.name || submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Package size={18} />
                  {viewMode === 'edit' ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Bạn có thể lưu ở bất kỳ tab nào
            </p>
          </div>
        </div>
      </form>

      <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn lưu thông tin sản phẩm này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="dash-btn-secondary"
              onClick={() => setShowSaveConfirm(false)}
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
