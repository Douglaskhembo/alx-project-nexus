import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { rehydrateAuth } from "../features/authSlice";
import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(rehydrateAuth());
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}

export default App;
