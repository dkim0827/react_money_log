import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Promise from "promise-polyfill";

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
