import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthLayout from '../components/AuthLayout';
import { FirebaseInit } from '../components/FirebaseInit';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pokemon Card Tracker',
  description: 'Track your Pokemon card collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseInit />
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
