import type { Metadata, Viewport } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'ركلة | RAKLA — جهّز نفسك قبل الصافرة',
  description: 'معدات كرة القدم في الكويت. Gear up before the whistle.',
  icons: {
    icon: '/rakla-icon.png',
    apple: '/rakla-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B3D2E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
