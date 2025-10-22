import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MuiThemeProvider } from '@/components/providers/MuiThemeProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AppHeader } from '@/components/layout/AppHeader';
import { Container } from '@/components/ui/Container';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>
            <MuiThemeProvider>
              <SnackbarProvider>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                  <AppHeader />
                </Container>
                {children}
              </SnackbarProvider>
            </MuiThemeProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
