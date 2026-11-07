import type { Metadata } from "next";
import "./globals.css";
import { IPMDataProvider } from "@/context/IPMDataContext";

export const metadata: Metadata = {
  title: "PD IPM Kota Yogyakarta • Portal Resmi Pimpinan Daerah Ikatan Pelajar Muhammadiyah",
  description:
    "Portal resmi Pimpinan Daerah Ikatan Pelajar Muhammadiyah Kota Yogyakarta. Pusat informasi gerakan pelajar, direktori Cabang dan Ranting se-Kota Yogyakarta, serta basis data pelajar berkemajuan.",
  icons: {
    icon: "/images/logo-ipm-jogja-trimmed.png",
    shortcut: "/images/logo-ipm-jogja-trimmed.png",
    apple: "/images/logo-ipm-jogja-trimmed.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-ipm-dark selection:bg-ipm-gold selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-ipm-gold focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-sm"
        >
          Lewati ke konten utama
        </a>
        <IPMDataProvider>{children}</IPMDataProvider>
      </body>
    </html>
  );
}
