var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const asyncHandler = require("express-async-handler");
const fetch = require("node-fetch");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.get(
  "/fetchGoogleAPI",
  asyncHandler(async (req, res, next) => {
    const googleApiURL =
      "https://maps.googleapis.com/maps/api/js?key=" + process.env.googleAPIKEY;
    const response = await fetch(googleApiURL);
    const responseText = await response.text();
    res.set({
      "Content-Type": "text/javascript",
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(responseText);
  })
);

app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
