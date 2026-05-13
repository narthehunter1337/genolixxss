import type { Metadata } from "next";
import { Orbitron, Rubik_Mono_One, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rubikMonoOne = Rubik_Mono_One({
  variable: "--font-rubik-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GALIXS × GENOTSYD — Fracture Meridian | VOID RECORDS",
  description:
    "Two signals. One fracture. The collision of orbital silence and terrestrial fire. GALIXS × GENOTSYD — Fracture Meridian, September 2026.",
  keywords: ["GALIXS", "GENOTSYD", "Fracture Meridian", "VOID RECORDS", "luxury underground", "zero-gravity trap", "rust-belt phonk"],
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
    <html lang="en" suppressHydrationWarning style={{ scrollBehavior: 'smooth' }}>
      <body
        className={`${orbitron.variable} ${rubikMonoOne.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ margin: 0, padding: 0, background: '#080808' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
