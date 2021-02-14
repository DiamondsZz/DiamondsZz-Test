import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";

const theme = extendTheme({
  styles: {
    global: {
      "html,body": {
        minWidth: "400px",
      },
    },
  },
});

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
