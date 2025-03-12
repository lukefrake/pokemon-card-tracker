'use client';

import { Inter } from 'next/font/google';
import "./globals.css";
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { StoreHydration } from '@/components/StoreHydration';
import { FirebaseInit } from '@/components/FirebaseInit';

const inter = Inter({ subsets: ['latin'] });

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${inter.className}`}>
      <FirebaseInit />
      <StoreHydration />
      <ServiceWorkerRegistration />
      {children}
    </div>
  );
} 