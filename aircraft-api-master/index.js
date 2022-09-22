var express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    api = require("./api");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // change to * to allow all
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization"
    );
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(api);

app.listen(port);

console.log("Server is live on port " + port);
