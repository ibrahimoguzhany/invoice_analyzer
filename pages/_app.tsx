import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import SRLayout from '../components/layout'
import 'antd/dist/antd.css'


function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Scan Receipt</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SRLayout>
        <Component {...pageProps} /> 
      </SRLayout>
    </> 
  )
}

export default App