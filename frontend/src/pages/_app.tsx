import React from 'react';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
