
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BlogProvider } from "./context/BlogContext";
import LocalStorageSync from "./app/LocalStorageSync";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BlogProvider>
        <LocalStorageSync />
        <App />
      </BlogProvider>
    </Provider>
  </React.StrictMode>
);
