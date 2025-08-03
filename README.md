# Angular-Aircraft-Airport-Search
Angular experiment for DevLabs

Make sure to obtain api keys/account information at the following sites:

https://aviationstack.com/documentation (100 requsets a month limit with free plan)

https://opensky-network.org/my-opensky

https://airlabs.co/ (1k requsets a month limit with free plan)


Once the required keys have been obtained, go into /aircraft-airport-search/api-keys.json and replace the appropriate values.

If using docker, run `docker compose up --build`

Otherwise:

1st, start image server/fetcher
![Aircraft_Page](https://github.com/user-attachments/assets/6d29f7d5-9731-434e-b29b-c4b4a9f2c617)

(this is a modified version of https://github.com/SkySails/aircraft-api)

`cd aircraft-api-master`

`npm install -d`

`npm run dev`

2nd, start web serve

`cd aircraft-airport-search`

`npm install -d`

`ng serve`

3rd, go to localhost:4200

# Design Documents:
<img width="356" height="287" alt="Endpoints" src="https://github.com/user-attachments/assets/97b7aa7f-604d-438d-af87-745e147025a4" />
<img width="468" height="307" alt="Design" src="https://github.com/user-attachments/assets/bad192d0-551d-4e46-892b-7367ab98010c" />

# Example Pages
<img width="468" height="224" alt="Main_Page" src="https://github.com/user-attachments/assets/3b1cfc83-ee18-4a32-b4f5-6ac143e0c5a0" />


# Other
![](https://github.com/C-C-Shen/SkyWatch/blob/main/Airport_Page.gif)
![](https://github.com/C-C-Shen/SkyWatch/blob/main/Aircraft_Page.gif)
