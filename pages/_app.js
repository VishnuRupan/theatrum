import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Layout from "../components/layout/Layout";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
