import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Monitoreo de acceso CUCEI',
  description:
    'Aplicación para el monitoreo de la entrada de automóviles en CUCEI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
