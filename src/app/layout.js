import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/components/ReduxProvider';
import './globals.css';
import { websiteName } from '@/lib';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: `${websiteName} - Watch anything anywhere`,
  description: `${websiteName} - A place where you may relax`,
  icon: '/logo.jpg',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <Toaster
            position='bottom-right'
            reverseOrder={false}
            containerClassName=''
            containerStyle={{}}
            toastOptions={{
              className: '',
              duration: 5000,
              style: {
                background: '#111',
                color: '#ddd',
              },
            }}
          />

          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
