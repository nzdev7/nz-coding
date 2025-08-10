import './globals.css';
import SiteHeader from '../components/SiteHeader.js';
import SiteFooter from '../components/SiteFooter.js';
import { Roboto, Nunito } from 'next/font/google';
import { AppProviders } from '@/hooks/providers.js';

const roboto = Roboto({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const nunito = Nunito({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
});

export const metadata = {
  title: 'Nz | Full Stack Developer',
  description:
    'Nawaz is a professional website and mobile app developer who builds fast, responsive, and secure digital solutions. Explore projects, skills, and services that help businesses grow.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${nunito.variable}`}>
      <body className="transition-500 bg-primary text-secondary">
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
