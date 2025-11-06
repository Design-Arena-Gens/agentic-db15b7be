import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Remylar ? Workflow Intelligence from Your Data',
  description: 'Enterprise AI infrastructure that turns your data into workflow intelligence.',
  metadataBase: new URL('https://agentic-db15b7be.vercel.app'),
  themeColor: '#0b0b0f'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
