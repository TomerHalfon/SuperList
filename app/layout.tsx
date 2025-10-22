import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { MuiThemeProvider } from '@/components/providers/MuiThemeProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthGuard } from '@/components/features/auth/AuthGuard';
import { AppHeader } from '@/components/layout/AppHeader';
import { Container } from '@/components/ui/Container';
import { ClientLayout } from '@/components/layout/ClientLayout';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SuperList - Shopping List Manager",
  description: "Manage your shopping lists with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            <QueryProvider>
              <ThemeProvider>
                <MuiThemeProvider>
                  <SnackbarProvider>
                    <AuthGuard>
                      <Container maxWidth="lg" sx={{ py: 4 }}>
                        <AppHeader />
                      </Container>
                      {children}
                    </AuthGuard>
                  </SnackbarProvider>
                </MuiThemeProvider>
              </ThemeProvider>
            </QueryProvider>
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
