import * as ReactDOM from "react-dom";
import * as React from "react";
import Router from './routes'
import app from "./app";
import { Config } from "../config"

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

const mapScript = document.createElement("script");
mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${Config.GOOGLE_MAPS_API_KEY}&callback=mapLoaded`;
mapScript.defer = true;
mapScript.async = true;

document.body.append(mapScript);
