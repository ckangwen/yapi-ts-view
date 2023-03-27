import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

import Layout from "components/layout/Layout";
import { API } from "utils/api";

import "styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default API.withTRPC(MyApp);
