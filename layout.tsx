import '@/styles/globals.css';
import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import QueryProvider from '@/providers/QueryProvider';

export const metadata = {
  title: 'pNodes Dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <QueryProvider>
          {/* skip link for A11Y */}
          <a href="#content" className="sr-only focus:not-sr-only focus:visible p-2 m-2 rounded bg-accent/10">Skip to content</a>

          <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col">
              <Header />

              <main id="content" className="p-6 md:p-8 lg:p-10 overflow-auto" role="main">
                <div className="max-w-[1400px] mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
