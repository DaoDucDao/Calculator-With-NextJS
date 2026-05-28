import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TutorialProvider } from "@/components/Tutorial";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CalcSuite - Calculator Toolkit",
  description:
    "Scientific calculator, programmer calculator, unit converter, and currency converter built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <ThemeProvider>
          <TutorialProvider>
            <Sidebar />
            <main className="flex-1 ml-56 min-h-screen">
              <PageTransition>{children}</PageTransition>
            </main>
          </TutorialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
