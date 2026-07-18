"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitQuotationRequest(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;
    let message = formData.get("message") as string;
    
    const productName = formData.get("productName") as string;
    const quantity = formData.get("quantity") as string;

    if (productName) {
      message = `Sản phẩm quan tâm: ${productName}\nSố lượng dự kiến: ${quantity || 1}\n\nNội dung chi tiết:\n${message}`;
    }

    if (!name || !phone || !message) {
      return {
        error: "Vui lòng điền đầy đủ các thông tin bắt buộc (Tên, Số điện thoại, Nội dung).",
      };
    }

    await prisma.contactRequest.create({
      data: {
        name,
        email: email || null,
        phone,
        company: company || null,
        message,
        status: "PENDING",
      },
    });

    return {
      success: true,
      message: "Yêu cầu báo giá của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất!",
    };
  } catch (error) {
    console.error("Error submitting quotation:", error);
    return {
      error: "Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại sau.",
    };
  }
}
