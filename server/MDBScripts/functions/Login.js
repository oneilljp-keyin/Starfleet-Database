// This is a test, this is only a test

exports = async function (payload, response) {
  const users = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("users");
  const secretKey = context.values.get("secretKey");

  switch (context.request.httpMethod) {
    case "GET": {
      try {
        const jwToken = JSON.stringify(payload.headers.Authorization)
          .replace("Bearer ", "")
          .slice(2, -2);
        const decoded = utils.jwt.decode(jwToken, secretKey, false);
        const user = await users.findOne({
          _id: BSON.ObjectId(decoded._id),
          "tokens.token": jwToken,
        });
        return { name: user.name, email: user.email, admin: user.admin };
      } catch (e) {
        return { error: "401", message: "Invalid credientials, Please Sign In" };
      }
      break;
    }
    case "POST": {
      const loginInfo = EJSON.parse(payload.body.text());

      const njwt = require("njwt");
      const passwordHash = require("password-hash");

      const { errors, isValid } = await context.functions.execute("user_login", loginInfo);

      // Check Validation
      if (!isValid) return errors;

      const email = loginInfo.email.toLowerCase();
      const password = loginInfo.password;

      let userCheck;

      // Find user by email
      try {
        userCheck = await users.findOne({ email });
        // Check if user exists
        if (!userCheck) {
          return { error: "404", message: "Email and/or Password Incorrect" };
        }
      } catch (e) {
        return { message: e };
      }
      // Password hashing
      // const options = {algorithm: "md5", saltLength: 8, interations: 8}

      // let hashPass = passwordHash.generate(password, options);

      // console.log(passwordHash.verify('password1234', hashPass)); // true
      // console.log(passwordHash.verify('Password0', hashPass)); // false

      // return "Password Matched: " + passwordHash.verify(password, userCheck.password);

      let validToken;

      // Check password
      const isMatch = passwordHash.verify(password, userCheck.password);

      if (isMatch) {
        // User matched
        // Create JWT payload
        let tokenPayload = {
          _id: userCheck._id,
          exp: new Date("2022-12-31"),
          iat: new Date(),
        };

        // Sign token
        token = utils.jwt.encode("HS256", tokenPayload, secretKey);

        // add token to database for authorization
        let tokens = [];
        if (!userCheck.tokens) {
          tokens.push({ _id: BSON.ObjectId(), token: token });
        } else {
          tokens = userCheck.tokens.concat({ _id: BSON.ObjectId(), token });
        }

        let addToken = await users.updateOne(
          { _id: BSON.ObjectId(userCheck._id.toString()) },
          { $set: { tokens } }
        );

        return { token: token, id: userCheck._id.toString() };
      } else {
        return { error: "404", message: "Email and/or Password Incorrect" };
      }
    }
  }
};