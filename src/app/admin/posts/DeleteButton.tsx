'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deletePost } from './actions'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DeleteButtonProps {
  id: string
  title: string
}

export default function DeleteButton({ id, title }: DeleteButtonProps) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const res = await deletePost(id)
    setLoading(false)
    if (res.error) {
      alert(res.error)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        className="dash-btn-danger !p-2 !rounded-lg"
        title={`Xóa bài viết "${title}"`}
      >
        <Trash2 size={15} />
      </button>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết "{title}" không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="dash-btn-secondary"
              onClick={() => setConfirm(false)}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="button"
              className="dash-btn-primary !bg-red-600 hover:!bg-red-700 !text-white"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
