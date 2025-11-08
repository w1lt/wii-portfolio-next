import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SoundProvider } from "@/contexts/SoundContext";

export const metadata: Metadata = {
  title: "Will Whitehead - Portfolio",
  description: "Personal portfolio of Will Whitehead",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SoundProvider>
          <div className="gridlines">{children}</div>
        </SoundProvider>
      </body>
    </html>
  );
}
