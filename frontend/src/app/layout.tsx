import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ClassMate - Hệ thống quản lý học tập',
  description: 'Nền tảng kết nối gia sư và học sinh ClassMate',
};

import { ThemeProvider } from '@/components/providers/theme-provider';
import { StoreProvider } from '@/components/providers/store-provider';
import { AuthInitializer } from '@/components/providers/auth-initializer';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <StoreProvider>
          <AuthInitializer>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}
