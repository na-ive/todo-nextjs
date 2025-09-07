import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TODOs na-ive",
  description: "TODOS Apps With Next.js + Express.js + PostgreSQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeScript />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col justify-center items-center">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
