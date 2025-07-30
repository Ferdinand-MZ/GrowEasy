export const dynamic = "force-dynamic";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "GrowEasy",
  description: "Finance Platform Website",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* header */}
          <Header></Header>

          <main className="min-h-screen bg-white text-gray-900">{children}</main>
          <Toaster richColors />

          {/* footer */}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made By Ferdinand Maulana Za Fauzi</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
