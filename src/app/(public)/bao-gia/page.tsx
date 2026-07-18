"use client";

import { useActionState, useEffect, useRef, useState, Suspense } from "react";
import { submitQuotationRequest } from "@/actions/quotation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Building2, Mail, MapPin, Phone, Send, ArrowRight, ChevronRight, Home, Package, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function QuotationContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitQuotationRequest, null);
  
  const searchParams = useSearchParams();
  const productName = searchParams.get('productName');
  const productImage = searchParams.get('productImage');
  const [quantity, setQuantity] = useState<number | string>(1);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();
      setQuantity(1);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleDecrease = () => {
    const currentQty = typeof quantity === 'number' ? quantity : (parseInt(quantity as string, 10) || 1);
    if (currentQty > 1) setQuantity(currentQty - 1);
  };

  const handleIncrease = () => {
    const currentQty = typeof quantity === 'number' ? quantity : (parseInt(quantity as string, 10) || 1);
    setQuantity(currentQty + 1);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <nav className="flex mb-4 text-sm font-medium" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-[var(--color-forest)]/70 hover:text-[var(--color-gold)] transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 md:ml-2 text-[var(--color-forest)] font-semibold">Nhận Báo Giá</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          
          {/* Cột thông tin liên hệ (Bên trái) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E0DCD4] transition-all hover:shadow-md">
              <h2 className="text-2xl font-bold font-heading text-[var(--color-forest)] mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-[var(--color-gold)] rounded-full"></span>
                Thông Tin Liên Hệ
              </h2>
              
              <div className="space-y-6">
                <div className="group flex items-start gap-4">
                  <div className="bg-[#F5F1EB] group-hover:bg-[var(--color-gold)] transition-colors duration-300 p-3 rounded-full text-[var(--color-forest)] group-hover:text-white mt-1 shadow-sm">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-forest)] font-body">Gốm Sứ Minh Phương</h3>
                    <p className="text-[#4A5E5E] text-sm mt-1 leading-relaxed">Xưởng sản xuất gốm sứ xuất khẩu và nội địa với kinh nghiệm lâu năm.</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="bg-[#F5F1EB] group-hover:bg-[var(--color-gold)] transition-colors duration-300 p-3 rounded-full text-[var(--color-forest)] group-hover:text-white mt-1 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-forest)] font-body">Địa chỉ</h3>
                    <p className="text-[#4A5E5E] text-sm mt-1 leading-relaxed">Tuyến Công Nghiệp Cổ Chiên, Ấp Long Hưng, Xã Thanh Đức, Huyện Long Hồ, Vĩnh Long</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="bg-[#F5F1EB] group-hover:bg-[var(--color-gold)] transition-colors duration-300 p-3 rounded-full text-[var(--color-forest)] group-hover:text-white mt-1 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-forest)] font-body">Hotline / Zalo</h3>
                    <p className="text-[#4A5E5E] text-sm mt-1 font-medium">0909 123 456 <span className="font-normal text-xs">(Mr. Minh)</span></p>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="bg-[#F5F1EB] group-hover:bg-[var(--color-gold)] transition-colors duration-300 p-3 rounded-full text-[var(--color-forest)] group-hover:text-white mt-1 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-forest)] font-body">Email</h3>
                    <p className="text-[#4A5E5E] text-sm mt-1 font-medium">contact@minhphuongceramics.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Box Quy trình (Bên trái dưới) */}
            <div className="bg-[var(--color-forest)] text-[#F5F1EB] p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--color-gold)] opacity-10 rounded-full blur-2xl pointer-events-none"></div>
              <h3 className="text-xl font-bold font-heading mb-4 text-[var(--color-gold)]">Quy trình báo giá</h3>
              <ul className="space-y-3 font-body text-sm text-[#F5F1EB]/80 relative z-10">
                <li className="flex items-start gap-3"><ArrowRight size={16} className="mt-0.5 text-[var(--color-gold)] flex-shrink-0" /> Tiếp nhận yêu cầu khách hàng</li>
                <li className="flex items-start gap-3"><ArrowRight size={16} className="mt-0.5 text-[var(--color-gold)] flex-shrink-0" /> Tư vấn mẫu mã & chất liệu</li>
                <li className="flex items-start gap-3"><ArrowRight size={16} className="mt-0.5 text-[var(--color-gold)] flex-shrink-0" /> Chốt số lượng và gửi bảng báo giá</li>
                <li className="flex items-start gap-3"><ArrowRight size={16} className="mt-0.5 text-[var(--color-gold)] flex-shrink-0" /> Sản xuất mẫu (nếu cần) & Ký Hợp đồng</li>
                <li className="flex items-start gap-3"><ArrowRight size={16} className="mt-0.5 text-[var(--color-gold)] flex-shrink-0" /> Sản xuất hàng loạt & Giao hàng</li>
              </ul>
            </div>
          </div>

          {/* Cột Form yêu cầu (Bên phải) */}
          <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#E0DCD4] relative">
            <h2 className="text-3xl font-bold font-heading text-[var(--color-forest)] mb-2">Gửi Yêu Cầu Báo Giá</h2>
            <p className="text-[#4A5E5E] text-sm mb-8 font-body">Vui lòng điền đầy đủ thông tin bên dưới, chúng tôi sẽ xử lý yêu cầu và phản hồi bạn trong thời gian sớm nhất.</p>
            
            <form ref={formRef} action={formAction} className="space-y-6 font-body">
              
              {productName && (
                <div className="bg-[#F5F1EB]/50 p-5 rounded-xl border border-[var(--color-gold)]/30 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  {productImage ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-lg overflow-hidden shrink-0 border border-[#E0DCD4] bg-white">
                      <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-lg overflow-hidden shrink-0 border border-[#E0DCD4] bg-white flex items-center justify-center">
                      <Package className="text-gray-400" size={32} />
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <h4 className="font-semibold text-[var(--color-forest)] text-lg mb-1">{productName}</h4>
                    <p className="text-sm text-gray-500 mb-3">Sản phẩm bạn đang quan tâm</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--color-slate)]">Số lượng dự kiến:</span>
                      <div className="flex items-center border border-[#D8D4CC] rounded-lg overflow-hidden bg-white shadow-sm">
                        <button type="button" onClick={handleDecrease} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#F5F1EB] hover:text-[var(--color-forest)] transition-colors active:bg-[#E0DCD4]">
                          <Minus size={14} />
                        </button>
                        <input 
                          type="text"
                          value={quantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setQuantity('');
                            } else {
                              const num = parseInt(val.replace(/\D/g, ''), 10);
                              setQuantity(isNaN(num) ? '' : num);
                            }
                          }}
                          className="w-14 h-9 text-center text-sm font-semibold text-[var(--color-forest)] border-x border-[#D8D4CC] outline-none focus:bg-gray-50 m-0 p-0"
                        />
                        <button type="button" onClick={handleIncrease} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#F5F1EB] hover:text-[var(--color-forest)] transition-colors active:bg-[#E0DCD4]">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Hidden inputs to pass data to Server Action */}
                  <input type="hidden" name="productName" value={productName} />
                  <input type="hidden" name="quantity" value={quantity.toString()} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-[var(--color-forest)]">Họ và tên <span className="text-red-500">*</span></label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ví dụ: Nguyễn Văn A" 
                    required 
                    className="h-12 border-[#D8D4CC] bg-[#FAFAF8] focus-visible:ring-[var(--color-gold)] focus-visible:border-[var(--color-gold)] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-[var(--color-forest)]">Số điện thoại <span className="text-red-500">*</span></label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="090..." 
                    required 
                    className="h-12 border-[#D8D4CC] bg-[#FAFAF8] focus-visible:ring-[var(--color-gold)] focus-visible:border-[var(--color-gold)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[var(--color-forest)]">Email</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="example@gmail.com" 
                    className="h-12 border-[#D8D4CC] bg-[#FAFAF8] focus-visible:ring-[var(--color-gold)] focus-visible:border-[var(--color-gold)] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-semibold text-[var(--color-forest)]">Tên công ty <span className="text-gray-400 font-normal text-xs">(Tùy chọn)</span></label>
                  <Input 
                    id="company" 
                    name="company" 
                    placeholder="Tên công ty/Cửa hàng" 
                    className="h-12 border-[#D8D4CC] bg-[#FAFAF8] focus-visible:ring-[var(--color-gold)] focus-visible:border-[var(--color-gold)] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-[var(--color-forest)]">
                  {productName ? "Nội dung yêu cầu thêm" : "Nội dung yêu cầu chi tiết"} {!productName && <span className="text-red-500">*</span>}
                </label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder={productName ? "Vui lòng cho chúng tôi biết yêu cầu về đóng gói, in logo, hoặc thắc mắc khác..." : "Vui lòng mô tả sản phẩm quan tâm, số lượng dự kiến, yêu cầu đóng gói..."} 
                  className="min-h-[140px] resize-y border-[#D8D4CC] bg-[#FAFAF8] focus-visible:ring-[var(--color-gold)] focus-visible:border-[var(--color-gold)] transition-colors p-4"
                  required={!productName} 
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-base font-accent tracking-wide uppercase bg-[var(--color-forest)] hover:bg-[var(--color-gold)] text-white hover:text-[var(--color-forest)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-xl" 
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Đang gửi yêu cầu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Send size={18} /> Gửi yêu cầu ngay</span>
                )}
              </Button>
              
              <p className="text-xs text-center text-[#6B7C7C] mt-6">
                Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng để liên hệ báo giá.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuotationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-gold)] border-t-[var(--color-forest)] rounded-full animate-spin"></div>
      </div>
    }>
      <QuotationContent />
    </Suspense>
  );
}
