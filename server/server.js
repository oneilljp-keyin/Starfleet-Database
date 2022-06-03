const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

const database = require("./api/database.routes.js");
const users = require("./api/users");

const app = express();

MONGO_URI = process.env.MONGO_DB_CONNECTION_STRING;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(console.log(`MongoDB connection for Authorization`))
  .catch((err) => console.log(err.message));

app.use(cors());
app.use(express.json());

// Passport config
require("./validation/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Routes
app.use("/api/v1/sfdatabase", database);
app.use("/api/users", users);
app.use("*", (req, res) => res.status(404).json({ error: "Page Not Found" }));

module.exports = app;
