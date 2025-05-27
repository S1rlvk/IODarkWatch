import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999999,
        }}>
          <a 
            href="mailto:ssattigeri65@gmail.com"
            style={{
              display: 'inline-block',
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            Contact Us
          </a>
        </div>
        {children}
      </body>
    </html>
  );
} 