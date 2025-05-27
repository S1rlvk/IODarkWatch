import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ContactButton } from './components/ContactButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IODarkWatch',
  description: 'Maritime Domain Awareness Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ContactButton />
      </body>
    </html>
  );
} 