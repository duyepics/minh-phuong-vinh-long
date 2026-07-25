import { prisma } from '@/lib/prisma'
import AdminDashboardTabs, {
  SerializedContact,
  SerializedPost,
  SerializedProduct,
} from '@/components/admin/AdminDashboardTabs'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [
    productsCount,
    productsWith3dCount,
    pendingContactsCount,
    totalContactsCount,
    postsCount,
    publishedPostsCount,
    categoriesCount,
    recentContactsRaw,
    recentProductsRaw,
    recentPostsRaw,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { model3dUrl: { not: null } } }),
    prisma.contactRequest.count({ where: { status: 'PENDING' } }),
    prisma.contactRequest.count(),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.category.count(),
    prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        category: {
          select: { name: true },
        },
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const stats = {
    productsCount,
    productsWith3dCount,
    pendingContactsCount,
    totalContactsCount,
    postsCount,
    publishedPostsCount,
    categoriesCount,
  }

  const recentContacts: SerializedContact[] = recentContactsRaw.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    message: c.message,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }))

  const recentProducts: SerializedProduct[] = recentProductsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    imageUrl: p.imageUrl,
    model3dUrl: p.model3dUrl,
    price: p.price,
    categoryName: p.category?.name,
    createdAt: p.createdAt.toISOString(),
  }))

  const recentPosts: SerializedPost[] = recentPostsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    imageUrl: p.imageUrl,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="dash-page-title">Chào mừng trở lại!</h1>
          <span className="dash-page-title-underline"></span>
          <p className="dash-page-desc">
            Tổng quan tình hình kinh doanh gốm sứ Minh Phương Vĩnh Long hôm nay.
          </p>
        </div>
      </div>

      <AdminDashboardTabs
        stats={stats}
        recentContacts={recentContacts}
        recentProducts={recentProducts}
        recentPosts={recentPosts}
      />
    </div>
  )
}