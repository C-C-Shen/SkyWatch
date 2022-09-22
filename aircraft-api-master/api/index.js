const router = require("express").Router();

const acData = require("./acdata");

router.use("/acdata", acData);

module.exports = router;
