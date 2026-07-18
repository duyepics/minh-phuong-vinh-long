import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EB]">
      {/* Thanh Navbar cố định trên cùng */}
      <Navbar />

      {/* Nội dung trang web */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Chân trang Footer */}
      <Footer />
    </div>
  )
}
