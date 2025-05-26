import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IODarkWatch - Maritime Domain Awareness',
  description: 'Real-time monitoring of vessels in the Indian Ocean region',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 