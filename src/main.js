import React from "react";
import ReactDOM from "react-dom";
import RainRace from "./components/RainRace";
import "./index.css";
if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        localStorage.clear();
    });
}
ReactDOM.render(React.createElement(React.StrictMode, null,
    React.createElement(RainRace, null)), document.getElementById("root"));
