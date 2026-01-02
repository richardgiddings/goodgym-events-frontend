## Introduction 

A React front end for the data retrieved in https://github.com/richardgiddings/goodgym-events-api from the Goodgym website.

Requires an environment variable like this point to the backend:
VITE_APP_URL=http://127.0.0.1:8000

Google Maps has been used to show locations of Goodgym events.
- Documentation for the Google Maps JavaScript API is [here](https://developers.google.com/maps/documentation/javascript/overview).
- React package to interact with Google Maps is [here](https://visgl.github.io/react-google-maps/).

For Google Maps we need the following two environment variables:
- VITE_MAPS_API_KEY - Your Google Maps API key.
- VITE_MAP_ID - Map configured on Google.

## Screenshots

### The map of events
![Alt text](screenshot.png?raw=true "site")

### The list of events
![Alt text](screenshot2.png?raw=true "site2")

## Installation

Install the dependencies:

```bash
npm install
```

## Development

Start the development server with:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```
