'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FolderTree,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  ChevronRight,
  Package,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type CategoryWithRelations = {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent: { id: string; name: string } | null
  children: { id: string; name: string }[]
  _count: { products: number }
  createdAt: Date
  updatedAt: Date
}

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminCategories() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [categories, setCategories] = useState<CategoryWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
  })
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const data = await getCategories()
    setCategories(data as CategoryWithRelations[])
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    getCategories().then((data) => {
      if (active) {
        setCategories(data as CategoryWithRelations[])
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  // Auto-generate slug
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
    setFormData({ name: '', slug: '', parentId: '' })
    setEditingId(null)
    setMessage(null)
  }

  const handleCreate = () => {
    resetForm()
    setViewMode('create')
  }

  const handleEdit = (category: CategoryWithRelations) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || '',
    })
    setEditingId(category.id)
    setViewMode('edit')
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
    fd.set('parentId', formData.parentId)

    let result
    if (viewMode === 'edit' && editingId) {
      result = await updateCategory(editingId, fd)
    } else {
      result = await createCategory(fd)
    }

    setSubmitting(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({
        type: 'success',
        text: viewMode === 'edit'
          ? 'Cập nhật danh mục thành công!'
          : 'Tạo danh mục thành công!',
      })
      await fetchCategories()
      setTimeout(() => {
        setViewMode('list')
        resetForm()
      }, 1200)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
      setDeleteConfirm(null)
    } else {
      setMessage({ type: 'success', text: 'Đã xóa danh mục thành công!' })
      setDeleteConfirm(null)
      await fetchCategories()
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Sắp xếp dạng cây: danh mục cha trước, con sau (thụt lề)
  const buildTree = () => {
    const roots = categories.filter((c) => !c.parentId)
    const result: { category: CategoryWithRelations; depth: number }[] = []

    const addChildren = (
      parentId: string,
      depth: number
    ) => {
      const children = categories.filter((c) => c.parentId === parentId)
      children.forEach((child) => {
        result.push({ category: child, depth })
        addChildren(child.id, depth + 1)
      })
    }

    roots.forEach((root) => {
      result.push({ category: root, depth: 0 })
      addChildren(root.id, 1)
    })

    return result
  }

  // ─── TOAST / MESSAGE ──────────────────────────────────
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

  // ─── LIST VIEW ────────────────────────────────────────
  if (viewMode === 'list') {
    const tree = buildTree()

    return (
      <div className="dash-animate-in">
        {renderMessageToast()}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="dash-page-title">Danh mục sản phẩm</h2>
            <span className="dash-page-title-underline" />
            <p className="dash-page-desc">
              Quản lý danh mục cho các sản phẩm gốm sứ
            </p>
          </div>
          <button className="dash-btn-primary" onClick={handleCreate}>
            <Plus size={18} />
            Thêm danh mục
          </button>
        </div>

        {/* Categories Table */}
        <div className="dash-card dash-animate-in-delay-1 overflow-hidden">
          {loading ? (
            <div className="dash-empty-state">
              <div className="dash-upload-spinner" />
              <p className="dash-empty-state-desc mt-4">
                Đang tải danh mục...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="dash-empty-state">
              <FolderTree className="dash-empty-state-icon" size={56} />
              <p className="dash-empty-state-title">
                Chưa có danh mục nào
              </p>
              <p className="dash-empty-state-desc">
                Hãy nhấn &quot;Thêm danh mục&quot; để tạo danh mục đầu tiên.
              </p>
            </div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Danh mục cha</th>
                  <th style={{ textAlign: 'center' }}>Sản phẩm</th>
                  <th style={{ textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tree.map(({ category, depth }) => (
                  <tr key={category.id}>
                    <td>
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${depth * 28}px` }}
                      >
                        {depth > 0 && (
                          <ChevronRight
                            size={14}
                            className="text-gray-400 flex-shrink-0"
                          />
                        )}
                        <FolderTree
                          size={16}
                          className={`flex-shrink-0 ${
                            depth === 0
                              ? 'text-[var(--color-teak)]'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td>
                      <code className="text-xs bg-[#F5F1EB] px-2 py-1 rounded-md text-[var(--color-slate)]">
                        {category.slug}
                      </code>
                    </td>
                    <td>
                      {category.parent ? (
                        <span className="dash-badge dash-badge-gold">
                          {category.parent.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {category._count.products > 0 ? (
                        <span className="dash-badge dash-badge-blue">
                          <Package size={12} />
                          {category._count.products}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">0</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="dash-btn-ghost !p-2 !rounded-lg"
                          onClick={() => handleEdit(category)}
                          title="Chỉnh sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="dash-btn-danger"
                          onClick={() => setDeleteConfirm(category.id)}
                          title="Xóa"
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
                  <td colSpan={5} className="text-sm text-gray-500">
                    Tổng cộng: {categories.length} danh mục
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
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

  // ─── CREATE / EDIT VIEW ───────────────────────────────
  // Danh mục có thể làm cha (loại trừ chính nó nếu đang edit)
  const availableParents = categories.filter((c) => c.id !== editingId)

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
            {viewMode === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <span className="dash-page-title-underline" />
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="dash-card p-6 dash-animate-in-delay-1">
            <div className="dash-section-header -mx-6 -mt-6 mb-6 px-6">
              <h3 className="font-heading text-lg font-medium text-[var(--color-forest)]">
                <FolderTree size={18} className="inline-block mr-2 -mt-0.5" />
                Thông tin danh mục
              </h3>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="dash-label" htmlFor="category-name">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  className="dash-input"
                  placeholder="Ví dụ: Bình hoa"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="dash-label" htmlFor="category-slug">
                  Đường dẫn (slug)
                </label>
                <input
                  id="category-slug"
                  type="text"
                  className="dash-input"
                  placeholder="tu-dong-tao-tu-ten"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tự động tạo từ tên. Có thể chỉnh sửa.
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label className="dash-label" htmlFor="category-parent">
                  Danh mục cha
                </label>
                <select
                  id="category-parent"
                  className="dash-select"
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentId: e.target.value,
                    }))
                  }
                >
                  <option value="">— Không có (danh mục gốc) —</option>
                  {availableParents.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parent ? `  └ ${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Chọn danh mục cha nếu đây là danh mục con.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="dash-card p-6 mt-6 dash-animate-in-delay-2">
            <button
              type="submit"
              className="dash-btn-primary w-full justify-center py-3 text-base"
              disabled={!formData.name || submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <FolderTree size={18} />
                  {viewMode === 'edit' ? 'Cập nhật danh mục' : 'Tạo danh mục'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn lưu thông tin danh mục này?
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
