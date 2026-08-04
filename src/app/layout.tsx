import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ConfirmProvider } from '@/components/ConfirmProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Ruang Tani',
    template: '%s | Ruang Tani',
  },
  description:
    'Ruang Tani - etalase produk olahan hasil pertanian Gabungan Kelompok Tani Desa Tanjung Agung, Kecamatan Teluk Pandan, Kabupaten Pesawaran, Lampung.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body>
        <ConfirmProvider>{children}</ConfirmProvider>
      </body>
    </html>
  );
}
