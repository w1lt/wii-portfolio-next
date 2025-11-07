import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SoundProvider } from "@/contexts/SoundContext";

export const metadata: Metadata = {
  title: "Will Whitehead - Portfolio",
  description: "Personal portfolio of Will Whitehead",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SoundProvider>
            <div className="gridlines">{children}</div>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
