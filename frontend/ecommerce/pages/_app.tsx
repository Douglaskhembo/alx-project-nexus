import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}