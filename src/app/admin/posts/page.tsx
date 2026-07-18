import Link from 'next/link'
import { FileText, Plus, Pencil } from 'lucide-react'
import { getPosts } from './actions'
import DeleteButton from './DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminPosts() {
  const posts = await getPosts()

  return (
    <div className="dash-animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="dash-page-title">Bài viết</h2>
          <span className="dash-page-title-underline" />
          <p className="dash-page-desc">
            Quản lý tin tức, bài viết và hướng dẫn của hệ thống
          </p>
        </div>
        <Link href="/admin/posts/new" className="dash-btn-primary">
          <Plus size={18} />
          Thêm bài viết mới
        </Link>
      </div>

      {/* Posts Table or Empty State */}
      <div className="dash-card overflow-hidden">
        {posts.length === 0 ? (
          <div className="dash-empty-state">
            <FileText className="dash-empty-state-icon" size={56} />
            <p className="dash-empty-state-title">Chưa có bài viết nào</p>
            <p className="dash-empty-state-desc">
              Nhấn nút &quot;Thêm bài viết mới&quot; để bắt đầu soạn thảo bài viết đầu tiên.
            </p>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="max-w-[400px]">
                    <div className="flex items-center gap-3">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E0DCD4] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#F5F1EB] border border-[#E0DCD4] flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm truncate" title={post.title}>
                          {post.title}
                        </p>
                        <code className="text-xs text-gray-400">
                          /{post.slug}
                        </code>
                      </div>
                    </div>
                  </td>
                  <td>
                    {post.published ? (
                      <span className="dash-badge dash-badge-green">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="dash-badge dash-badge-yellow">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="dash-btn-ghost !p-2 !rounded-lg hover:text-[#8B6C3E]"
                        title={`Sửa bài viết "${post.title}"`}
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-sm text-gray-500">
                  Tổng cộng: {posts.length} bài viết
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}
