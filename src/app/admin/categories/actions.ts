'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Helper: Tạo slug từ tên tiếng Việt ─────────────────
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Lấy tất cả danh mục (dạng cây) ────────────────────
export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
  return categories
}

// ─── Lấy danh mục phẳng (cho dropdown) ──────────────────
export async function getCategoriesFlat() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories
}

// ─── Tạo danh mục mới ──────────────────────────────────
export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const parentId = formData.get('parentId') as string | null
  let slug = formData.get('slug') as string

  if (!name || name.trim().length === 0) {
    return { error: 'Tên danh mục không được để trống' }
  }

  if (!slug || slug.trim().length === 0) {
    slug = generateSlug(name)
  }

  // Kiểm tra slug trùng
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) {
    return { error: 'Slug đã tồn tại. Vui lòng chọn slug khác.' }
  }

  await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      parentId: parentId && parentId !== '' ? parentId : null,
    },
  })

  revalidatePath('/admin/categories')
  revalidatePath('/admin/products')
  return { success: true }
}

// ─── Cập nhật danh mục ─────────────────────────────────
export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const parentId = formData.get('parentId') as string | null
  let slug = formData.get('slug') as string

  if (!name || name.trim().length === 0) {
    return { error: 'Tên danh mục không được để trống' }
  }

  if (!slug || slug.trim().length === 0) {
    slug = generateSlug(name)
  }

  // Kiểm tra slug trùng (trừ chính nó)
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing && existing.id !== id) {
    return { error: 'Slug đã tồn tại. Vui lòng chọn slug khác.' }
  }

  // Không cho phép chọn chính nó hoặc con của nó làm cha
  if (parentId === id) {
    return { error: 'Không thể chọn chính danh mục này làm danh mục cha' }
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: name.trim(),
      slug,
      parentId: parentId && parentId !== '' ? parentId : null,
    },
  })

  revalidatePath('/admin/categories')
  revalidatePath('/admin/products')
  return { success: true }
}

// ─── Xóa danh mục ──────────────────────────────────────
export async function deleteCategory(id: string) {
  // Kiểm tra có sản phẩm liên kết
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  })

  if (productCount > 0) {
    return { error: `Không thể xóa: danh mục đang có ${productCount} sản phẩm liên kết.` }
  }

  // Kiểm tra có danh mục con
  const childCount = await prisma.category.count({
    where: { parentId: id },
  })

  if (childCount > 0) {
    return { error: `Không thể xóa: danh mục đang có ${childCount} danh mục con.` }
  }

  await prisma.category.delete({ where: { id } })

  revalidatePath('/admin/categories')
  return { success: true }
}
