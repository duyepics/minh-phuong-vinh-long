'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react'

interface UploadProductImageProps {
  onUploadSuccess: (url: string) => void
  currentUrl?: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

interface FileInfo {
  name: string
  size: number
  extension: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function UploadProductImage({ onUploadSuccess, currentUrl }: UploadProductImageProps) {
  const [uploadState, setUploadState] = useState<UploadState>(currentUrl ? 'success' : 'idle')
  const [isJustUploaded, setIsJustUploaded] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || '')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keep track of the URL from prop to reset local state when it changes during render
  const [prevCurrentUrl, setPrevCurrentUrl] = useState(currentUrl)
  if (currentUrl !== prevCurrentUrl) {
    setPrevCurrentUrl(currentUrl)
    if (currentUrl) {
      setUploadedUrl(currentUrl)
      setUploadState('success')
      setIsJustUploaded(false)
    } else {
      setUploadState('idle')
      setUploadedUrl('')
      setIsJustUploaded(false)
    }
  }

  const validateFile = useCallback((file: File): string | null => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Định dạng "${ext}" không hợp lệ. Chỉ chấp nhận các đuôi ảnh: png, jpg, jpeg, webp, gif`
    }
    if (!file.type.startsWith('image/')) {
      return `File chọn không phải là định dạng hình ảnh.`
    }
    if (file.size > MAX_SIZE) {
      return `File ảnh quá lớn (${formatFileSize(file.size)}). Tối đa 10MB.`
    }
    return null
  }, [])

  const startUpload = async (file: File) => {
    setUploadState('uploading')
    setErrorMessage('')

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

      setUploadedUrl(result.url)
      setUploadState('success')
      setIsJustUploaded(true)
      onUploadSuccess(result.url)
    } catch (err) {
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải lên hình ảnh.')
    }
  }

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setUploadState('error')
      setErrorMessage(validationError)
      setFileInfo(null)
      return
    }

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    setFileInfo({
      name: file.name,
      size: file.size,
      extension: ext,
    })

    await startUpload(file)
  }, [validateFile, onUploadSuccess])

  const handleReset = () => {
    setUploadState('idle')
    setIsJustUploaded(false)
    setFileInfo(null)
    setErrorMessage('')
    setUploadedUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Also notify parent about removal of image
    onUploadSuccess('')
  }

  // ─── Drag & Drop handlers ──────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="dash-upload-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        id="upload-image-input"
        style={{ display: 'none' }}
      />

      {/* IDLE state — Drop Zone */}
      {uploadState === 'idle' && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="dash-badge dash-badge-yellow text-xs font-semibold">
              Chưa có ảnh đại diện
            </span>
            <span className="text-xs text-gray-500">
              Kéo thả ảnh hoặc click để chọn tệp từ máy tính
            </span>
          </div>
          <div
            className={`dash-dropzone ${isDragOver ? 'dash-dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openFilePicker()
            }}
          >
            <div className="dash-dropzone-content">
              <div className="dash-dropzone-icon">
                <Upload size={28} />
              </div>
              <p className="dash-dropzone-title">
                Kéo thả ảnh đại diện vào đây
              </p>
              <p className="dash-dropzone-subtitle">
                hoặc <span className="dash-dropzone-link">chọn từ máy tính</span>
              </p>
              <p className="dash-dropzone-hint">
                Định dạng: png, jpg, jpeg, webp, gif — Tối đa 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UPLOADING state */}
      {uploadState === 'uploading' && (
        <div className="dash-dropzone dash-dropzone-uploading">
          <div className="dash-upload-spinner" />
          <p className="dash-dropzone-title" style={{ marginTop: '1rem' }}>
            Đang tải ảnh lên...
          </p>
          <p className="dash-dropzone-subtitle text-xs text-gray-500">
            {fileInfo?.name}
          </p>
          <div className="dash-upload-progress-bar">
            <div className="dash-upload-progress-fill" />
          </div>
        </div>
      )}

      {/* SUCCESS state */}
      {uploadState === 'success' && (
        <div className={`dash-dropzone p-4 ${isJustUploaded ? 'dash-dropzone-success' : 'border-solid border-[#E0DCD4]'}`}>
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            {uploadedUrl && (
              <div className={`relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-sm border
                ${isJustUploaded ? 'border-[#A7F3D0]' : 'border-[#E0DCD4]'}`}
              >
                <img
                  src={uploadedUrl}
                  alt="Uploaded avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                {isJustUploaded ? (
                  <>
                    <CheckCircle className="text-[#047857]" size={20} />
                    <span className="text-[#047857] font-semibold text-sm">Tải ảnh lên thành công!</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="text-[#8B6C3E]" size={20} />
                    <span className="text-[#8B6C3E] font-semibold text-sm">Ảnh đại diện hiện tại</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 max-w-full truncate" title={uploadedUrl}>
                URL: {uploadedUrl}
              </p>
              
              <button
                type="button"
                className="dash-btn-secondary mt-4 px-4 py-2 text-sm"
                onClick={handleReset}
              >
                Thay đổi ảnh khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR state */}
      {uploadState === 'error' && (
        <div className="dash-dropzone dash-dropzone-error">
          <div className="dash-upload-error-icon">
            <AlertCircle size={36} />
          </div>
          <p className="dash-dropzone-title" style={{ color: '#DC2626' }}>
            Tải lên thất bại
          </p>
          <p className="dash-dropzone-subtitle" style={{ color: '#B91C1C' }}>
            {errorMessage}
          </p>
          <button
            type="button"
            className="dash-btn-secondary"
            onClick={handleReset}
            style={{ marginTop: '0.75rem' }}
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  )
}
