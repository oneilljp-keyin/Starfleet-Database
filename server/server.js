const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");

const database = require("./api/database.routes.js");
const passport = require("passport");
require("./passport/setup");
const auth = require("./api/auth");

const app = express();

MONGO_URI = process.env.MONGO_DB_CONNECTION_STRING;
// console.log(MONGO_URI);

// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true })
//   .then(console.log(`MongoDB connection for Authorization`))
//   .catch((err) => console.log(err.message));

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Express Session
const secretKey = process.env.SESSION_SECRET || "qwertyuiop1234567890";
app.use(
  session({
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/sfdatabase", database);
app.use("/api/auth", auth);
app.use("*", (req, res) => res.status(404).json({ error: "Page Not Found" }));

module.exports = app;
