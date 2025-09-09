import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

const root = createRoot(document.getElementById("root"));

console.log(document.getElementById("root"));

root.render(<App />);
