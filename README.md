# Angular-Aircraft-Airport-Search
Angular experiment for DevLabs

Make sure to obtain api keys/account information at the following sites:
https://aviationstack.com/documentation (100 requsets a month limit with free plan)
https://openskynetwork.github.io/opensky-api/rest.html#id10
https://airlabs.co/ (1k requsets a month limit with free plan)

Once the required keys have been obtained, go into /aircraft-airport-search/api-keys.json and replace the appropriate values.

1st, start image server/fetcher
(this is a modified version of https://github.com/SkySails/aircraft-api)

`cd aircraft-api-master`

`npm install -d`

`npm run dev`

2nd, start web serve

`cd aircraft-airport-serach`

`npm install -d`

`ng serve`

3rd, go to localhost:4200
