const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const errorController = require("./controller/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

const adminRoutes = require("./routes/admin");
const siteRoutes = require("./routes/site");
const helpers = require("./util/helper.js");

app.use(
  session({
    secret: "mysecret", // Güvenli bir şekilde saklanması gereken bir anahtar
    resave: false,
    user: null,
    saveUninitialized: true,
    cookie: {
      expires: 120000000,
    },
  })
);
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  helpers;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname + "src/public/uploads"));
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/admin", adminRoutes);
app.use(siteRoutes);

app.use(errorController.get404);

app.listen(3000);

console.log("App is listening on port 3000");
