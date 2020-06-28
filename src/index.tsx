import * as ReactDOM from "react-dom";
import * as React from "react";
import Router from './routes'
import app from "./app";

ReactDOM.render(
	<Router />,
	document.getElementById("main")
);

declare global {
	interface Window {
		mapLoaded(): void
	}
}

window.mapLoaded = () => {
	app.onMapLoaded();
}