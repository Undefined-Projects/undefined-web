import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';

// Fuentes alojadas en el propio sitio (sin depender de Google Fonts). Licencia OFL en app/fonts.
const figtree = localFont({ src: './fonts/Figtree.woff2', weight: '300 900', variable: '--font-sans', display: 'swap' });
const mono = localFont({ src: './fonts/JetBrainsMono.woff2', weight: '100 800', variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.undfinedclub.org'),
  title: { default: 'Undefined', template: '%s · Undefined' },
  description: '[TAGLINE DEL CLUB — una línea que diga qué es Undefined]',
  openGraph: { title: 'Undefined', siteName: 'Undefined', locale: 'es_MX', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#0F0C2A', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${figtree.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
