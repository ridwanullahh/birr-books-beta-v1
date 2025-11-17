import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Birr Books - Islamic Books & Audiobooks Platform',
  description: 'Discover authentic Islamic knowledge through books, audiobooks, and educational content. All in your language.',
  keywords: 'Islamic books, Quran, hadith, Islamic education, audiobooks, Arabic',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://birrbooks.com',
    siteName: 'Birr Books',
  },
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#05B34D" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans bg-white text-dark-slate`}>
        {children}
      </body>
    </html>
  );
}
