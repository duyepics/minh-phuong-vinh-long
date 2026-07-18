'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Lấy tất cả yêu cầu báo giá ───────────────────────────────
export async function getContacts() {
  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return contacts
}

// ─── Cập nhật trạng thái yêu cầu ─────────────────────────────────
export async function updateContactStatus(id: string, status: string) {
  try {
    await prisma.contactRequest.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (err) {
    console.error('Update Contact Status Error:', err)
    return { error: 'Không thể cập nhật trạng thái. Vui lòng thử lại.' }
  }
}

// ─── Xóa yêu cầu báo giá ──────────────────────────────────────
export async function deleteContact(id: string) {
  try {
    await prisma.contactRequest.delete({ where: { id } })
    revalidatePath('/admin/contacts')
    return { success: true } as const
  } catch (err) {
    console.error('Delete Contact Error:', err)
    return { error: 'Không thể xóa yêu cầu. Vui lòng thử lại.' }
  }
}
