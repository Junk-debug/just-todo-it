import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import QueryClientProvider from '@/components/providers/query-client-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0A09' },
  ],
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Just todo it',
  description: 'Web todo application',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    title: 'Just todo it',
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider>
      <SessionProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} font-geist antialiased`}
          >
            <ThemeProvider
              defaultTheme="system"
              attribute="class"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </QueryClientProvider>
  );
}
