'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  MessageSquare,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Clock,
  Mail,
  Phone,
  Building,
} from 'lucide-react'
import { getContacts, updateContactStatus, deleteContact } from './actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type ContactRequest = {
  id: string
  name: string
  email: string | null
  phone: string
  company: string | null
  message: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [statusConfirm, setStatusConfirm] = useState<{ id: string; newStatus: string } | null>(null)
  
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const data = await getContacts()
    setContacts(data as ContactRequest[])
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    getContacts().then((data) => {
      if (active) {
        setContacts(data as ContactRequest[])
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const handleDelete = async (id: string) => {
    const result = await deleteContact(id)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Đã xóa yêu cầu thành công!' })
      await fetchData()
      setTimeout(() => setMessage(null), 3000)
    }
    setDeleteConfirm(null)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const result = await updateContactStatus(id, newStatus)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Cập nhật trạng thái thành công!' })
      await fetchData()
      setTimeout(() => setMessage(null), 3000)
    }
    setStatusConfirm(null)
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className="dash-animate-in">
      {renderMessageToast()}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="dash-page-title">Yêu cầu báo giá</h2>
          <span className="dash-page-title-underline" />
          <p className="dash-page-desc">
            Quản lý các yêu cầu liên hệ, báo giá từ khách hàng
          </p>
        </div>
      </div>

      {/* Contacts Table or Empty State */}
      <div className="dash-card dash-animate-in-delay-1 overflow-hidden">
        {loading ? (
          <div className="dash-empty-state">
            <div className="dash-upload-spinner" />
            <p className="dash-empty-state-desc mt-4">
              Đang tải danh sách...
            </p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="dash-empty-state">
            <MessageSquare className="dash-empty-state-icon" size={56} />
            <p className="dash-empty-state-title">
              Chưa có yêu cầu nào
            </p>
            <p className="dash-empty-state-desc">
              Khi khách hàng gửi yêu cầu báo giá, thông tin sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Thông tin liên hệ</th>
                <th>Nội dung</th>
                <th>Trạng thái & Ngày</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="align-top">
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {contact.name}
                    </div>
                    {contact.company && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Building size={12} />
                        {contact.company}
                      </div>
                    )}
                  </td>
                  <td className="align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-[var(--color-teak)]">{contact.phone}</a>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Mail size={14} className="text-gray-400" />
                          <a href={`mailto:${contact.email}`} className="hover:text-[var(--color-teak)]">{contact.email}</a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="align-top max-w-[300px]">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {contact.message || <span className="text-gray-400 italic">Không có lời nhắn</span>}
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="space-y-2">
                      {contact.status === 'RESOLVED' ? (
                        <span className="dash-badge dash-badge-green inline-flex">
                          <CheckCircle2 size={12} />
                          Đã xử lý
                        </span>
                      ) : (
                        <span className="dash-badge dash-badge-gold inline-flex">
                          <Clock size={12} />
                          Chờ xử lý
                        </span>
                      )}
                      <div className="text-xs text-gray-500">
                        {formatDate(contact.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="flex items-center justify-end gap-1">
                      {contact.status === 'PENDING' ? (
                        <button
                          className="dash-btn-ghost !p-2 !rounded-lg text-green-600 hover:bg-green-50"
                          onClick={() => setStatusConfirm({ id: contact.id, newStatus: 'RESOLVED' })}
                          title="Đánh dấu đã xử lý"
                        >
                          <Check size={15} />
                        </button>
                      ) : (
                        <button
                          className="dash-btn-ghost !p-2 !rounded-lg text-yellow-600 hover:bg-yellow-50"
                          onClick={() => setStatusConfirm({ id: contact.id, newStatus: 'PENDING' })}
                          title="Đánh dấu chờ xử lý"
                        >
                          <Clock size={15} />
                        </button>
                      )}
                      <button
                        className="dash-btn-danger"
                        onClick={() => setDeleteConfirm(contact.id)}
                        title="Xóa yêu cầu"
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
                  Tổng cộng: {contacts.length} yêu cầu báo giá
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa yêu cầu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa yêu cầu báo giá này không? Hành động này không thể hoàn tác.
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

      {/* Status Update Confirmation Dialog */}
      <Dialog open={!!statusConfirm} onOpenChange={(open) => !open && setStatusConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
            <DialogDescription>
              Bạn muốn đổi trạng thái yêu cầu này thành "{statusConfirm?.newStatus === 'RESOLVED' ? 'Đã xử lý' : 'Chờ xử lý'}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="dash-btn-secondary"
              onClick={() => setStatusConfirm(null)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="dash-btn-primary"
              onClick={() => statusConfirm && handleUpdateStatus(statusConfirm.id, statusConfirm.newStatus)}
            >
              Xác nhận
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
