const exp = require("express");
const path = require("path");
const routes = require("./routes/index");
const bodyParser = require("body-parser");

const application = exp();

application.set("views", path.join(__dirname, "views"));
application.set("view engine", "pug");

application.use(exp.static("public"));
application.use(bodyParser.urlencoded({ extended: true }));
application.use("/", routes);

module.exports = application;
