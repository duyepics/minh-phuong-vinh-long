'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  MessageSquare,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'

export interface ContactItem {
  id: string
  name: string
  email: string | null
  phone: string
  company: string | null
  message: string | null
  status: string
  createdAt: string | Date
}

interface QuotationDetailModalProps {
  contact: ContactItem | null
  isOpen: boolean
  onClose: () => void
  onToggleStatus: (id: string, currentStatus: string) => void
  onDelete?: (id: string) => void
  isPending?: boolean
}

export default function QuotationDetailModal({
  contact,
  isOpen,
  onClose,
  onToggleStatus,
  onDelete,
  isPending = false,
}: QuotationDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!contact) return null

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const isResolved = contact.status === 'RESOLVED'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border border-[#E0DCD4]">
        {/* Header */}
        <div className="bg-[#FAF8F5] p-6 border-b border-[#E0DCD4] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-sand)]/60 text-[var(--color-forest)] flex items-center justify-center font-bold text-lg border border-[#E0DCD4]">
              <MessageSquare size={20} className="text-[var(--color-forest)]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-heading font-bold text-[var(--color-forest)]">
                Chi tiết Yêu cầu Báo giá
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                <Calendar size={12} /> Gửi lúc: {formatDate(contact.createdAt)}
              </p>
            </div>
          </div>
          <span
            className={`dash-badge ${
              isResolved ? 'dash-badge-green' : 'dash-badge-yellow'
            } font-medium px-3 py-1 text-xs`}
          >
            {isResolved ? (
              <>
                <CheckCircle2 size={13} /> Đã xử lý
              </>
            ) : (
              <>
                <Clock size={13} /> Chờ xử lý
              </>
            )}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Customer & Company info card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD4]">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Khách hàng
              </span>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--color-teak)]" />
                <p className="font-semibold text-base text-[var(--color-forest)]">
                  {contact.name}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD4]">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Công ty / Đơn vị
              </span>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-[var(--color-teak)]" />
                <p className="font-medium text-sm text-gray-800">
                  {contact.company || (
                    <span className="text-gray-400 italic">Khách hàng cá nhân</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details (Phone & Email) */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
              Thông tin liên lạc
            </span>

            {/* Phone row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E0DCD4] bg-white hover:border-[var(--color-teak)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-mono text-base font-semibold text-gray-900">
                    {contact.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(contact.phone, 'phone')}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                  title="Sao chép số điện thoại"
                >
                  {copiedField === 'phone' ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span className="text-green-600 font-medium">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
                <a
                  href={`tel:${contact.phone}`}
                  className="dash-btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Gọi ngay</span>
                </a>
              </div>
            </div>

            {/* Email row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E0DCD4] bg-white hover:border-[var(--color-teak)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.email || <span className="text-gray-400 italic">Không có email</span>}
                  </p>
                </div>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(contact.email!, 'email')}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                    title="Sao chép email"
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        <span className="text-green-600 font-medium">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${contact.email}`}
                    className="dash-btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} />
                    <span>Gửi Email</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Nội dung tư vấn / Yêu cầu báo giá
            </span>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD4] relative">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                {contact.message || <span className="text-gray-400 italic">Khách hàng không để lại ghi chú thêm.</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#E0DCD4] flex items-center justify-between gap-3">
          {onDelete ? (
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-medium">Xác nhận xóa?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(contact.id)
                      setShowDeleteConfirm(false)
                      onClose()
                    }}
                    className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                  >
                    Xóa luôn
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="dash-btn-danger text-xs !py-2 !px-3 flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Xóa</span>
                </button>
              )}
            </div>
          ) : <div />}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleStatus(contact.id, contact.status)}
              disabled={isPending}
              className={`dash-btn-primary text-xs !py-2 !px-4 flex items-center gap-2 ${
                isResolved
                  ? '!bg-amber-600 hover:!bg-amber-700'
                  : '!bg-emerald-700 hover:!bg-emerald-800'
              }`}
            >
              <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
              <span>{isResolved ? 'Chuyển thành Chưa xử lý' : 'Đánh dấu Đã xử lý'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="dash-btn-secondary text-xs !py-2 !px-4"
            >
              Đóng
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
