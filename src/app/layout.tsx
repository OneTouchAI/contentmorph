import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContentMorph - AI Content Repurposer",
  description: "Transform your content into multiple formats instantly. Create Twitter threads, LinkedIn posts, email newsletters, Instagram captions, and YouTube scripts with AI.",
  keywords: ["content repurposer", "AI content", "social media content", "content marketing", "AI writing"],
  openGraph: {
    title: "ContentMorph - AI Content Repurposer",
    description: "Transform your content into multiple formats instantly with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
