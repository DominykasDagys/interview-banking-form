import "@/styles/globals.css";
import "@/styles/fonts";

import type { AppProps } from "next/app";
import AlertBox from "@/components/AlertBox";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <AlertBox />
    </>
  );
}
