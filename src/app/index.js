import React from "react";
import { render } from "react-dom";
import { Main } from "./components/App";

import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import "./app.css";

render(<Main />, document.getElementById("app"));
