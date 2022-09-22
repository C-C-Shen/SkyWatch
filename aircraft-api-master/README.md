# Aircraft-API

A simple api to get performance numbers, characteristics and photos of a given aircraft or aircraft type.

## Introduction

This API compiles data from multiple sources into one endpoint. Users can query the API using aircraft registration and aircraft type to get ahold of performance data and photos.

## Installation

This API requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies to get the server running.

```sh
$ cd aircraft-api
$ npm install -d
$ npm run dev
```

The default `dev` script utilizes `nodemon` to refresh the server inbetween file changes. Make sure you include the `-d` flag during the `npm install` to make sure you install the developer dependencies!

## Endpoints

In its running state, this API serves the following endpoints:

### Get aircraft data

#### Request

`GET /acdata?reg=REGISTRATION&type=ICAO_TYPE`

#### Response

```json
{
    "aircraft_data": {
        "characteristics": { ... },
        "description": "...",
        "technical_data": { ... }
    },
    "photo": {
        "url": "...",
        "copyright": "..."
    },
    "tsData": { ... }
}
```

## Sources

| Name                       | URL                        |
| -------------------------- | -------------------------- |
| <span>Airliners.net</span> | https://www.airliners.net/ |
| JetPhotos                  | https://www.jetphotos.com/ |
| SkyBrary                   | https://www.skybrary.aero/ |
| Document 8643              | https://doc8643.com/       |
