import './globals.css';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { Roboto, Nunito } from 'next/font/google';
import { AppProviders } from '@/hooks/providers.js';
import SiteHeader from '../components/SiteHeader.js';
import SiteFooter from '../components/SiteFooter.js';

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
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: 'Welcome Back!',
            subtitle: 'Sign in required to update your experience',
          },
        },
        signUp: {
          start: {
            title: 'Create Account',
            subtitle: 'Account required to share your experience',
          },
        },
      }}
    >
      <html lang="en" className={`${roboto.variable} ${nunito.variable}`}>
        <body className="transition-500 bg-primary text-secondary">
          <AppProviders>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <Toaster position="top-right" closeButton richColors />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
