import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clinical Action Layer",
  description: "AI sidecar for Medplum EMR - Draft clinical orders powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-100 min-h-screen flex">
        {children}
      </body>
    </html>
  );
}
