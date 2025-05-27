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
      <body className={inter.className} style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        color: '#fff',
        position: 'relative'
      }}>
        {children}
        <ContactButton />
      </body>
    </html>
  );
} 