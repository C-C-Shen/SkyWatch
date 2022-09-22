const axios = require("axios");
const router = require("express").Router();
const cheerio = require("cheerio");
const fetch = require("node-fetch");

function isEven(n) {
    return n % 2 == 0;
}

router.get("", (req, res) => getData(req, res));

async function getData(req, res) {
    const reg = req.query["reg"];
    const type = req.query["type"];

    if (!reg && !type) {
        res.status(400).send("Query is invalid or not specified.");
        return;
    }

    var [photo, icao24] = await Promise.all([
        getPhotoURL(reg),
        getIcao24(reg),
    ]);

    res.status(200).send({
        photo: {
            url: photo.url,
            copyright: photo.cr,
        },
        icao24Hex: icao24,
    });

    // var [photo, acData, tsData] = await Promise.all([
    //     getPhotoURL(reg),
    //     getInfo(type),
    //     getTSData(reg),
    // ]);

    // res.status(200).send({
    //     aircraft_data: acData,
    //     photo: {
    //         url: photo.url,
    //         copyright: photo.cr,
    //     },
    //     tsData,
    // });
}

async function getIcao24(reg) {
    // const urlFindICAO = `https://www.planespotters.net/search?q=${reg}`;
    // const urlFindICAO = `https://www.flightradar24.com/data/aircraft/${reg}`
    // const urlFindICAO = `https://www.radarbox.com/data/registration/${reg}`
    const urlFindICAO = `https://api.joshdouch.me/reg-hex.php?reg=${reg}`

    try {
        let res = await axios({
            url: urlFindICAO,
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
            })
        if(res.status == 200){
            return res.data;
        }     
        return null;
    }
    catch (err) {
        console.error(err);
    }

    // const html = await axios.get(urlFindICAO);

    // if (!html) {
    //     return null;
    // }

    // let $ = cheerio.load(html.data);

    // var nextURLs = [];

    // $('span[id="txt-mode-s"]').each(function(index, element) {
    //     nextURLs.push($(element).text());
    // })

    // return nextURLs;
}

async function getTSData(reg) {
    // Reg variable can be a string with the following format: XXX
    // Notice how the country-specific designator should be left out!

    if (reg.includes("-")) reg = reg.split("-")[1];

    let resHTML = await fetch(
        "https://sle-p.transportstyrelsen.se/extweb/sv-se/sokluftfartyg",
        {
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,sv;q=0.8",
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: "TS.App.CurrentUICulture=sv-SE",
            },
            referrer:
                "https://sle-p.transportstyrelsen.se/extweb/sv-se/sokluftfartyg",
            referrerPolicy: "no-referrer-when-downgrade",
            body: `selection=regno&regno=${reg}&owner=&part=&item=&X-Requested-With=XMLHttpRequest`,
            method: "POST",
            mode: "cors",
        }
    )
        .then((res) => res.text())
        .then((html) => cheerio.load(html));

    let result = resHTML("tbody")
        .children()
        .map((i, row) => {
            row = resHTML(row);
            let title = row.find("td").first().text();
            let content = row.find("td").last().text();

            return {
                title,
                content,
            };
        })
        .get()
        .reduce((output, data) => {
            output[data.title] = data.content;
            return output;
        }, {});

    return result;
}

async function getInfo(type) {
    const urlSkyBrary =
        "https://www.skybrary.aero/api.php?" +
        new URLSearchParams({
            origin: "*",
            action: "parse",
            page: type,
            format: "json",
        });

    const url8643 = `https://doc8643.com/aircraft/${type}`;

    try {
        var [skyBraryHTML, DocHTML] = await Promise.all([
            fetch(urlSkyBrary)
                .then((r) => r.json())
                .then((json) => {
                    try {
                        return json.parse.text["*"];
                    } catch {
                        throw (
                            "Not able to find data for type: " +
                            type +
                            " on skybrary!"
                        );
                    }
                })
                .then((text) => cheerio.load(text)),
            fetch(url8643)
                .then((r) => r.text())
                .then((html) => {
                    try {
                        return cheerio.load(html);
                    } catch (e) {
                        console.log(e);
                        throw (
                            "Not able to find data for type: " +
                            type +
                            " on Document8643"
                        );
                    }
                }),
        ]);

        // Extract all info from the table into key-value pairs. Example: { property: "type", content: "PA28"}
        let acData = skyBraryHTML(".side > tbody > tr")
            .filter(
                (i, el) =>
                    !skyBraryHTML(el).find("table").length &&
                    skyBraryHTML(el).find("td").length
            )
            .map((i, el) => ({
                [skyBraryHTML(el)
                    .find("th")
                    .text()
                    .replace(/\r?\n|\r/g, "")]: skyBraryHTML(el)
                    .find("td")
                    .text()
                    .replace(/\r?\n|\r/g, ""),
            }))
            .get()
            .reduce((result, data) => {
                let [key, value] = Object.entries(data)[0];
                result[key] = value;
                return result;
            }, {});

        // Extract all technical data into key-value pairs. Example: { property: "Length", content: "7.1 m"}
        let technical_data = skyBraryHTML("#Technical_Data")
            .parent()
            .next()
            .find("tr")
            .map((i, el) => ({
                [skyBraryHTML(el)
                    .find("th")
                    .text()
                    .replace(/\r?\n|\r/g, "")]: skyBraryHTML(el)
                    .find("td")
                    .find(".smwtext").length
                    ? skyBraryHTML(el).find("td").find(".smwtext").text()
                    : skyBraryHTML(el)
                          .find("td")
                          .text()
                          .replace(/\r?\n|\r/g, ""),
            }))
            .get()
            .reduce((result, data) => {
                let [key, value] = Object.entries(data)[0];
                result[key] = value;
                return result;
            }, {});

        // Extract all technical data into key-value pairs from another source and merge it with current list, excluding duplicates
        DocHTML(".span6 dt")
            .map((i, el) => {
                el = DocHTML(el);
                let title = el.text();
                let description = DocHTML(".span6 dd").eq(i).text();
                return {
                    title,
                    description,
                };
            })
            .get()
            .reduce((result, data) => {
                if (
                    Object.keys(technical_data).find(
                        (key) =>
                            key.split(" ")[0].toLowerCase() ===
                            data.title.split(" ")[0].toLowerCase()
                    )
                )
                    return result;

                result[data.title] = data.description;
                return result;
            }, technical_data);

        return {
            characteristics: acData,
            description: skyBraryHTML("#Description")
                .parent()
                .next()
                .text()
                .replace(/\r?\n|\r/g, ""),
            technical_data,
        };
    } catch (e) {
        console.error("The following error ocurred:", e);
        if (!type)
            return "No type was defined, and the API was unable to automatically recognize it";
        return "Unable to find data for type: " + type;
    }
}

async function getPhotoURL(query) {
    const [JPphoto, ANETphoto] = await Promise.all([
        _getPhotoByQueryJP(query),
        // _getPhotoByQueryANET(query), // ignore due to errors
    ]);

    if (!JPphoto && !ANETphoto) {
        return "No photos found";
    }

    photo = JPphoto || ANETphoto; // format: { url: <URL>, cr: "JetPhotos / Airliners.net" }

    return photo;
}

async function _getPhotoByQueryJP(query) {
    const url = `https://www.jetphotos.com/photo/keyword/${query}`;

    const html = await axios.get(url);

    if (!html) {
        return null;
    }

    let $ = cheerio.load(html.data);

    let imageContainers = $(".result__photoLink");

    if (!imageContainers) {
        return null;
    }
    let imageContainer = imageContainers[0];

    if (!imageContainer) {
        return null;
    }

    let image = imageContainer.children[1].attribs.src;

    if (!image) {
        return null;
    }

    let split = image.substr(2).split("/");

    let id = split[split.length - 2] + "/" + split[split.length - 1];

    return {
        url: `https://cdn.jetphotos.com/full/${id}`,
        cr: "JetPhotos",
    };
}

async function _getPhotoByQueryANET(query) {
    const url = `https://www.airliners.net/search?keywords=${query}`;

    const html = await axios.get(url);

    if (!html) {
        return null;
    }

    let $ = cheerio.load(html.data);

    let imageContainers = $(".ps-v2-results-photo");

    if (!imageContainers) {
        return null;
    }

    let imageContainer = imageContainers[0];

    if (!imageContainer) {
        return null;
    }

    let imageSrc = $(imageContainer).find("img").attr("src");

    if (!imageSrc) {
        return null;
    }

    let imgURL = imageSrc.match("^[^-]*")[0] + ".jpg";

    return {
        url: imgURL,
        cr: "Airliners.net",
    };
}

module.exports = router;
