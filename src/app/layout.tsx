import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { StoreHydration } from '@/components/StoreHydration';
import { useEffect } from 'react';
import '../lib/firebase'; // Import firebase to ensure it initializes

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Pokemon Card Tracker",
  description: "Track your Pokemon card collection",
};

function FirebaseDebug() {
  useEffect(() => {
    console.log('[Firebase] Layout Mount:', {
      nodeEnv: process.env.NODE_ENV,
      time: new Date().toISOString(),
      location: window.location.href
    });
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <FirebaseDebug />
        <StoreHydration />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
