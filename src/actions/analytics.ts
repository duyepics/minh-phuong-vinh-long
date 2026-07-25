'use server'

import { prisma } from '@/lib/prisma'

export type TimeRange = 'today' | '7days' | '30days' | 'all'

// ─── Ghi nhận 1 lượt xem sản phẩm hoặc bài viết ─────────────
export async function recordPageView(type: 'PRODUCT' | 'POST', entityId: string) {
  if (!entityId) return

  try {
    // 1. Tăng bộ đếm tổng views trong bảng Product / Post
    if (type === 'PRODUCT') {
      await prisma.product.update({
        where: { id: entityId },
        data: { views: { increment: 1 } },
      })
    } else if (type === 'POST') {
      await prisma.post.update({
        where: { id: entityId },
        data: { views: { increment: 1 } },
      })
    }

    // 2. Tạo bản ghi nhật ký PageView theo mốc thời gian (nếu bảng tồn tại)
    if (typeof (prisma as any).pageView !== 'undefined') {
      await prisma.pageView.create({
        data: {
          type,
          entityId,
        },
      })
    }
  } catch (err) {
    console.error('Error recording page view:', err)
  }
}

// ─── Lấy dữ liệu thống kê & phân tích theo mốc thời gian ────
export async function getAnalyticsData(timeRange: TimeRange = 'all') {
  try {
    let startDate: Date | null = null
    const now = new Date()

    if (timeRange === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (timeRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (timeRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Filter date condition for PageView and ContactRequest
    const pageViewWhere = startDate ? { createdAt: { gte: startDate } } : {}
    const contactWhere = startDate ? { createdAt: { gte: startDate } } : {}

    const hasPageView = typeof (prisma as any).pageView !== 'undefined'

    // Fetch products, posts, contact requests, and view logs concurrently
    const [allProducts, allPosts, contactRequests, productViewLogs, postViewLogs] =
      await Promise.all([
        prisma.product.findMany({
          select: { id: true, name: true, slug: true, imageUrl: true, price: true, views: true },
        }),
        prisma.post.findMany({
          select: { id: true, title: true, slug: true, imageUrl: true, views: true },
        }),
        prisma.contactRequest.findMany({
          where: contactWhere,
          select: { id: true, name: true, productName: true, createdAt: true },
        }),
        hasPageView
          ? prisma.pageView.findMany({
              where: { ...pageViewWhere, type: 'PRODUCT' },
              select: { entityId: true },
            })
          : Promise.resolve([]),
        hasPageView
          ? prisma.pageView.findMany({
              where: { ...pageViewWhere, type: 'POST' },
              select: { entityId: true },
            })
          : Promise.resolve([]),
      ])

    // Calculate view count map for products
    const productViewCountMap: Record<string, number> = {}
    if (timeRange === 'all') {
      allProducts.forEach((p: { id: string; views: number }) => {
        productViewCountMap[p.id] = p.views || 0
      })
    } else {
      productViewLogs.forEach((v: { entityId: string }) => {
        productViewCountMap[v.entityId] = (productViewCountMap[v.entityId] || 0) + 1
      })
    }

    // Calculate view count map for posts
    const postViewCountMap: Record<string, number> = {}
    if (timeRange === 'all') {
      allPosts.forEach((p: { id: string; views: number }) => {
        postViewCountMap[p.id] = p.views || 0
      })
    } else {
      postViewLogs.forEach((v: { entityId: string }) => {
        postViewCountMap[v.entityId] = (postViewCountMap[v.entityId] || 0) + 1
      })
    }

    // Calculate quote count per product
    const productQuoteCountMap: Record<string, number> = {}
    let totalQuotesWithProduct = 0

    contactRequests.forEach((req: { productName: string | null }) => {
      if (req.productName) {
        totalQuotesWithProduct++
        productQuoteCountMap[req.productName] = (productQuoteCountMap[req.productName] || 0) + 1
      }
    })

    // Sort Top Viewed Products
    const topViewedProducts = allProducts
      .map((p: any) => ({
        ...p,
        viewCount: productViewCountMap[p.id] || 0,
        quoteCount: productQuoteCountMap[p.name] || 0,
      }))
      .sort((a: any, b: any) => b.viewCount - a.viewCount)
      .slice(0, 10)

    // Sort Top Quoted Products
    const topQuotedProducts = allProducts
      .map((p: any) => ({
        ...p,
        viewCount: productViewCountMap[p.id] || 0,
        quoteCount: productQuoteCountMap[p.name] || 0,
      }))
      .filter((p: any) => p.quoteCount > 0)
      .sort((a: any, b: any) => b.quoteCount - a.quoteCount)
      .slice(0, 10)

    // Sort Top Viewed Posts
    const topViewedPosts = allPosts
      .map((p: any) => ({
        ...p,
        viewCount: postViewCountMap[p.id] || 0,
      }))
      .sort((a: any, b: any) => b.viewCount - a.viewCount)
      .slice(0, 10)

    const totalProductViews = Object.values(productViewCountMap).reduce((a: number, b: number) => a + b, 0)
    const totalPostViews = Object.values(postViewCountMap).reduce((a: number, b: number) => a + b, 0)
    const totalQuotes = contactRequests.length

    return {
      totalProductViews,
      totalPostViews,
      totalQuotes,
      totalQuotesWithProduct,
      topViewedProducts,
      topQuotedProducts,
      topViewedPosts,
    }
  } catch (err) {
    console.error('Error fetching analytics:', err)
    return {
      totalProductViews: 0,
      totalPostViews: 0,
      totalQuotes: 0,
      totalQuotesWithProduct: 0,
      topViewedProducts: [],
      topQuotedProducts: [],
      topViewedPosts: [],
    }
  }
}
