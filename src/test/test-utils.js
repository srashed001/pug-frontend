import * as React from "react";
import { render as rtlRender } from "@testing-library/react";
import store from "../store/rootreducer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

function render(ui, { ...options } = {}) {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
// override React Testing Library's render with our own
export { render };
