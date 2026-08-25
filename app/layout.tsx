import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IODarkWatch',
  description: 'A demo maritime-surveillance dashboard for the Indian Ocean, built on simulated data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 