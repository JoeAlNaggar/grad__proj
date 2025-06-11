import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/(main)/globals.css";
import "../../styles/scrollbar-hide.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyMate",
  description: "Login or register to access Cymate",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
      </body>
    </html>
  )
} 