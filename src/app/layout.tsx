import type { Metadata } from "next";
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: "Pokemon Card Tracker",
  description: "Track your Pokemon card collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
