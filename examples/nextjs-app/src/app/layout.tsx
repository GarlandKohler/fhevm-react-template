import './globals.css';
import type { Metadata } from 'next';
import { FhevmProvider } from './providers';

export const metadata: Metadata = {
  title: 'FHEVM Next.js Example',
  description: 'Example application using FHEVM SDK with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider>{children}</FhevmProvider>
      </body>
    </html>
  );
}
