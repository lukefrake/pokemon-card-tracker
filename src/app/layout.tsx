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
  const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
