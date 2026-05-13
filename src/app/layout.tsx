import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Genotsyd × galixxss — Школьный андеграунд",
  description:
    "Школьный андеграунд. Треки о том, что рядом. Genotsyd × galixxss — честная музыка про школу, друзей, первые поцелуи и ночные прогулки.",
  keywords: ["Genotsyd", "galixxss", "андеграунд", "школьный рэп", "русский рэп"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning style={{ scrollBehavior: 'smooth' }}>
      <body
        className={`${orbitron.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ margin: 0, padding: 0, background: '#0a0a0a' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
