import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리눅스 노트 · 터미널 실습장",
  description: "빈 터미널에서 시작하는 리눅스 공부. 120개 과제와 실시간 한국어 풀이.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
