import { type Metadata } from 'next';
// import { GeistSans, GeistMono } from 'geist-font';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smartistics',
  description: 'Your description here',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en" className={inter.className}>
        <body className={`antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            
          </header>
          {children}
        </body>
      </html>
  
  );
}
