import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { rehydrateAuth } from "../features/authSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(rehydrateAuth());
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer />
      </Provider>
    </React.StrictMode>
  );
}

export default App;
