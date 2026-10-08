import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

// Every page depends on who is logged in, so never serve a cached copy.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Holiday Swap",
  description:
    "Buy and sell used holiday decor with your neighbors in North Fulton.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b91c1c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
