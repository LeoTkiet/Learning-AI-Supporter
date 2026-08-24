import React from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="antialiased text-gray-900 selection:bg-[#1e3c72] selection:text-white">
      <Component {...pageProps} />
    </div>
  );
}
