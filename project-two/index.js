const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(flash());

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.path = req.flash("path");
  next();
});

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// For Links to CSS & ICO files
app.use("/views", express.static("views"));

// Routes
app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
