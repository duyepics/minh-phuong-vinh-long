import type { Metadata } from "next";
import { Cormorant, DM_Sans, Jost, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant({
  subsets: ["latin", "vietnamese"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext" ],
  variable: "--font-dm-sans",
});

const jost = Jost({
  subsets: ["latin", "latin-ext" ],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Gốm Sứ Minh Phương",
  description: "Trực quan hóa và bán lẻ gốm sứ Minh Phương",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body className={`${cormorant.variable} ${dmSans.variable} ${jost.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}