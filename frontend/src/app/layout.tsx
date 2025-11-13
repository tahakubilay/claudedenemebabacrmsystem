import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Toaster } from "sonner";
import { CreateReceiptModal } from "@/components/modals/create-receipt-modal";
import { CreateTemplateModal } from "@/components/modals/create-template-modal";
import { CreateCalendarEventModal } from "@/components/modals/create-calendar-event-modal";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CRM V2",
  description: "Gelişmiş CRM Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans dark`}>
        <Toaster />
        <CreateReceiptModal />
        <CreateTemplateModal />
        <CreateCalendarEventModal />
        {children}
      </body>
    </html>
  );
}