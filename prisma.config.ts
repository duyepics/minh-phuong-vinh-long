import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  datasource: {
    // dotenv sẽ hỗ trợ Prisma lấy chính xác chuỗi kết nối từ file .env
    url: env('DIRECT_URL'),
  },
})