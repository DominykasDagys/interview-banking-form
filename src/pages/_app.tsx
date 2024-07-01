import "@/styles/globals.css";
import "@/styles/fonts";

import type { AppProps } from "next/app";
import AlertBox from "@/components/AlertBox";
import Header from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <AlertBox />
    </>
  );
}
