const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authorization = require("../validation/authorization");
const ObjectId = require("mongodb").ObjectId;

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load user model
const User = require("../models/Users");

// Name and privilege retrieval
router.get("/:id", authorization, (req, res) => {
  o_id = new ObjectId(req.params.id);
  // console.log(o_id);
  User.findOne({ _id: o_id }).then((user) => {
    res.json(user);
  });
});

// get search history
router.get("/history/:id", authorization, async (req, res) => {
  let history;
  o_id = new ObjectId(req.params.id);
  const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING);

  try {
    await client.connect();
    history = await client
      .db(process.env.MONDO_DB_NAME)
      .collection("history")
      .find({ user_id: o_id })
      .sort({ date: -1 });
    return res.json(history);
  } catch (err) {
    console.error(err.message);
  }
});

// Registration
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json({ message: "Registration Successful" }))
            .catch((err) => console.error(err.message));
        });
      });
    }
  });
});

// Login
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // console.log(user);
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Email and/or Password Incorrect" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
        };

        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          {
            expiresIn: 31536000,
          },
          (err, token) => {
            res.json({
              success: true,
              token: token,
              user_id: payload.id,
            });
          }
        );
      } else {
        return res.status(400).json({ message: "Email and/or Password Incorrect" });
      }
    });
  });
});

module.exports = router;
