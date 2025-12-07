import '@t3/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>T3 - Tic-Tac-Toe</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
