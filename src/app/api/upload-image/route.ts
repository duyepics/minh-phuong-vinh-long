import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Allowed image file extensions
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: Request) {
  try {
    // ─── 1. Parse FormData ───────────────────────────────────
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    // ─── 2. Validate file existence ─────────────────────────
    if (!file || file.size === 0) {
      return Response.json(
        { success: false, error: 'Không tìm thấy file. Vui lòng chọn một hình ảnh để tải lên.' },
        { status: 400 }
      )
    }

    // ─── 3. Validate file format ────────────────────────────
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return Response.json(
        {
          success: false,
          error: `Định dạng file không hợp lệ (${fileExtension}). Chỉ chấp nhận file ảnh: png, jpg, jpeg, webp, gif.`,
        },
        { status: 400 }
      )
    }

    // ─── 4. Validate file size ──────────────────────────────
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      return Response.json(
        {
          success: false,
          error: `File quá lớn (${sizeMB}MB). Dung lượng tối đa cho phép là 10MB.`,
        },
        { status: 400 }
      )
    }

    // ─── 5. Authenticate user via Supabase ──────────────────
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json(
        { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này.' },
        { status: 401 }
      )
    }

    // ─── 6. Generate unique filename ────────────────────────
    // Sanitize: remove spaces & special chars, keep extension
    const baseName = file.name
      .substring(0, file.name.lastIndexOf('.'))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 60) // Limit base name length
    const uniqueFilename = `${Date.now()}-${baseName}${fileExtension}`

    // ─── 7. Convert to ArrayBuffer & Upload to Cloudinary ───
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'minh_phuong_images',
          public_id: `${Date.now()}-${baseName}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    }).catch((uploadError) => {
      console.error('[upload-image] Cloudinary upload error:', uploadError)
      throw new Error(`Lỗi khi tải file lên Cloudinary: ${uploadError.message}`)
    })

    // ─── 8. Get Public URL ──────────────────────────────────
    const publicUrl = uploadResult.secure_url

    // ─── 9. Return success response ─────────────────────────
    return Response.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error('[upload-image] Unexpected error:', error)
    return Response.json(
      { success: false, error: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
