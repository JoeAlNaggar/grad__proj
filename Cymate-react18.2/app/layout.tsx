import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./lib/RouteGuard";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyMate",
  description: "All-in-one cybersecurity platform ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
          <Toaster position="bottom-right" richColors expand={true} />
        </AuthProvider>
      </body>
    </html>
  );
} 