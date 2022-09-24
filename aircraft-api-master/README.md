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

## Modifications Made

Only portions being used are the JetPhotos call as well as an additional call to an API by https://api.joshdouch.me/ in order to get ICAO24 hex values from a known registration
