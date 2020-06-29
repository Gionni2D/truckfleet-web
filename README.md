# Truck Fleet Webapp

Little demo of the exam project of *Software Engineering* course (*University of Bologna, Ingegneria informatica, 28021*)

## Install and run

To correctly use the Google Maps API, necessary to view the map in VisualizzaSpedizione, **you have to** [obtain your own Google Maps API token](https://developers.google.com/maps/documentation/javascript/get-api-key).

Then move `config.example.ts` to `config.ts` and replace `<YOUR_GOOGLE_MAPS_API_KEY>` with the token you obtained from the previous step.

With [yarn](https://yarnpkg.com/), open your terminal and run:

```bash
yarn install
yarn run start:dev
```

When it finish to build, go to http://localhost:8080