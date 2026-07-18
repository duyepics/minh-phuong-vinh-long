'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Helper to get all settings or a specific group of settings
export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany()
  
  // Convert array to key-value object
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)
  
  return settingsMap
}

// Update multiple settings at once
export async function updateSiteSettings(settings: Record<string, string>) {
  try {
    // Perform updates in a transaction
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    })

    await prisma.$transaction(updatePromises)
    
    // Revalidate paths that use these settings
    revalidatePath('/')
    revalidatePath('/admin/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình:', error)
    return { error: 'Không thể lưu cấu hình. Vui lòng thử lại.' }
  }
}

// Lấy danh sách các sản phẩm có mô hình 3D
export async function getProductsWith3DModel() {
  return await prisma.product.findMany({
    where: {
      model3dUrl: { not: null }
    },
    select: {
      id: true,
      name: true,
      model3dUrl: true
    },
    orderBy: { createdAt: 'desc' }
  })
}
