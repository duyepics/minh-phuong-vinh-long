'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Lấy tất cả sản phẩm ───────────────────────────────
export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      hotspots: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return products
}

// ─── Tạo sản phẩm mới ──────────────────────────────────
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string | null
  const imageUrl = formData.get('imageUrl') as string | null
  const model3dUrl = formData.get('model3dUrl') as string | null
  const categoryId = formData.get('categoryId') as string | null
  const price = formData.get('price') as string | null
  const height = formData.get('height') as string | null
  const width = formData.get('width') as string | null
  const baseDiameter = formData.get('baseDiameter') as string | null
  const capacity = formData.get('capacity') as string | null
  const weight = formData.get('weight') as string | null
  const glazeType = formData.get('glazeType') as string | null
  const material = formData.get('material') as string | null
  const pattern = formData.get('pattern') as string | null
  const artisan = formData.get('artisan') as string | null
  const packing = formData.get('packing') as string | null
  const usageNotes = formData.get('usageNotes') as string | null
  const origin = formData.get('origin') as string | null
  const hotspotsData = formData.get('hotspots') as string | null
  const imagesData = formData.get('images') as string | null

  if (!name || name.trim().length === 0) {
    return { error: 'Tên sản phẩm không được để trống' }
  }

  if (!slug || slug.trim().length === 0) {
    return { error: 'Slug không được để trống' }
  }

  // Kiểm tra slug trùng
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    return { error: 'Slug đã tồn tại. Vui lòng chọn slug khác.' }
  }

  let parsedHotspots = []
  if (hotspotsData) {
    try {
      parsedHotspots = JSON.parse(hotspotsData)
    } catch (e) {
      console.error('Failed to parse hotspots data:', e)
    }
  }

  let parsedImages = []
  if (imagesData) {
    try {
      parsedImages = JSON.parse(imagesData)
    } catch (e) {
      console.error('Failed to parse images data:', e)
    }
  }

  await prisma.product.create({
    data: {
      name: name.trim(),
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      model3dUrl: model3dUrl || null,
      price: price ? parseInt(price, 10) : null,
      categoryId: categoryId && categoryId !== '' ? categoryId : null,
      height: height || null,
      width: width || null,
      baseDiameter: baseDiameter || null,
      capacity: capacity || null,
      weight: weight || null,
      glazeType: glazeType || null,
      material: material || null,
      pattern: pattern || null,
      artisan: artisan || null,
      packing: packing || null,
      usageNotes: usageNotes || null,
      origin: origin || null,
      hotspots: {
        create: parsedHotspots.map((h: any) => ({
          position: h.position,
          normal: h.normal,
          label: h.label,
        })),
      },
      images: {
        create: parsedImages.map((img: any) => ({
          url: img.url,
          label: img.label || null,
        })),
      },
    },
  })

  revalidatePath('/admin/products')
  return { success: true }
}

// ─── Xóa sản phẩm ──────────────────────────────────────
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
    return { success: true } as const
  } catch (err) {
    console.error('Delete Product Error:', err)
    return { error: 'Không thể xóa sản phẩm. Vui lòng thử lại.' }
  }
}

// ─── Cập nhật sản phẩm ─────────────────────────────────
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string | null
  const imageUrl = formData.get('imageUrl') as string | null
  const model3dUrl = formData.get('model3dUrl') as string | null
  const categoryId = formData.get('categoryId') as string | null
  const price = formData.get('price') as string | null
  const height = formData.get('height') as string | null
  const width = formData.get('width') as string | null
  const baseDiameter = formData.get('baseDiameter') as string | null
  const capacity = formData.get('capacity') as string | null
  const weight = formData.get('weight') as string | null
  const glazeType = formData.get('glazeType') as string | null
  const material = formData.get('material') as string | null
  const pattern = formData.get('pattern') as string | null
  const artisan = formData.get('artisan') as string | null
  const packing = formData.get('packing') as string | null
  const usageNotes = formData.get('usageNotes') as string | null
  const origin = formData.get('origin') as string | null
  const hotspotsData = formData.get('hotspots') as string | null
  const imagesData = formData.get('images') as string | null

  if (!name || name.trim().length === 0) {
    return { error: 'Tên sản phẩm không được để trống' }
  }

  if (!slug || slug.trim().length === 0) {
    return { error: 'Slug không được để trống' }
  }

  // Kiểm tra slug trùng (trừ sản phẩm hiện tại)
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing && existing.id !== id) {
    return { error: 'Slug đã tồn tại. Vui lòng chọn slug khác.' }
  }

  let parsedHotspots = []
  if (hotspotsData) {
    try {
      parsedHotspots = JSON.parse(hotspotsData)
    } catch (e) {
      console.error('Failed to parse hotspots data:', e)
    }
  }

  let parsedImages = []
  if (imagesData) {
    try {
      parsedImages = JSON.parse(imagesData)
    } catch (e) {
      console.error('Failed to parse images data:', e)
    }
  }

  try {
    // Xóa các hotspot cũ
    await prisma.hotspot.deleteMany({ where: { productId: id } })
    
    // Xóa các hình ảnh cũ
    await prisma.productImage.deleteMany({ where: { productId: id } })
    
    // Cập nhật sản phẩm và tạo lại hotspot
    await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        imageUrl: imageUrl || null,
        model3dUrl: model3dUrl || null,
        price: price ? parseInt(price, 10) : null,
        categoryId: categoryId && categoryId !== '' ? categoryId : null,
        height: height || null,
        width: width || null,
        baseDiameter: baseDiameter || null,
        capacity: capacity || null,
        weight: weight || null,
        glazeType: glazeType || null,
        material: material || null,
        pattern: pattern || null,
        artisan: artisan || null,
        packing: packing || null,
        usageNotes: usageNotes || null,
        origin: origin || null,
        hotspots: {
          create: parsedHotspots.map((h: any) => ({
            position: h.position,
            normal: h.normal,
            label: h.label,
          })),
        },
        images: {
          create: parsedImages.map((img: any) => ({
            url: img.url,
            label: img.label || null,
          })),
        },
      },
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (err) {
    console.error('Update Product Error:', err)
    return { error: 'Không thể cập nhật sản phẩm. Vui lòng thử lại.' }
  }
}

