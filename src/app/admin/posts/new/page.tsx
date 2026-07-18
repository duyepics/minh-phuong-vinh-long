'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { createPost } from '../actions'
import UploadProductImage from '@/components/admin/UploadProductImage'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [published, setPublished] = useState(false)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadingContentImage, setUploadingContentImage] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const contentImageInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const triggerContentImageUpload = () => {
    contentImageInputRef.current?.click()
  }

  const insertImageIntoContent = (url: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    // Insert an HTML image tag with some default classes at cursor position
    const imgTag = `\n<img src="${url}" alt="Ảnh bài viết" className="my-6 rounded-xl mx-auto shadow-md max-w-full h-auto" />\n`

    const newContent = text.substring(0, start) + imgTag + text.substring(end)
    setContent(newContent)

    // Focus back on textarea and move cursor position to end of inserted image
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + imgTag.length
    }, 100)
  }

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingContentImage(true)
    setMessage(null)

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

      insertImageIntoContent(result.url)
      setMessage({ type: 'success', text: 'Tải và chèn ảnh thành công!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải ảnh lên.'
      setMessage({
        type: 'error',
        text: errMsg,
      })
    } finally {
      setUploadingContentImage(false)
      if (contentImageInputRef.current) {
        contentImageInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSaveConfirm(true)
  }

  const confirmSave = async () => {
    setShowSaveConfirm(false)
    setSubmitting(true)
    setMessage(null)

    const res = await createPost({ title, content, published, imageUrl })
    setSubmitting(false)

    if (res.error) {
      setMessage({ type: 'error', text: res.error })
    } else {
      setMessage({ type: 'success', text: 'Tạo bài viết mới thành công!' })
      // Redirect back to list
      setTimeout(() => {
        router.push('/admin/posts')
        router.refresh()
      }, 1200)
    }
  }

  return (
    <div className="dash-animate-in">
      {/* Toast Notification */}
      {message && (
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
            <CheckCircle2 size={18} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="flex-shrink-0" />
          )}
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="dash-btn-ghost">
          <ArrowLeft size={18} />
          Quay lại
        </Link>
        <div>
          <h2 className="dash-page-title">Thêm bài viết mới</h2>
          <span className="dash-page-title-underline" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="dash-card p-6 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="dash-label" htmlFor="post-title">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              className="dash-input"
              placeholder="Nhập tiêu đề bài viết..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Ảnh đại diện bài viết */}
          <div>
            <label className="dash-label">Ảnh đại diện bài viết</label>
            <UploadProductImage
              onUploadSuccess={(url) => setImageUrl(url)}
              currentUrl={imageUrl}
            />
          </div>

          {/* Trạng thái published */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFAF8] border border-[#E0DCD4]">
            <div>
              <p className="text-sm font-medium text-[#1C2B2B]">Trạng thái xuất bản</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Bật để cho phép hiển thị bài viết trên trang công khai.
              </p>
            </div>
            <label className="dash-toggle">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span className="dash-toggle-track" />
            </label>
          </div>

          {/* Nội dung soạn thảo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="dash-label !mb-0" htmlFor="post-content">
                Nội dung bài viết
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerContentImageUpload}
                  disabled={uploadingContentImage}
                  className="dash-action-link flex items-center gap-2 cursor-pointer text-xs"
                >
                  {uploadingContentImage ? (
                    <>
                      <div className="w-3 h-3 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                      Đang tải ảnh lên...
                    </>
                  ) : (
                    <>
                      <ImageIcon size={14} />
                      Chèn ảnh vào nội dung
                    </>
                  )}
                </button>
                <input
                  ref={contentImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleContentImageUpload}
                  className="hidden"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            
            <RichTextEditor
              value={content}
              onChange={(value) => setContent(value)}
              placeholder="Soạn thảo nội dung bài viết..."
            />
          </div>

          {/* Nút lưu / hủy */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0DCD4]">
            <Link href="/admin/posts" className="dash-btn-secondary">
              Hủy
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="dash-btn-primary min-w-[140px]"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Lưu bài viết
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận tạo bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn tạo bài viết này không?
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
