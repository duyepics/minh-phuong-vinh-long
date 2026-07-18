'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Hàm tự động tạo slug từ tiêu đề tiếng Việt:
 * - Chuyển sang chữ thường
 * - Loại bỏ dấu tiếng Việt (chuẩn hóa NFD + các kí tự đ/Đ và thay thế thủ công bổ sung)
 * - Xóa ký tự đặc biệt
 * - Thay thế khoảng trắng bằng dấu gạch nối (-)
 */
function generateSlug(title: string): string {
  let slug = title.toLowerCase();

  // Chuẩn hóa Unicode NFD tách dấu khỏi chữ cái và xóa dấu
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Thay thế chữ đ/Đ
  slug = slug.replace(/[đĐ]/g, 'd');

  // Bản đồ thay thế bổ sung đề phòng lỗi chuẩn hóa NFD trên một số môi trường
  slug = slug.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
  slug = slug.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
  slug = slug.replace(/[íìỉĩị]/g, 'i');
  slug = slug.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
  slug = slug.replace(/[úùủũụưứừửữự]/g, 'u');
  slug = slug.replace(/[ýỳỷỹỵ]/g, 'y');

  // Loại bỏ các ký tự không phải chữ cái, số, khoảng trắng hoặc dấu gạch ngang
  slug = slug.replace(/[^a-z0-9\s-]/g, '');

  // Thay thế chuỗi khoảng trắng bằng một dấu gạch ngang
  slug = slug.replace(/\s+/g, '-');

  // Loại bỏ dấu gạch ngang dư thừa
  slug = slug.replace(/-+/g, '-');

  // Cắt bỏ dấu gạch ngang ở đầu và cuối chuỗi
  slug = slug.trim().replace(/^-+|-+$/g, '');

  return slug;
}

// ─── Đọc danh sách bài viết ───────────────────────────────
export async function getPosts() {
  try {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
    return []
  }
}

// ─── Tạo bài viết mới ─────────────────────────────────────
export async function createPost(data: { title: string; content: string; published: boolean; imageUrl?: string | null }) {
  try {
    const { title, content, published, imageUrl } = data

    if (!title || title.trim().length === 0) {
      return { error: 'Tiêu đề bài viết không được để trống' }
    }

    const baseSlug = generateSlug(title)
    if (!baseSlug) {
      return { error: 'Tiêu đề không hợp lệ để tạo đường dẫn (slug)' }
    }

    // Đảm bảo slug là duy nhất bằng cách kiểm tra và sinh thêm hậu tố số nếu trùng
    let slug = baseSlug
    let counter = 1
    let exists = true

    while (exists) {
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      })
      if (!existingPost) {
        exists = false
      } else {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        content: content || '',
        imageUrl: imageUrl || null,
        published: published ?? false,
      },
    })

    revalidatePath('/admin/posts')
    return { success: true, post }
  } catch (error) {
    console.error('Lỗi khi tạo bài viết:', error)
    const errorMessage = error instanceof Error ? error.message : 'Không thể tạo bài viết. Vui lòng thử lại.'
    return { error: errorMessage }
  }
}

// ─── Xóa bài viết ─────────────────────────────────────────
export async function deletePost(id: string) {
  try {
    if (!id) {
      return { error: 'ID bài viết không hợp lệ' }
    }

    await prisma.post.delete({
      where: { id },
    })

    revalidatePath('/admin/posts')
    return { success: true }
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error)
    const errorMessage = error instanceof Error ? error.message : 'Không thể xóa bài viết. Vui lòng thử lại.'
    return { error: errorMessage }
  }
}

// ─── Lấy chi tiết bài viết ─────────────────────────────────
export async function getPost(id: string) {
  try {
    if (!id) return null
    return await prisma.post.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bài viết:', error)
    return null
  }
}

// ─── Cập nhật bài viết ─────────────────────────────────────
export async function updatePost(
  id: string,
  data: { title: string; content: string; published: boolean; imageUrl?: string | null }
) {
  try {
    const { title, content, published, imageUrl } = data

    if (!id) {
      return { error: 'ID bài viết không hợp lệ' }
    }

    if (!title || title.trim().length === 0) {
      return { error: 'Tiêu đề bài viết không được để trống' }
    }

    const baseSlug = generateSlug(title)
    if (!baseSlug) {
      return { error: 'Tiêu đề không hợp lệ để tạo đường dẫn (slug)' }
    }

    // Kiểm tra xem bài viết tồn tại không
    const currentPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!currentPost) {
      return { error: 'Bài viết không tồn tại' }
    }

    let slug = currentPost.slug

    // Nếu tiêu đề bị thay đổi, tự động tính toán lại slug duy nhất
    if (currentPost.title !== title.trim()) {
      slug = baseSlug
      let counter = 1
      let exists = true

      while (exists) {
        const existingPost = await prisma.post.findFirst({
          where: {
            slug,
            id: { not: id }, // Loại trừ chính nó
          },
        })
        if (!existingPost) {
          exists = false
        } else {
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        slug,
        content: content || '',
        imageUrl: imageUrl || null,
        published: published ?? false,
      },
    })

    revalidatePath('/admin/posts')
    return { success: true, post }
  } catch (error) {
    console.error('Lỗi khi cập nhật bài viết:', error)
    const errorMessage = error instanceof Error ? error.message : 'Không thể cập nhật bài viết. Vui lòng thử lại.'
    return { error: errorMessage }
  }
}

