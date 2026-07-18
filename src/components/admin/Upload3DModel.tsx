'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle, AlertCircle, Box, FileUp } from 'lucide-react'

interface Upload3DModelProps {
  onUploadSuccess: (url: string) => void
  currentUrl?: string
}

type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error'

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

const ALLOWED_EXTENSIONS = ['.glb', '.gltf']
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

export default function Upload3DModel({ onUploadSuccess, currentUrl }: Upload3DModelProps) {
  const [uploadState, setUploadState] = useState<UploadState>(currentUrl ? 'success' : 'idle')
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedFileRef = useRef<File | null>(null)

  // Keep track of the URL from prop to reset local state when it changes during render
  const [prevCurrentUrl, setPrevCurrentUrl] = useState(currentUrl)
  if (currentUrl !== prevCurrentUrl) {
    setPrevCurrentUrl(currentUrl)
    if (currentUrl) {
      setUploadedUrl(currentUrl)
      setUploadState('success')
    } else {
      setUploadState('idle')
      setUploadedUrl('')
    }
  }


  const validateFile = useCallback((file: File): string | null => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Định dạng "${ext}" không hợp lệ. Chỉ chấp nhận .glb hoặc .gltf`
    }
    if (file.size > MAX_SIZE) {
      return `File quá lớn (${formatFileSize(file.size)}). Tối đa 50MB.`
    }
    return null
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setUploadState('error')
      setErrorMessage(validationError)
      setFileInfo(null)
      selectedFileRef.current = null
      return
    }

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    setFileInfo({
      name: file.name,
      size: file.size,
      extension: ext,
    })
    setUploadState('selected')
    setErrorMessage('')
    selectedFileRef.current = file
  }, [validateFile])

  const handleUpload = async () => {
    const file = selectedFileRef.current
    if (!file) return

    setUploadState('uploading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-3d', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload thất bại')
      }

      setUploadedUrl(result.url)
      setUploadState('success')
      onUploadSuccess(result.url)
    } catch (err) {
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải lên.')
    }
  }

  const handleReset = () => {
    setUploadState('idle')
    setFileInfo(null)
    setErrorMessage('')
    setUploadedUrl('')
    selectedFileRef.current = null
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

  // ─── Render ────────────────────────────────────────────
  return (
    <div className="dash-upload-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={handleInputChange}
        className="hidden"
        id="upload-3d-input"
        style={{ display: 'none' }}
      />

      {/* IDLE / SELECTED state — Drop Zone */}
      {(uploadState === 'idle' || uploadState === 'selected') && (
        <div
          className={`dash-dropzone ${isDragOver ? 'dash-dropzone-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={uploadState === 'idle' ? openFilePicker : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openFilePicker()
          }}
        >
          {uploadState === 'idle' ? (
            <div className="dash-dropzone-content">
              <div className="dash-dropzone-icon">
                <Upload size={28} />
              </div>
              <p className="dash-dropzone-title">
                Kéo thả file 3D vào đây
              </p>
              <p className="dash-dropzone-subtitle">
                hoặc <span className="dash-dropzone-link">chọn file từ máy tính</span>
              </p>
              <p className="dash-dropzone-hint">
                Hỗ trợ: .glb, .gltf — Tối đa 50MB
              </p>
            </div>
          ) : (
            /* FILE SELECTED — Preview */
            <div className="dash-file-preview">
              <div className="dash-file-preview-icon">
                <Box size={32} />
              </div>
              <div className="dash-file-preview-info">
                <p className="dash-file-preview-name">{fileInfo?.name}</p>
                <div className="dash-file-preview-meta">
                  <span className="dash-badge dash-badge-gold">
                    {fileInfo?.extension.toUpperCase()}
                  </span>
                  <span className="dash-file-preview-size">
                    {fileInfo ? formatFileSize(fileInfo.size) : ''}
                  </span>
                </div>
              </div>
              <div className="dash-file-preview-actions">
                <button
                  type="button"
                  className="dash-btn-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpload()
                  }}
                >
                  <FileUp size={16} />
                  Tải lên
                </button>
                <button
                  type="button"
                  className="dash-btn-danger"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReset()
                  }}
                  title="Xóa file"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UPLOADING state */}
      {uploadState === 'uploading' && (
        <div className="dash-dropzone dash-dropzone-uploading">
          <div className="dash-upload-spinner" />
          <p className="dash-dropzone-title" style={{ marginTop: '1rem' }}>
            Đang tải lên...
          </p>
          <p className="dash-dropzone-subtitle">
            {fileInfo?.name}
          </p>
          <div className="dash-upload-progress-bar">
            <div className="dash-upload-progress-fill" />
          </div>
        </div>
      )}

      {/* SUCCESS state */}
      {uploadState === 'success' && (
        <div className="dash-dropzone dash-dropzone-success">
          <div className="dash-upload-success-icon">
            <CheckCircle size={36} />
          </div>
          <p className="dash-dropzone-title" style={{ color: '#047857' }}>
            Tải lên thành công!
          </p>
          {fileInfo && (
            <p className="dash-dropzone-subtitle">
              {fileInfo.name} ({formatFileSize(fileInfo.size)})
            </p>
          )}
          {uploadedUrl && (
            <p className="dash-upload-url" title={uploadedUrl}>
              {uploadedUrl.length > 70
                ? uploadedUrl.substring(0, 70) + '...'
                : uploadedUrl}
            </p>
          )}
          <button
            type="button"
            className="dash-btn-secondary"
            onClick={handleReset}
            style={{ marginTop: '0.75rem' }}
          >
            Chọn file khác
          </button>
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
