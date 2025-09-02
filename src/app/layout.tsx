import type { Metadata } from 'next';
import './globals.css';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'AXA Portfolio Insights',
  description: 'AXA Colpatria Portfolio Management Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthWrapper>
          {children}
        </AuthWrapper>
        <Toaster />
      </body>
    </html>
  );
}
