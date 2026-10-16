import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  icons: {
    icon: [
      { url: "/assets/images/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/images/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/assets/images/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e17",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body>
        {children}
        <div id="toast" role="status" aria-live="polite"></div>
      </body>
    </html>
  );
}
